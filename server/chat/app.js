require("dotenv").config();

const { createServer } = require("http");
const { Server } = require("socket.io");

const messageModel = require("./../mongo/models/message");

const users = {};

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_LOCALHOST_URL,
  },
});

try {
  io.on("connection", (socket) => {
    socket.on("user-connect", (userId) => {
      users[userId] = {
        socketId: socket.id,
      };
      console.log(`connected: ${userId}`);
    });

    socket.on("join-room", (roomId) => {
      socket.join(`room-${roomId}`);
      console.log("🚀 ~ file: app.js:40 ~ socket.on ~ join:", roomId);
    });

    socket.on("message", async (message) => {
      const receiverSocketId = findReceiverSocketId(message.receiverId, users);
      const newMsg = new messageModel(message);
      const storedMsg = await newMsg.save();
      console.log("🚀 ~ file: app.js:35 ~ socket.on ~ storedMsg:", storedMsg)
      if (storedMsg) {
        if (
          (message.role == "client" || message.role == "admin") &&
          receiverSocketId.isFound &&
          newMsg
        ) {
          io.to(receiverSocketId.socketId).emit("message", message);
        } else if (message.role == "group" && newMsg) {
          socket.join(`room-${message.receiverId}`);
          socket.broadcast
            .to(`room-${message.receiverId}`)
            .emit("message", message);
        }
      } else {
        // @TODO: what happens when the the msg isn't stored in the DB
      }
    });

    socket.on("user-disconnect", (userId) => {
      const senderUser = findSender(socket.id, users);
      if (senderUser.isFound) {
        socket.broadcast.emit("user-disconnected", senderUser.userId);
        delete users[senderUser.userId];
      }
    });
  });
} catch (err) {
  console.error(err);
}

function findReceiverSocketId(receiverId, users) {
  if (Object.keys(users).length === 0 || !users[receiverId])
    return { isFound: false };

  return {
    isFound: true,
    socketId: users[receiverId].socketId,
  };
}

function findSender(socketId, users) {
  if (Object.keys(users).length === 0) return { isFound: false };

  let foundUserId = null;
  for (let userId in users) {
    if (users[userId].socketId === socketId) foundUserId = userId;
  }

  return foundUserId
    ? { isFound: true, userId: foundUserId }
    : { isFound: false };
}

io.listen(3095);

module.exports = io;
