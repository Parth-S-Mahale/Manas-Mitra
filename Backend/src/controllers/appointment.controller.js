const Appointment = require("../models/appointment.models.js");
const User = require("../models/user.models.js");
const mongoose = require("mongoose");

// --- Create a new appointment (Student action) ---
exports.createAppointment = async (req, res) => {
  try {
    const { counselorId, scheduledAt, notes } = req.body;
    const studentId = req.user.id;

    if (!counselorId || !scheduledAt) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Counselor ID and scheduled time are required.",
        });
    }

    const student = await User.findById(studentId);
    const newAppointment = await Appointment.create({
      userId: studentId,
      counselorId,
      collegeId: student.collegeId,
      scheduledAt,
      notes,
    });

    return res
      .status(201)
      .json({
        success: true,
        message: "Appointment booked successfully.",
        appointment: newAppointment,
      });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

// --- Get appointments for the logged-in student ---
exports.getAppointmentsForUser = async (req, res) => {
  try {
    const studentId = req.user.id;
    const appointments = await Appointment.find({ userId: studentId })
      .populate("counselorId", "firstName lastName email")
      .sort({ scheduledAt: -1 });

    return res.status(200).json({ success: true, appointments });
  } catch (error) {
    console.error("Error fetching user appointments:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

// --- Get appointments for the logged-in counselor ---
exports.getAppointmentsForCounselor = async (req, res) => {
  try {
    const counselorId = req.user.id;
    const appointments = await Appointment.find({ counselorId: counselorId })
      .populate("userId", "firstName lastName email")
      .sort({ scheduledAt: -1 });

    return res.status(200).json({ success: true, appointments });
  } catch (error) {
    console.error("Error fetching counselor appointments:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

// --- Update an appointment's status (Counselor action) ---
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body;

    if (!["Scheduled", "Completed", "Cancelled"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status provided." });
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true },
    );
    if (!updatedAppointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found." });
    }

    return res
      .status(200)
      .json({
        success: true,
        message: "Appointment status updated.",
        appointment: updatedAppointment,
      });
  } catch (error) {
    console.error("Error updating appointment status:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

// --- Cancel an appointment (Student action) ---
exports.cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const studentId = req.user.id;

    const appointment = await Appointment.findOne({
      _id: appointmentId,
      userId: studentId,
    });
    if (!appointment) {
      return res
        .status(404)
        .json({
          success: false,
          message:
            "Appointment not found or you do not have permission to cancel it.",
        });
    }

    appointment.status = "Cancelled";
    await appointment.save();

    return res
      .status(200)
      .json({
        success: true,
        message: "Appointment cancelled successfully.",
        appointment,
      });
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};
