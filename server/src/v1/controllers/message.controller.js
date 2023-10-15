const { Types } = require("mongoose");
const messageModel = require("../../../mongo/models/message");
const conversationModel = require("../../../mongo/models/conversation");

const {
  validateCreateMessage,
  validateDeleteMessage,
  validateUpdateMessageById,
  validateUpdateMessagesSeenStatusByConversationId,
  validateGetMessagesByConversationId,
} = require("../validate/message.validate");

const chatController = {};

chatController.createMessage = async (req, res) => {
  try {
    if (!validateCreateMessage(req.body))
      return res.status(400).json({ message: "invalid inputs", status: 400 });

    const payload = {
      conversationId: req.body.conversationId.trim(),
      senderId: req.body.senderId.trim(),
      message: req.body.message.trim(),
      timestamp: req.body.timestamp.trim(),
    };
    if ("directMessage" in req.body) {
      payload.directMessage = req.body.directMessage;
    }

    const newMessage = await messageModel.create(payload);

    return res.status(201).json(newMessage);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Something went wrong", status: 500 });
  }
};

chatController.deleteMessage = async (req, res) => {
  try {
    if (!validateDeleteMessage(req.body))
      return res.status(400).json({ message: "invalid input", status: 400 });

    const isDeleted = await messageModel.deleteOne({
      timestamp: req.body.timestamp,
    });

    return res.status(201).json({
      success: isDeleted.n !== 0,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Something went wrong", status: 500 });
  }
};

chatController.getMessagesByConversationId = async (req, res) => {
  try {
    if (!validateGetMessagesByConversationId(req.params))
      return res
        .status(400)
        .json({ message: "invalid conversation id", status: 400 });

    const foundChat = await messageModel.aggregate([
      {
        $match: {
          conversationId: Types.ObjectId(req.params.conversationId.trim()),
        },
      },
      // Sort in descending order (latest first)
      { $sort: { _id: 1 } },
      // Filter by conversationId
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
          },
          allMessages: {
            $push: {
              message: "$message",
              senderId: "$senderId",
              timestamp: "$timestamp",
              seen: "$seen",
            },
          },
        },
      },
    ]);
    if (!foundChat)
      return res.status(404).json({
        message: `Chat with id <${req.params.conversationId.trim()}> not found`,
        status: 404,
      });

    return res.status(200).json({
      conversationId: req.params.conversationId.trim(),
      messageBatches: foundChat,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Something went wrong", status: 500 });
  }
};

chatController.updateMessageById = async (req, res) => {
  try {
    const validInputs = validateUpdateMessageById(req.params, req.body);
    if (!validInputs)
      return res.status(400).json({
        message: "invalid inputs",
        status: 400,
      });

    const updatedMessage = await messageModel.findByIdAndUpdate(
      Types.ObjectId(validInputs.params.id),
      validInputs.body,
      { new: true }
    );
    if (updatedMessage == null)
      return res
        .status(404)
        .json({
          message: `could not find message with id <${validInputs.params.id}>`,
          status: 404,
        });
    return res.status(200).json(updatedMessage);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({
        message: "Something went wrong, make sure you got the message id right",
        status: 500,
      });
  }
};

chatController.updateMessagesByConversationId = async (req, res) => {
  try {
    const validInputs = validateUpdateMessagesSeenStatusByConversationId(
      req.params, req.body
    );
    if (!validInputs)
      return res.status(400).json({
        message: "invalid inputs",
        status: 400,
      });

    const foundConversation = await conversationModel.findOne({
      _id: validInputs.params.conversationId,
    });
    if (!foundConversation)
      return res.status(404).json({
        message: `Conversation with id <${validInputs.params.conversationId}> not found`,
        status: 404,
      });

    const response = await messageModel.updateMany(
      { conversationId: validInputs.params.conversationId, senderId: validInputs.body.senderId, seen: false },
      { seen: true }
    );
    return res.status(200).json(response);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Something went wrong", status: 500 });
  }
};



module.exports = chatController;
