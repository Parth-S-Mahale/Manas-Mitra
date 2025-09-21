const express = require("express");
const router = express.Router();

const { auth, isStudent, isCounselor } = require("../middlewares/auth.js");

const {
  createAppointment,
  getAppointmentsForUser,
  getAppointmentsForCounselor,
  updateAppointmentStatus,
  cancelAppointment,
} = require("../controllers/appointment.controller.js");

router.post("/book", auth, isStudent, createAppointment);
router.get("/my-appointments", auth, isStudent, getAppointmentsForUser);
router.patch("/:appointmentId/cancel", auth, isStudent, cancelAppointment);


router.get(
  "/counselor-schedule",
  auth,
  isCounselor,
  getAppointmentsForCounselor,
);
router.patch(
  "/:appointmentId/update-status",
  auth,
  isCounselor,
  updateAppointmentStatus,
);

module.exports = router;
