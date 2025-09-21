const mongoose = require("mongoose");
const { Schema } = mongoose;

/**
 * Forum Post Schema
 * Represents a single post made by a user in the forum.
 */
const forumPostSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  collegeId: {
    type: Schema.Types.ObjectId,
    ref: "College",
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "archived", "deleted"], // Example statuses
    default: "active",
  },
  isModerated: {
    type: Boolean,
    default: false,
  },
  lastMove: {
    // Could represent the last activity/reply timestamp
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ForumPost = mongoose.model("ForumPost", forumPostSchema);

module.exports = ForumPost;
