// Core framework + utilities
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import http from "http";

// Route handlers
import userRouter from "./routes/userRoutes.js";

// Sockets
import socket from "socket.io";
import socketIO from "./socket.js";

// Load environment variables from a .env file into `process.env`.
// Ensure you have `dotenv` installed (`npm install dotenv`) and a .env file in the project root.
import dotenv from "dotenv";
dotenv.config();

const app = express();
const server = http.createServer(app);
// Initialize Socket.IO with CORS options to match the frontend origin
const io = socket(server, {
  cors: {
    origin: ["https://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware
// Enable Cross-Origin Resource Sharing so the frontend can call this API
app.use(cors());
// Parse incoming JSON payloads
app.use(express.json());

// Connect to MongoDB using the connection string from environment variables
// Replace the placeholder or ensure `process.env.MONGO_URI` is set in your .env file
mongoose
  .connect(process.env.MONGO_URI || "mongo url")
  .then(() => console.log("Connected to DB"))
  .catch((e) => {
    console.log("MongoDB connection failed", e);
  });

// Initialize socket event handlers (defined in ./socket.js)
socketIO(io);

// API routes
app.use("/api/users", userRouter);

const PORT = process.env.PORT || 5000;

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
