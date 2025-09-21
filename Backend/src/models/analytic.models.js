const mongoose=require("mongoose")

const { Schema } = mongoose;

/**
 * Analytic Schema
 * Stores aggregated analytics data for a college.
 */
const analyticSchema = new Schema({
  collegeId: {
    type: Schema.Types.ObjectId,
    ref: "College",
    required: true,
  },
  metric: {
    type: String, // e.g., 'user_signups', 'appointments_booked'
    required: true,
  },
  value: {
    type: Number, // The actual data point
    required: true,
  },
  period: {
    type: String, // e.g., '2024-09'
    required: true,
  },
  generatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Analytic = mongoose.model("Analytic", analyticSchema);

module.exports = Analytic;
