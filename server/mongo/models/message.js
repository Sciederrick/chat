const mongoose = require("mongoose");

const Profile = require("./../models/profile");
const Conversation = require("./../models/conversation");

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

messageSchema.post("save", async function (doc) {
  try {
    const { participants } = await Conversation.findOne(
      { _id: doc.conversationId },
      "participants"
    );

    const participantProfiles = await Profile.find({
      _id: { $in: participants },
    });

    let findProfile = participantProfiles[0];
    if (doc.directMessage == false) {
      findProfile = participantProfiles.find((profile) => {
        return profile.role === "group";
      });

      await Profile.findOneAndUpdate(
        { _id: findProfile._id },
        {
          lastMessage: {
            message: doc.message,
            conversationId: doc.conversationId,
            createdAt: doc.timestamp,
          },
        },
        { new: true }
      );
    } else if (doc.directMessage == true) {
      // Don't update the second & subsequent user profiles if its a chat group
      const participantProfileIds = participantProfiles.map((profile) => {
        return profile._id;
      });

      await Profile.updateMany(
        { _id: { $in: participantProfileIds } },
        {
          lastMessage: {
            message: doc.message,
            conversationId: doc.conversationId,
            createdAt: doc.timestamp,
          },
        }
      );
    }
  } catch (error) {
    console.error("Error updating lastMessage:", error);
  }
});

const Message = mongoose.model("Message", messageSchema);

module.exports = {
  messageSchema: messageSchema,
  messageModel: Message,
};
