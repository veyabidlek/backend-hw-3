import { parseFunction } from "./parse.js";
import express from "express";
import http from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

app.get("/summary", (req, res) => {
  res.send("Summary will be here");
});

server.listen(3001, () => {
  console.log("SERVER RUNNING");
});

parseFunction();
