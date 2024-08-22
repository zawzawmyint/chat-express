const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");
// Load environment variables
require("dotenv").config();

// const uri = process.env.MONGODB_URI;

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST"],
  },
});

// Enable CORS for all origins (or update to use specific origin)
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);

// Middleware
app.use(express.json()); // To parse JSON request bodies

io.on("connection", (socket) => {
  console.log(socket.id, "a user connected");

  socket.on("message", ({ userId, senderId, msg }) => {
    console.log(`${userId}: ${msg}`);
    io.emit("message", {
      userId,
      senderId,
      msg,
    });
  });

  socket.on("disconnect", () => {
    console.log(socket.id, "user disconnected");
  });
});

// Routes
app.use("/api/users", userRoutes); // Use the user routes

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
