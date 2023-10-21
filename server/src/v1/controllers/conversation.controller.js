const {
  validateCreateConversation,
  validateDeleteConversation,
  validateGetConversationsByParticipant,
} = require("./../validate/conversation.validate");
const conversationModel = require("../../../mongo/models/conversation");

const conversationController = {};

conversationController.createConversation = async (req, res) => {
  try {
    const validInputs = validateCreateConversation(req.body);
    if (!validInputs)
      return res.status(400).json({
        message: "invalid inputs",
        status: 400,
      });

    const isAlreadyExists = await conversationModel.findOne({
      participants: {
        $all: validInputs.participants,
      },
    });

    if (isAlreadyExists) return res.status(409).json(isAlreadyExists);

    const newConversation = await conversationModel.create(validInputs);

    return res.status(201).json(newConversation);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Something went wrong", status: 500 });
  }
};

conversationController.getConversationsByParticipant = async (req, res) => {
  try {
    const validatedParams = validateGetConversationsByParticipant(req.params);
    if (!validatedParams)
      return res.status(400).json({ message: "invalid user id", status: 400 });

    
    console.log("🚀 ~ file: conversation.controller.js:47 ~ conversationController.getConversationsByParticipant= ~ validatedParams.userId:", validatedParams.userId)
    // const conversations = await conversationModel.find({
    //   participantProfiles: { $exists: { _id: validatedParams.userId } },
    // });
    const conversations = await conversationModel.aggregate([
      {
        $match: {
          'participantProfiles._id': "6533e19eefc5772b80559a0b"
        }
      }
    ])
    console.log("🚀 ~ file: conversation.controller.js:49 ~ conversationController.getConversationsByParticipant= ~ conversations:", conversations)
    if (!conversations)
      return res
        .status(404)
        .json({
          message: `conversations for the user id ${validatedParams.userId} not found.`,
          status: 404,
        });

    return res.status(200).json(conversations);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Something went wrong", status: 500 });
  }
};

conversationController.deleteConversation = async (req, res) => {
  try {
    if (!validateDeleteConversation(req.body))
      return res.status(400).json({ message: "invalid input", status: 400 });

    const isConvDeleted = await conversationModel.deleteOne({
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

module.exports = conversationController;
