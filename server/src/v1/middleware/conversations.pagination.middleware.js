const { Types } = require("mongoose");
const {
  validateGetConversationIdsByUserId,
} = require("../validate/chat.validate");

function paginatedConversations(model) {
  return async (req, res, next) => {
    const validInputs = validateGetConversationIdsByUserId(
      req.params,
      req.query
    );
    if (!validInputs)
      return res.status(400).json({
        message: "Invalid inputs",
        status: 400,
      });

    const { userId, page, limit, private: isPrivateConvo } = validInputs;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = { info: {} };
    results.info.limit = limit;
    let numResults = await model.countDocuments({
      participants: {
        $in: Types.ObjectId(userId),
      },
    }); // all documents for the given user in the db
    if (endIndex < numResults) {
      results.info.next = page + 1;
    } else {
      results.info.next = null;
    }

    if (startIndex > 0) {
      results.info.previous = page - 1;
    } else {
      results.info.previous = null;
    }

    // prepare condition
    const condition = {
      participants: {
        $in: Types.ObjectId(userId),
      },
    };

    if (typeof isPrivateConvo == "boolean") condition.private = isPrivateConvo;

    try {
      if (Object.keys(condition).length > 0) {
        numResults = await model.find(condition, null, null).countDocuments();
        if (numResults === 0) {
          results.info.next = null;
          results.info.previous = null;
        }
      }
      results.info.count = numResults;
      results.info.pages = Math.ceil(numResults / limit);
      results.results = await model.find(condition, null, {
        limit: limit,
        skip: startIndex,
        sort: {
          date_added: -1, //Sort by Date Added DESC
        },
      });

      res.paginatedResults = results;
      next();
    } catch (e) {
      res.status(500).json({ message: e.message, status: 500 });
    }
  };
}

module.exports = {
  paginatedConversations,
};
