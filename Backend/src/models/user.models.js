const mongoose = require("mongoose");
const { Schema } = mongoose;

/**
 * User Schema
 * Represents a user in the system, who can be a student, Counselor, or admin.
 */
const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  accountType: {
    type: String,
    enum:["Student", "Counselor", "Admin","Expert","SuperAdmin"], // Example account types
    required: true,
  },
  image: {
    type: String, // URL to the user's profile image
  },
  collegeId: {
    type: Schema.Types.ObjectId,
    ref: "College",
    required: true,
  },
  yearOfPassing: {
    type: Number,
  },
  isAnonymous: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});



const User = mongoose.model("User", userSchema);

module.exports = User;
