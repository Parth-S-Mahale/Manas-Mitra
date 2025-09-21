const express = require('express');
const router = express.Router();

// --- Middleware Imports ---
const { auth, isAdmin } = require('../middlewares/auth.js');
const { getAnalyticsByCollege, createAnalyticEntry } = require('../controllers/analytics.controller.js');


// =================================================================================================
// --- Protected Routes ---
// =================================================================================================
// Endpoint for admins or counselors to view analytics data.
router.get('/:collegeId', auth, (req, res, next) => { (req.user.accountType === 'Admin' || req.user.accountType === 'Counselor') ? next() : res.status(403).json({success: false, message: 'Access Denied'}) }, getAnalyticsByCollege);

// This would be an internal route, perhaps called by a scheduled job, but we'll protect it.
router.post('/create', auth, isAdmin, createAnalyticEntry);

module.exports = router;
