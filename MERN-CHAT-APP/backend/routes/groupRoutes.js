import express from "express";
const router = express.Router();
import Group from "../models/GroupModel.js";
import { protect, requireAdmin } from "../middleware/authMiddleware.js";

// POST /api/groups creates a group for an authenticated administrator.
// `protect` verifies the JWT; `requireAdmin` checks the user's admin flag.
router.post("/", protect, requireAdmin, async (req, res) => {
  try {
    const { name, description } = req.body;

    // The authenticated user becomes both the first member and the admin.
    const group = await Group.create({
      name,
      description,
      admin: req.user._id,
      members: [req.user._id],
    });

    // Return user details instead of only the stored ObjectId references.
    const populateGroup = await Group.findById(group._id)
      .populate("admin", "userName email")
      .populate("members", "userName email");
    res.status(201).json({ populateGroup });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
});

// GET /api/groups returns all groups for any authenticated user.
router.get("/", protect, async (req, res) => {
  try {
    const group = await Group.find()
      .populate("admin", "userName email")
      .populate("members", "userName email");
    res.json(group);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST /api/groups/:groupId/join adds the authenticated user to a group.
router.post("/:groupId/join", protect, async (req, res) => {
  try {
    // Load the group before changing it so we can validate membership.
    const group = await Group.findById(req.params.groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Compare ObjectIds as strings because `includes` does not compare their values reliably.
    const isMember = group.members.some(
      (member) => member.toString() === req.user._id.toString(),
    );

    if (isMember) {
      return res
        .status(400)
        .json({ message: "Already a member of this group" });
    }

    // Add the authenticated user and persist the changed group document.
    group.members.push(req.user._id);
    await group.save();

    return res.status(200).json({ message: "Joined this group" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// DELETE /api/groups/:groupId/leave removes the authenticated user from a group.
router.delete("/:groupId/leave", protect, async (req, res) => {
  try {
    // Check the admin before removing the user so every group keeps an owner.
    const existingGroup = await Group.findById(req.params.groupId).select(
      "admin",
    );

    if (!existingGroup) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (existingGroup.admin?.toString() === req.user._id.toString()) {
      return res.status(409).json({
        message: "The group admin cannot leave the group",
      });
    }

    // `$pull` removes this user and leaves all other group members unchanged.
    const group = await Group.findByIdAndUpdate(
      req.params.groupId,
      { $pull: { members: req.user._id } },
      { new: true, runValidators: true },
    )
      .populate("admin", "userName email")
      .populate("members", "userName email");

    return res.status(200).json(group);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.get("/:groupId/group", protect, async (req, res) => {
  try {
    // Populate references because the endpoint returns user details, not just IDs.
    const group = await Group.findById(req.params.groupId)
      .populate("admin", "userName email")
      .populate("members", "userName email");

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Compare IDs as strings because populated members are User documents.
    const isMember = group.members.some(
      (member) => member._id.toString() === req.user._id.toString(),
    );

    // Only group members may view the group's protected details.
    if (!isMember) {
      return res
        .status(403)
        .json({ message: "You are not a member of this group" });
    }

    return res.json(group);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});
export default router;
