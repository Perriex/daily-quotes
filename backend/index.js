// initial server
const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");

const { default: axios } = require("axios");

const server = http.createServer(app);

// add socket
const { Server } = require("socket.io");

const createRandomInterval = (count, sendNotif) => {
  const min = 5000;
  const max = 10000;
  const randomTime = Math.floor(Math.random() * (max - min)) + min;

  return setInterval(() => {
    count.limit += 1;
    sendNotif();
  }, randomTime);
};

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // vite port (client)
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User connected ${socket.id}`);
  let count = { limit: 0 };
  let nIntervId;

  const sendNotif = () => {
    socket.emit("notify", count.limit);
  };

  socket.on("start_quotes", () => {
    console.log(`User wants quotes`);

    nIntervId = createRandomInterval(count, sendNotif);
  });

  socket.on("send_quotes", (data) => {
    axios
      .get("https://api.quotable.io/quotes/random?limit=" + data.limit)
      .then((result) => {
        const convertedQuotes = result.data.map((item) => ({
          author: item.author,
          quote: item.content,
        }));
        count.limit = 0;
        socket.emit("new_quote", convertedQuotes);
      })
      .catch(console.error);
  });

  socket.on("disconnect", () => {
    console.log(`User left.`);
    count.limit = 0;
    clearInterval(nIntervId);
  });
});

// run application
const port = 8080;

app.use(cors());

app.get("/", async (req, res) => {});

server.listen(port, () => "Server is running on port " + port);
