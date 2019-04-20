const jwt = require("jsonwebtoken");
const socketio = require("socket.io");
const data = require("./data/_model");
const config = require("./utils/loadConfig");
const permissions = require("./utils/permissions");

module.exports = server => {
  io = socketio(server);
  io.on("connection", function(socket) {
    socket.on("join", async function(info) {
      let decoded = null;
      let user = null;
      let thread = null;
      let topic = null;
      let rank = config.ranks[0] || null;
      let admin = false;
      if (!info.token || !info.thread) {
        return socket.emit("err", "no token or thread");
      }
      try {
        decoded = jwt.verify(info.token, process.env.SECRET || config.SECRET);
      } catch (err) {
        return socket.emit("err", "wrong token");
      }
      user = await data.User.findByPk(decoded.id);
      thread = await data.Thread.findByPk(info.thread);
      if (!user || !thread) {
        return socket.emit("err", "user or thread not found");
      }
      rank = user.dataValues.rank;
      admin = rank === config.ranks.length - 1;
      topic = await thread.getTopic();
      if (!topic) {
        return socket.emit("err", "no topic");
      }
      if (!admin && permissions.sub(rank, topic.dataValues.read) < 0) {
        return socket.emit("err", "denied");
      }
      socket.join("" + thread.dataValues.id);
    });
    socket.on("leave", async function(info) {
      socket.leave("" + info.thread);
    });
  });
  return io;
};
