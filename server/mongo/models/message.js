const mongoose = require("mongoose");

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
  directMessage: { type: Boolean, default: true },
  message: { type: String, required: true },
  seen: { type: Boolean, default: false },
  timestamp: { type: Date, required: true, default: Date.now },
});

module.exports = mongoose.model("Message", messageSchema);

