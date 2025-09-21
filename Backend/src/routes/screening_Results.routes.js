const express=require("express")
const router=express.Router()

const {auth,isStudent,isCounselor}=require('../middlewares/auth.js')
const { submitScreeningResult, getScreeningHistoryForUser, getStudentResultsForCounselor, getCollegeAnalytics } = require("../controllers/screening_Results.controller.js")


//student specific routes
//these endpoints are protected and can be only accesses by a student
router.post('/submit',auth,isStudent,submitScreeningResult)

router.get('/my-history',auth,isStudent,getScreeningHistoryForUser)

// --- Counselor & Admin Routes ---
// These endpoints are for professional staff to view student data and analytics
router.get('/student/:studentId',auth,isCounselor,getStudentResultsForCounselor)

router.get("/analytics",auth,isCounselor,getCollegeAnalytics)

module.exports=router