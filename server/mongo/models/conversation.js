const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  private: { type: Boolean, default: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Profile" }],
});

module.exports = mongoose.model("Conversation", conversationSchema);
