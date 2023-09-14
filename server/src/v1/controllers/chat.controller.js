const { Types } = require("mongoose");
const { messageModel } = require("./../../../mongo/models/message");
const Conversation = require("./../../../mongo/models/conversation");
const {
  validateCreateMessage,
  validateDeleteMessage,
  validateUpdateMessageById,
  validateUpdateMessagesSeenStatusByConversationId,
  validateCreateConversation,
  validateDeleteConversation,
  validateGetMessagesByConversationId,
} = require("./../validate/chat.validate");

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

    const foundConversation = await Conversation.findOne({
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

chatController.createConversation = async (req, res) => {
  try {
    const validInputs = validateCreateConversation(req.body);
    if (!validInputs)
      return res.status(400).json({
        message: "invalid inputs",
        status: 400,
      });

    const isAlreadyExists = await Conversation.findOne({
      participants: {
        $all: validInputs.participants,
      },
    });

    if (isAlreadyExists) return res.status(409).json(isAlreadyExists);

    const newConversation = await Conversation.create(validInputs);

    return res.status(201).json(newConversation);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Something went wrong", status: 500 });
  }
};

chatController.deleteConversation = async (req, res) => {
  try {
    if (!validateDeleteConversation(req.body))
      return res.status(400).json({ message: "invalid input", status: 400 });

    const isConvDeleted = await Conversation.deleteOne({
      _id: req.body.conversationId,
    });
    if (isConvDeleted.n === 0)
      return res
        .status(404)
        .json({ message: "conversation not found", status: 404 });
    let isSuccess = true;

    const doMsgsExist = await messageModel.findOne({
      conversationId: req.body.conversationId,
    });
    if (doMsgsExist !== null) {
      const areMsgsDeleted = await messageModel.deleteMany({
        conversationId: req.body.conversationId,
      });

      isSuccess = areMsgsDeleted.n !== 0;
    }

    return res.status(201).json({
      success: isSuccess,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Something went wrong", status: 500 });
  }
};

module.exports = chatController;
