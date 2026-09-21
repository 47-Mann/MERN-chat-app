import jwt from "jsonwebtoken";
import User from "./models/UserModel.js";

// Register Socket.IO event handlers when the server is ready.
const socketIO = (io) => {
  // Track each connected socket's authenticated user and current group.
  const connectedUsers = new Map();

  // Handle a new Socket.IO connection.
  io.on("connection", async (socket) => {
    const token = socket.handshake.auth?.token;
    let user;

    // Authenticate the socket with the same signed token used by REST requests.
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      user = await User.findById(decoded.id).select("-password");
    } catch {
      user = null;
    }

    // Do not allow an unauthenticated socket to join rooms or receive events.
    if (!user) {
      socket.disconnect(true);
      return;
    }

    console.log(`User connected: ${user.userName ?? "unknown"}`);

    // A client sends joinRoom with the group it wants to enter.
    socket.on("joinRoom", (groupId) => {
      socket.join(groupId);

      // Keep the socket ID associated with its user and active group.
      connectedUsers.set(socket.id, { user, room: groupId });

      // Build the current presence list for everyone in this group.
      const usersInRoom = Array.from(connectedUsers.values())
        .filter((connectedUser) => connectedUser.room === groupId)
        .map((connectedUser) => connectedUser.user);

      // Synchronize the complete presence list with every client in the room.
      io.in(groupId).emit("usersInRoom", usersInRoom);

      // Notify existing room members about the newly joined user.
      socket.to(groupId).emit("notification", {
        type: "user_joined",
        message: `${user.userName ?? "A user"} has joined`,
        user,
      });
    });

    // A client sends leaveRoom when the user manually leaves a group.
    socket.on("leaveRoom", (groupId) => {
      console.log(`${user.userName ?? "A user"} left room ${groupId}`);

      // Notify room members before removing this socket from the room.
      socket.to(groupId).emit("userLeft", user._id);
      socket.to(groupId).emit("notification", {
        type: "user_left",
        message: `${user.userName ?? "A user"} has left`,
        user,
      });

      if (connectedUsers.has(socket.id)) {
        // Remove the socket from the room after the leave notification is sent.
        socket.leave(groupId);
        // Remove the user's socket-to-room association from the presence map.
        connectedUsers.delete(socket.id);

        const usersInRoom = Array.from(connectedUsers.values())
          .filter((connectedUser) => connectedUser.room === groupId)
          .map((connectedUser) => connectedUser.user);

        // Keep the remaining clients synchronized with the new presence list.
        io.in(groupId).emit("usersInRoom", usersInRoom);
      }
    });

    // A client sends newMessage after a message has been created.
    socket.on("newMessage", (message) => {
      // Broadcast the message to other sockets in its group, excluding the sender.
      socket.to(message.groupId).emit("messageReceived", message);
    });

    // A client sends typing while the user is composing a message.
    socket.on("typing", (groupId) => {
      // Only notify other members of the group; the sender already knows they are typing.
      socket.to(groupId).emit("userTyping", user.userName ?? user.username);
    });

    // A client sends stopTyping when the user submits or clears the message.
    socket.on("stopTyping", (groupId) => {
      // Tell other members to remove the typing indicator for this user.
      socket
        .to(groupId)
        .emit("userStoppedTyping", user.userName ?? user.username);
    });

    // Socket.IO fires disconnect when the client closes or loses its connection.
    socket.on("disconnect", () => {
      console.log(`${user.userName ?? "A user"} disconnected`);

      if (connectedUsers.has(socket.id)) {
        // Read the room before deleting the socket's presence information.
        const userData = connectedUsers.get(socket.id);

        // Notify the remaining members that this user is no longer connected.
        socket.to(userData.room).emit("userLeft", user._id);
        socket.to(userData.room).emit("notification", {
          type: "user_left",
          message: `${user.userName ?? "A user"} has disconnected`,
          user,
        });

        connectedUsers.delete(socket.id);

        const usersInRoom = Array.from(connectedUsers.values())
          .filter((connectedUser) => connectedUser.room === userData.room)
          .map((connectedUser) => connectedUser.user);

        // Keep the remaining clients synchronized after the disconnect.
        io.in(userData.room).emit("usersInRoom", usersInRoom);
      }
    });
  });
};

export default socketIO;
