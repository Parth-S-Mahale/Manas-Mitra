const express = require("express");
const router = express.Router();

const { auth, isAdmin, isCounselor } = require("../middlewares/auth.js");

const {
  createResource,
  getAllResources,
  getResourcesByCollege,
  updateResource,
  deleteResource,
  trackResourceAccess,
} = require("../controllers/resource.controller.js");

router.get("/", getAllResources);

router.get("/college/:collegeId", getResourcesByCollege);

router.post("/create", auth, isCounselor, createResource); // Counselors or higher can create

router.put("/:resourceId", auth, isCounselor, updateResource); // Counselors or higher can update

router.delete("/:resourceId", auth, isAdmin, deleteResource); // Only admins or higher can delete

router.post("/:resourceId/track-access", auth, trackResourceAccess);

module.exports = router;
