import express from "express";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";

const userRouter = express.Router();

// User routes
//
// This file exposes authentication-related routes for the application:
// - POST /register : create a new user (checks for existing email)
// - POST /login    : authenticate user and return a JWT token
//
// Notes:
// - `User` is a Mongoose model defined at ../models/UserModel.js. The model
//   is expected to implement a method `matchPass(password)` (or similar)
//   to verify a hashed password — the route calls `user.matchPass(password)`.
// - `generateToken(id)` signs a JWT using `process.env.JWT_SECRET`. Ensure
//   the environment variable is set in your runtime (e.g., .env or hosting config).
// - Error handling: the routes return appropriate HTTP status codes and JSON
//   messages for common failure cases.

// POST /register
// Create a new user account. Checks whether the email already exists, and
// if not, creates the user document in MongoDB and returns basic user info.
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

    // Create the new user document in MongoDB. The model should handle
    // password hashing in a pre-save hook or similar — we pass the raw
    // password here and rely on the model to store a hashed password.
    const user = await User.create({ userName, email, password });

    // If user creation succeeds, return the new user details.
    if (user) {
      return res.status(201).json({
        _id: user._id,
        userName: user.userName,
        email: user.email,
      });
    }

    // If creation did not throw but also did not return a user, respond
    // with a generic 400 error to avoid leaving the request hanging.
    return res.status(400).json({ message: "Invalid user data" });
  } catch (error) {
    // Catch any database or validation errors and return them to the client.
    return res.status(400).json({ message: error.message });
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPass(password))) {
      res.json({
        user: {
          _id: user._id,
          username: user.userName,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user._id),
        },
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};
export default userRouter;
