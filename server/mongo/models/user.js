const mongoose = require("mongoose");

const bioSchema = require("./bio.schema");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    avatar: { type: String },
    isMale: { type: Boolean, required: true },
    bio: { type: bioSchema, required: true },
    role: { type: String, required: true, enum: ["user", "group", "admin", "moderator"] },
    password: { type: String, required: true }
  },
  // @ts-ignore
  { timestamp: true, _id: true, autoIndex: true }
);

module.exports = mongoose.model("User", userSchema);
