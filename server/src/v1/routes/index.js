const express = require('express');

const authRouter = require('./auth.route');
const messageRouter = require("./message.route");
const conversationRouter = require("./conversation.route");
const profileRouter = require("./profile.route");

const router = express.Router();

/**
 * GET api/v1/ status check
 */
router.get("/", (_, res) => {
  res.json({ message: "ok" });
});

router.use("/auth", authRouter);
router.use("/messages", messageRouter);
router.use("/conversations", conversationRouter);
router.use("/profiles", profileRouter);


module.exports = router;
