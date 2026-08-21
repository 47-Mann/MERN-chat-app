import express from "express";
import User from "../models/UserModel.js";

const userRouter = express.Router();

// POST /register
// This route creates a new user account.
// It checks if the email already exists, then saves the user to MongoDB.
userRouter.post("/register", async (req, res) => {
  try {
    // Read the incoming data from the request body.
    const { userName, email, password } = req.body;

    // Check whether a user with the same email already exists.
    const userExists = await User.findOne({ email });

    if (userExists) {
      // If the user exists, stop and send a 400 error.
      return res.status(400).json({ message: "User already exists" });
    }

    // Create the new user document in MongoDB.
    const user = await User.create({ userName, email, password });

    // If user creation succeeds, return the new user details.
    if (user) {
      return res.status(201).json({
        _id: user._id,
        userName: user.userName,
        email: user.email,
      });
    }
  } catch (error) {
    // Catch any database or validation errors and return them to the client.
    return res.status(400).json({ message: error.message });
  }
});

export default userRouter;
