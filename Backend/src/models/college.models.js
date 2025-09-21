const mongoose = require("mongoose");
const { Schema } = mongoose;

/**
 * College Schema
 * Represents an educational institution in the system.
 */
const collegeSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  contactEmail: {
    type: String,
    required: true,
    trim: true,
  },
  languageSupport: {
    type: [String], // Array of strings for supported languages
    default: [],
  },
  createdAt: {
    type: Date,
    // FIX: Removed parentheses from Date.now()
    default: Date.now,
  },
});

const College = mongoose.model("College", collegeSchema);

module.exports = College;
