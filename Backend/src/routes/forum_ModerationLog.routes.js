const express = require("express");
const { auth, isAdmin, isSuperAdmin } = require("../middlewares/auth.js");
const {
  getAllModerationLogs,
  getLogsForPost,
} = require("../controllers/forum_Moderation_Log.controller.js");

const router = express.Router();

router.get("/", auth, isSuperAdmin, getAllModerationLogs);

router.get("/post/:postId", auth, isAdmin, getLogsForPost);

module.exports = router;
