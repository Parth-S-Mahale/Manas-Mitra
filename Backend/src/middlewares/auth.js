const jwt=require("jsonwebtoken")
require("dotenv").config();

exports.auth=async(req,res,next)=>{
    try{

        const token=req.cookies.token || req.body.token || (req.headers.authorization && req.headers.authorization.replace("Bearer ",""))

        if(!token){
            return res.status(401).json({
                success:false,
                message:"Authentication token is missing ,please sign in"
            })
        }

        try{
            const decodePayload=jwt.verify(token,process.env.JWT_SECRET)
            req.user=decodePayload

        }catch(error){
            res.status(401).json({
                success:false,
                message:"Token is invalid or has expired please try again"
            })
        }

        next()

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Something went wrong during Authentication ,please try again"
        })
    }
}

// "student", "Counselor", "admin","expert","superAdmin"

exports.isStudent=async(req,res,next)=>{
    try{
        if(req.user.accountType!=="Student"){
            return res.status(403).json({
                success:false,
                message:"Access Denied. This is a protected Route for Students Only."
            })
        }
        next()
    }catch(error){
        console.error("Student Authorization error:",error)
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified.please try again"
        })
    }
}
exports.isCounselor=async(req,res,next)=>{
    try{
        if(req.user.accountType!=="Counselor"){
            return res.status(403).json({
                success:false,
                message:"Access Denied. This is a protected Route for Counselors Only."
            })
        }
        next()
    }catch(error){
        console.error("Counselor Authorization error:",error)
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified.please try again"
        })
    }
}
exports.isAdmin=async(req,res,next)=>{
    try{
        if(req.user.accountType!=="Admin"){
            return res.status(403).json({
                success:false,
                message:"Access Denied. This is a protected Route for Admin Only."
            })
        }
        next()
    }catch(error){
        console.error("Admin Authorization error:",error)
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified.please try again"
        })
    }
}
exports.isExpert=async(req,res,next)=>{
    try{
        if(req.user.accountType!=="Expert"){
            return res.status(403).json({
                success:false,
                message:"Access Denied. This is a protected Route for Experts Only."
            })
        }
        next()
    }catch(error){
        console.error("Expert Authorization error:",error)
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified.please try again"
        })
    }
}
exports.isSuperAdmin=async(req,res,next)=>{
    try{
        if(req.user.accountType!=="SuperAdmin"){
            return res.status(403).json({
                success:false,
                message:"Access Denied. This is a protected Route for SuperAdmin Only."
            })
        }
        next()
    }catch(error){
        console.error("SuperAdmin Authorization error:",error)
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified.please try again"
        })
    }
}