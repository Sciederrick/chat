const mongoose = require("mongoose");

const bioSchema = require("./bio.schema");

const profileSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    email: { type: String },
    avatar: { type: String },
    isMale: { type: Boolean, required: true },
    bio: { type: bioSchema, required: true },
    role: { type: String, required: true, enum: ["client", "group", "admin"] },
  }
);

const conversationSchema = new mongoose.Schema({
  private: { type: Boolean, required: true },
  lastMessage: {
    text: String,
    createdAt: Date,
    senderId: mongoose.Schema.Types.ObjectId,
    seen: Boolean,
  },
  participantProfiles: [ { type: profileSchema, ref: "Profile" } ]
}, { timestamp: true, _id: true, autoIndex: true });

module.exports = mongoose.model("Conversation", conversationSchema);
