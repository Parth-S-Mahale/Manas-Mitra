const mongoose = require("mongoose");
const { Schema } = mongoose;

/**
 * Resource Schema
 * Represents a helpful resource, like an article, video, or contact information.
 */
const resourceSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  type: {
    type: String, // e.g., 'article', 'video', 'website'
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  collegeId: {
    type: Schema.Types.ObjectId,
    ref: "College",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Resource = mongoose.model("Resource", resourceSchema);

module.exports = Resource;
