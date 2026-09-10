// Core framework + utilities
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";

// Route handlers
import userRouter from "./backend/routes/userRoutes.js";
import groupRouter from "./backend/routes/groupRoutes.js";

// Sockets
import socketIO from "./backend/socket.js";

// Load environment variables from a .env file into `process.env`.
import dotenv from "dotenv";
dotenv.config();

const app = express();
const server = http.createServer(app);

// Socket.IO shares the HTTP server and allows the frontend to connect from the
// local development origins listed below.
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: ["http://localhost:5173", "https://localhost:5173"],
    credentials: true,
  }),
);
app.use(express.json());

// Support either environment variable name while warning when neither exists.
const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!mongoUri) {
  console.warn(
    "MONGO_URI is not set. Add it to the .env file before running the app.",
  );
}

mongoose
  .connect(mongoUri)
  .then(() => console.log("Connected to DB"))
  .catch((e) => {
    console.log("MongoDB connection failed", e.message || e);
  });

socketIO(io);
// Mount feature routers under their API prefixes.
app.use("/api/users", userRouter);
app.use("/api/groups", groupRouter);
const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
