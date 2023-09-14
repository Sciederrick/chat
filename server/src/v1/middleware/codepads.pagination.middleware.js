const { Types } = require("mongoose");
const {
  isGetCodeResourcesByUserIdValid,
} = require("../validate/codepad.validate");
const helpers = require("../util/helper.util");

function paginatedCodeResource(model) {
  return async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (!isGetCodeResourcesByUserIdValid(req.params))
      return res.status(400).json({ message: "invalid user id", status: 400 });

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = { info: {} };
    results.info.limit = limit;
    let numResults = await model.countDocuments({
      userId: Types.ObjectId(req.params.userId.trim()),
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
      userId: req.params.userId.trim(),
    };

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
  paginatedCodeResource,
};
