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
    const group = await Group.findByIdAndUpdate(
      req.params.groupId,
      { $addToSet: { members: req.user._id } },
      { new: true, runValidators: true },
    )
      .populate("admin", "userName email")
      .populate("members", "userName email");

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    return res.status(200).json(group);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.get("/:groupId/group", protect, async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId)
      .populate("admin", "userName email")
      .populate("members", "userName email");

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const isMember = group.members.some(
      (member) => member._id.toString() === req.user._id.toString(),
    );

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
