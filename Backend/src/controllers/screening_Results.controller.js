const mongoose=require('mongoose')
const ScreeningResult = require('../models/screening_Result.models')
const User=require("../models/user.models")

//submit a screening test result (for students)
exports.submitScreeningResult=async(req,res)=>{
    try{
        const {screeningTool,score,isAnonymized}=req.body
        const userId=req.user.id //From auth middleware

        if(!screeningTool || score===undefined){
            return res.status(400).json({
                success:false,
                message:"Screening tool ans score are required"
            })
        }

        if(typeof score !=='number'){
            return res.status(400).json({
                success:false,
                message:"Score must be a number"
            })
        }

        const newResult=await ScreeningResult.create({
            userId,
            screeningTool,
            score,
            isAnonymized:isAnonymized ||false
        })

        res.status(201).json({
            success:true,
            message:"Screening result submittted successfully",
            result:newResult
        })

    }catch(error){
        console.error("Error Submitting screening result",error)
        res.status
    }
}

// get screening history for logged in user(for students)
exports.getScreeningHistoryForUser=async(req,res)=>{
    try{
        const userId=req.user.id //from auth middleware
        const history=await ScreeningResult.find({userId})
            .sort({takenAt:-1})
            .select('-userId') //no need to return user id since they know its them

        res.status(200).json({
            success:true,
            history
        })    

    }catch(error){
        console.error("Error fetching screening history",error);
        res.status(500).json({success:false,message:"Failed to fetch screening history"})
    }
}

//get all results for a specific student(For Counselors)
exports.getStudentResultsForCounselor=async(req,res)=>{
    try{
    const {studentId}=req.params;
    const counselorCollegeId=req.user.collegeId;

    if(!mongoose.Types.ObjectId.isValid(studentId)){
        return res.status(400).json({
            success:false,
            message:"Invalid student id format"
        })
    }

    const student=await User.findById(studentId)
    if(!student || student.collegeId.toString() !== counselorCollegeId.toString()){
        return res.status(404).json({
            success:false,
            message:"Student not found at this college"
        })
    }
    const results=await ScreeningResult.find({userid:studentId,isAnonymized:false})
        .sort({takenAt:-1})

    res.status(200).json({
        success:true,
        student:{
            firstName:student.firstName,
            lastName:student.lastName,
            email:student.email
        },
        results
    }) 
    }catch(error){
        console.error("Error fetching student results for counselor",error)
        res.status(500).json({
        success: false,
        message: "Failed to fetch student"
    })
    }
     

}

//get aggregated analytics for a college(For Counselors/Admins)
exports.getCollegeAnalytics=async(req,res)=>{
    try{
        const collegeId=req.user.collegeId
        
        const usersInCollege=await User.find({collegeId}).select('_id') 
        console.log(usersInCollege)
        const userIds=usersInCollege.map(user=> user._id);
        console.log(userIds)

        const analytics=await ScreeningResult.aggregate([
            {$match:{userId:{$in:userIds}}},
            {
                $group:{
                    _id:"$screeningTool",
                    averageScore:{$avg:"$score"},
                    totalSubmissions:{$sum:1}
                }
            },
            {sort :{totalSubmissions:-1}}
        ])


        res.status(200).json({
            success:true,
            analytics
        })

    }catch(error){
        console.error("Error fetching college analytics",error)
        res.status(500).json({
            success:false,
            message:"Ffailed to fetch college analytics"
        })
    }
}