const mongoose = require("mongoose");

const bioSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  title: String,
  about: String,
  links: [String],
});

module.exports = bioSchema;
