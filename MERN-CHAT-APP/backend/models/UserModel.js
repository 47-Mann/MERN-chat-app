import bcrypt from "bcryptjs";
import mongoose from "mongoose";

// Define the schema for a User collection
const userSchema = new mongoose.Schema(
  {
    // `userName` field: stores the user's display name
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    // `email` field: stores the user's email address
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    // `password` field: stores the hashed password
    password: {
      type: String,
      required: true,
    },
    // `isAdmin` field: boolean flag for admin privileges
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    // Automatically add `createdAt` and `updatedAt` timestamps
    timestamps: true,
  },
);

// Pre-save middleware: hash the password before saving the document
userSchema.pre("save", async function (next) {
  // `this` refers to the document being saved
  if (!this.isModified("password")) {
    // If the password wasn't changed, skip hashing
    return next();
  }
  // Hash the plain-text password with bcrypt using 10 salt rounds (cost ≈ 2^10) and replace `this.password` with the resulting hash
  this.password = await bcrypt.hash(this.password, 10);
  // Continue with save
  return next();
});

// Create the Mongoose model named 'User' based on the schema
const User = mongoose.model("User", userSchema);

// Export the model as the default export for other modules to import
export default User;
