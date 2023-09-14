const mongoose = require("mongoose");

const bioSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  title: String,
  about: String,
  links: [String],
});

const profileSchema = new mongoose.Schema(
  {
    email: { type: String},
    avatar: { type: String },
    bio: { type: bioSchema, required: true },
    role: { type: String, default: "client" },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  // @ts-ignore
  { timestamp: true, _id: true, autoIndex: true }
);

module.exports = mongoose.model("Profile", profileSchema);
