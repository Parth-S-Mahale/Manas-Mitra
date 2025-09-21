const mongoose = require("mongoose");
const { Schema } = mongoose;

/**
 * Screening Result Schema
 * Stores the result of a mental health screening test taken by a user.
 */
const screeningResultSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  screeningTool: {
    type: String,
    required: true, // e.g., 'PHQ-9', 'GAD-7'
  },
  score: {
    type: Number,
    required: true,
  },
  isAnonymized: {
    type: Boolean,
    default: false,
  },
  takenAt: {
    type: Date,
    default: Date.now,
  },
});

const ScreeningResult = mongoose.model(
  "ScreeningResult",
  screeningResultSchema
);

module.exports = ScreeningResult;
