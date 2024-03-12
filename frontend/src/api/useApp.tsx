import { useEffect, useState } from "react";
import { io } from "socket.io-client";

import { Quote } from "../types";

const socket = io("http://localhost:8080", {
  autoConnect: false,
});

export default function useApp() {
  const [nofitCount, setNofitCount] = useState(0);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [connect, setConnect] = useState(false);

  function update() {
    // request missed quotes
    socket.emit("send_quotes", { limit: nofitCount });
  }

  function connectToServer() {
    socket.connect();
  }

  function disconnetFromServer() {
    socket.disconnect();
  }

  useEffect(() => {
    // start random notifs
    socket.on("connect", () => {
      console.log("Client connected");

      socket.emit("start_quotes");

      setConnect(true);
    });

    // finish notifs
    socket.on("disconnect", () => {
      console.log("Client disconnected");

      socket.emit("cancel_quotes");

      setConnect(false);
    });

    // receive missed quotes
    socket.on("new_quote", (new_quotes: Quote[]) => {
      console.log("Received data from server:", new_quotes);

      setQuotes((quotes) => [...new_quotes, ...quotes]);
    });

    // notify about new quote
    socket.on("notify", () => {
      console.log("Notification from server");
      setNofitCount((count) => count + 1);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return {
    nofitCount,
    quotes,
    connect,
    update,
    connectToServer,
    disconnetFromServer,
  };
}
