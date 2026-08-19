import bcrypt from "bcryptjs";
import mongoose, { Model } from "mongoose";

// Define the schema for a Message collection
const messageSchema = new mongoose.Schema(
  {
    // `sender` field: stores the id of the user who sent the message
    sender: {
      type: mongoose.Schema.Types.ObjectId, // Stores the user's MongoDB ObjectId who sent the message
      required: true,
      ref: "User", // Links this field to the User model
    },
    // `content` field: stores the message text
    content: {
      type: String,
      required: true,
    },
    // `group` field: stores the id of the group the message belongs to
    group: {
      type: mongoose.Schema.Types.ObjectId, // Stores the group's MongoDB ObjectId
      ref: "Group", // Links this field to the Group model
    },
  },
  {
    // Automatically add `createdAt` and `updatedAt` timestamps
    timestamps: true,
  },
);

// Create the Mongoose model named 'Message' based on the schema
const Message = mongoose.model("Message", messageSchema);

// Export the model as the default export for other modules to import
export default Message;
