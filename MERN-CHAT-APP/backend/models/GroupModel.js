import bcrypt from "bcryptjs";
import mongoose from "mongoose";

// Define the schema for a Group collection
const groupSchema = new mongoose.Schema(
  {
    // `name` field: stores the group name
    name: {
      type: String,
      required: true,
      trim: true,
    },
    // `description` field: stores the group description
    description: {
      type: String,
      required: true,
    },
    // `members` field: stores the users that belong to the group
    members: [
      {
        type: mongoose.Schema.Types.ObjectId, // Stores each member's MongoDB ObjectId
        ref: "User", // Links each member to the User model
      },
    ],
    // `admin` field: stores the group administrator's user id
    admin: {
      type: mongoose.Schema.Types.ObjectId, // Stores the admin user's MongoDB ObjectId
      ref: "User", // Links this field to the User model
    },
  },
  {
    // Automatically add `createdAt` and `updatedAt` timestamps
    timestamps: true,
  },
);

// Create the Mongoose model named 'Group' based on the schema
const Group = mongoose.model("Group", groupSchema);

// Export the model as the default export for other modules to import
export default Group;
