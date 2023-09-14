const mongoose = require("mongoose");

const codepadSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },
    code: { type: String, required: true },
    filename: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamp: true, _id: true, autoIndex: true }
);

module.exports = mongoose.model('Codepad', codepadSchema);