const mongoose = require("mongoose");
const { Schema } = mongoose;

/**
 * Appointment Schema
 * Represents a scheduled appointment between a user (student) and a Counselor.
 */
const appointmentSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  CounselorId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  collegeId: {
    type: Schema.Types.ObjectId,
    ref: "College",
    required: true,
  },
  scheduledAt: {
    type: Date,
    required: true,
  },
  notes: {
    type: String,
  },
  isAnonymized: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
