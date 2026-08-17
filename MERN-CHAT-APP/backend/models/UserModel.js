// Import bcrypt to hash passwords before saving to the database
import bcrypt from "bcryptjs";
// Import mongoose to define schemas and models for MongoDB
import mongoose from "mongoose";

// Define the schema for a User collection
const userSchema = new mongoose.Schema(
  {
    // `userName` field: stores the user's display name
    userName: {
      type: String, // data type is String
      required: true, // this field is required
      trim: true, // trim surrounding whitespace before saving
    },
    // `email` field: stores the user's email address
    email: {
      type: String, // data type is String
      required: true, // email is required
      lowercase: true, // convert email to lowercase before saving
      trim: true, // trim surrounding whitespace
    },
    // `password` field: stores the hashed password
    password: {
      type: String, // data type is String (we store the hash)
      required: true, // password is required when creating a user
    },
    // `isAdmin` field: boolean flag for admin privileges
    isAdmin: {
      type: Boolean, // data type is Boolean
      default: false, // default to non-admin users
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
  // Hash the password with a salt rounds value of 10
  this.password = await bcrypt.hash(this.password, 10);
  // Continue with save
  return next();
});

// Create the Mongoose model named 'User' based on the schema
const User = mongoose.model("User", userSchema);

// Export the model as the default export for other modules to import
export default User;
