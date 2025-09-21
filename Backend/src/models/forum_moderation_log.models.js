const mongoose = require("mongoose");
const { Schema } = mongoose;

/**
 * Forum Moderation Log Schema
 * Records moderation actions taken on forum posts.
 */
const forumModerationLogSchema = new Schema({
  postId: {
    type: Schema.Types.ObjectId,
    ref: "ForumPost",
    required: true,
  },
  moderatorId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  action: {
    type: String, // e.g., 'edited', 'deleted', 'approved'
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ForumModerationLog = mongoose.model(
  "ForumModerationLog",
  forumModerationLogSchema
);

module.exports = ForumModerationLog;
