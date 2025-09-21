const mongoose = require("mongoose");
const { Schema } = mongoose;

/**
 * Resource Access Schema
 * Logs when a user accesses a specific resource.
 */
const resourceAccessSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  resourceId: {
    type: Schema.Types.ObjectId,
    ref: "Resource",
    required: true,
  },
  isAnonymized: {
    type: Boolean,
    default: false,
  },
  accessedAt: {
    type: Date,
    default: Date.now,
  },
});

const ResourceAccess = mongoose.model("ResourceAccess", resourceAccessSchema);

module.exports = ResourceAccess;
