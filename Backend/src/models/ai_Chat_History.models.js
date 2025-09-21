const mongoose = require("mongoose");
const { Schema } = mongoose;

/**
 * AI Chat History Schema
 * Logs the conversation history between a user and an AI chat agent.
 */
const aiChatHistorySchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  sessionId: {
    type: String,
    required: true,
    index: true,
  },
  messages: {
    type: Schema.Types.Mixed, // Allows for flexible message structure (e.g., [{role: 'user', content: '...'}])
    required: true,
  },
  isAnonymized: {
    type: Boolean,
    default: false,
  },
  endedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const AIChatHistory = mongoose.model("AIChatHistory", aiChatHistorySchema);

module.exports = AIChatHistory;
