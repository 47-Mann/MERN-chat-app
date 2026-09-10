import express from "express";
const router = express.Router();
import Group from "../models/GroupModel.js";
import protect from "../middleware/authMiddleware.js";

// POST /api/groups creates a group for the authenticated user.
router.post("/", protect, async (req, res) => {
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
      .populate("admin", "username email")
      .populate("members", "username email");
    res.status(201).json({ populateGroup });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
});

export default router;
