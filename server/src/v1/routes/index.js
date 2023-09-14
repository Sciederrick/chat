const express = require('express');

const authRouter = require('./auth.route');
const chatRouter = require("./chat.route");
const profileRouter = require("./profile.route");

const router = express.Router();

/**
 * GET api/v1/ status check
 */
router.get("/", (_, res) => {
  res.json({ message: "ok" });
});

router.use("/auth", authRouter);
router.use("/chats", chatRouter);
router.use("/profile", profileRouter);


module.exports = router;
