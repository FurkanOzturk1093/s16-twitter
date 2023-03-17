const express = require("express");
const server = express();
server.use(express.json());
const mw = require("../middleware/restricted");
const postsRouter = require("./posts/posts-router");
const usersRouter = require("./users/users-router");

server.use("/api/posts", mw.restricted, postsRouter);
server.use("/api/users", usersRouter);

server.use((err, req, res, next) => {
  // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  });
});
server.get("/", (req, res) => {
  res.status(200).json({ message: "Server Çalışıyor" });
});
module.exports = server;
