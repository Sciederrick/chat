const mongoose = require("mongoose");

const bioSchema = require("./bio.schema");

const profileSchema = new mongoose.Schema(
  {
    email: { type: String },
    avatar: { type: String },
    isMale: { type: Boolean, required: true },
    bio: { type: bioSchema, required: true },
    role: { type: String, required: true, enum: ["client", "group", "admin"] },
    password: { type: String, required: true }
  },
  // @ts-ignore
  { timestamp: true, _id: true, autoIndex: true }
);

module.exports = mongoose.model("Profile", profileSchema);
