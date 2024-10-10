const { Server } = require("socket.io");

let io; // Declare io variable that can be initialized later

// Initialize Socket.IO
const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // Adjust this as per your security needs
    },
  });

  // Handle socket connections
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

// Function to emit notification events
const sendNotification = (message) => {
  if (io) {
    io.emit("notification", message); // Emit notification to all connected clients
  } else {
    console.error("Socket.io is not initialized");
  }
};

module.exports = { initSocket, sendNotification };
