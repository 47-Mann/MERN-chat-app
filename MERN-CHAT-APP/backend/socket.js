// Register Socket.IO event handlers when the server is ready.
const socketIO = (io) => {
  // Track each connected socket's authenticated user and current group.
  const connectedUsers = new Map();

  // Handle a new Socket.IO connection.
  io.on("connection", (socket) => {
    const user = socket.handshake.auth?.user;

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

      // Remove the socket from the Socket.IO room before notifying its members.
      socket.leave(groupId);

      if (connectedUsers.has(socket.id)) {
        // Remove the user's socket-to-room association from the presence map.
        connectedUsers.delete(socket.id);

        const usersInRoom = Array.from(connectedUsers.values())
          .filter((connectedUser) => connectedUser.room === groupId)
          .map((connectedUser) => connectedUser.user);

        // Keep the remaining clients synchronized with the new presence list.
        io.in(groupId).emit("usersInRoom", usersInRoom);

        // Tell the remaining room members who left the group.
        socket.to(groupId).emit("userLeft", user._id);
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
