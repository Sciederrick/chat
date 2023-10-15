const mongoose = require("mongoose");

const conversationModel = require("./conversation");

const messageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
    required: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  directMessage: { type: Boolean, required: true },
  message: { type: String, required: true },
  seen: { type: Boolean, default: false },
  timestamp: { type: Date, required: true, default: Date.now }
}, { timestamp: true, _id: true, autoIndex: true });

messageSchema.post("save", async function (doc) {
  try {
    const lastMessage = {
      text: doc.message,
      createdAt: doc.timestamp,
      senderId: doc.senderId,
      seen: false,
    };
    console.log("🚀 ~ file: message.js:30 ~ lastMessage:", lastMessage);
    const updatedConversation = conversationModel.findByIdAndUpdate(doc.conversationId, { lastMessage }, { new: true });
    console.log("🚀 ~ file: message.js:31 ~ updatedConversation:", updatedConversation);
  } catch(err) {
    console.error(err);
  }
});

module.exports = mongoose.model("Message", messageSchema);

