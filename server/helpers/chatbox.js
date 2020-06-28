const socket = require("socket.io");
const Class = require("../models/Class");
const Message = require("../models/Message");

const initChatbox = server => {
  const io = socket(server);
  io.on("connection", socket => {
    // New message
    socket.on("newMessage", async emitedMessage => {
      try {
        const newMessage = new Message({
          msg: emitedMessage.msg,
          author: emitedMessage.author.id
        });

        emitedMessage.id = newMessage.id;

        await Class.findOneAndUpdate(
          { code: emitedMessage.classCode },
          { $push: { messages: newMessage } },
          { useFindAndModify: false }
        );

        // Emit new messages to all sockets
        io.emit("newMessage", emitedMessage);
      } catch (err) {
        console.log(err);
      }
    });
  });
};

module.exports = initChatbox;
