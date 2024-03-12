import { useEffect, useState } from "react";
import { io } from "socket.io-client";

import { Quote } from "../types";

import Ringtone from "./message.mp3";

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

      setNofitCount(0);
      setConnect(false);
    });

    // receive missed quotes
    socket.on("new_quote", (new_quotes: Quote[]) => {
      console.log("Received data from server:", new_quotes);

      setQuotes((quotes) => [...new_quotes, ...quotes]);
      setNofitCount(0);
    });

    // notify about new quote
    socket.on("notify", (data: number) => {
      console.log("Notification from server: ", data);

      setNofitCount(() => data);
      const audio = new Audio(Ringtone);
      audio.play();
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
