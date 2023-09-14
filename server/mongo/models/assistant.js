const mongoose = require("mongoose");

const assistantSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    messages: { type: [String], required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamp: true, _id: true, autoIndex: true }
);

module.exports = mongoose.model("Assistant", assistantSchema);
