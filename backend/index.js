// initial server
const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");

const server = http.createServer(app);

// add socket
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // vite port (client)
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User connected ${socket.id}`);
});

// run application
const port = 8080;

app.use(cors());

server.listen(port, () => "Server is running on port " + port);
