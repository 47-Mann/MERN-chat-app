import express from "express";
import Message from "../models/ChatModel.js";
import { protect } from "../middleware/authMiddleware.js";

const messageRouter = express.Router();

// POST /api/messages sends a message from the authenticated user to a group.
messageRouter.post("/", protect, async (req, res) => {
  try {
    const { content, groupId } = req.body;

    // Store the authenticated user as the sender instead of trusting the request body.
    const message = await Message.create({
      sender: req.user._id,
      content,
      group: groupId,
    });

    // Return sender details so clients can render the message without another request.
    const populatedMessage = await Message.findById(message._id).populate(
      "sender",
      "userName email",
    );

    return res.status(201).json(populatedMessage);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// GET /api/messages/:groupId returns the newest messages for a group first.
messageRouter.get("/:groupId", protect, async (req, res) => {
  try {
    // Filter by the group reference so messages from other groups are excluded.
    const messages = await Message.find({ group: req.params.groupId })
      .populate("sender", "userName email")
      .sort({ createdAt: -1 });

    return res.json(messages);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

export default messageRouter;
