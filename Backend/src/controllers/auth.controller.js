const User=require("../models/user.models.js")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken");
const otpGenerator=require("otp-generator");
const OTP=require("../models/otp.model.js")
const mongoose = require("mongoose")

 
require("dotenv").config()

exports.sendOTP=async(req,res)=>{
    try{
        const {email}=req.body;
        const existingUser=await User.findOne({email})

        if(existingUser){
            return res.status(401).json({
                success:false,
                message:"User already exists"
            })
        }

        var otp=otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false
        })

        console.log("OTP Generated",otp)

    const result=await OTP.findOne({otp:otp})
    while(result){
             otp=otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false
        })

      result=await OTP.findOne({otp:otp})

    }

    const otpPayload={email,otp}
    const otpBody=await OTP.create(otpPayload)

    console.log(otpBody)

    res.status(200).json({
        success:true,
        message:"OTP Sent Successfully",
        otp
    })



    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.login=async(req,res)=>{
    try{
        //get data
        const {email,password}=req.body
        //validate data
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"All Fields are required"
            })
        }

        //user check
        const user=await User.findOne({email})

        if(!user){
            return res.status(401).json({
                success:false,
                message:"User is not registered,please signup first"
            })
        }

        //compare password
        if(await bcrypt.compare(password,user.passwordHash)){
            const payload={
                email:user.email,
                id:user._id,
                accountType:user.accountType
            }

            let token=jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"24h"})
            user.token=token
            user.passwordHash=undefined

            const options={
                expires:new Date(Date.now() +3*24*60*60*1000),
                httpOnly:true
            }

            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user:user,
                message:"User logged in successfully"
            })


        }else{
            return res.status(401).json({
                success:false,
                message:"Password is incorrect"
            })
        }

    }catch(error){
        console.log(error);
        {
            return res.status(401).json({
                success:false,
                message:"Login Failure,please try again"
            })
        }
    }
}

exports.signUp=async(req,res)=>{
    console.log("SIGNUP REQ.Body:",req.body)
    try{
        //data fetch from request body
        const {firstName,lastName,email,password,confirmPassword,accountType,collegeId,collegeName,otp}=req.body

        if(!firstName || !lastName || !email || !password || !confirmPassword ||!accountType || !collegeId ||!otp ||!collegeName){
            return res.status(400).json({
                success:false,
                message:"All Fields are required"
            })
        }

        if(password !==confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Passwords do not match"
            })
        }

        if(!mongoose.Types.ObjectId.isValid(collegeId)){
            return res.status(400).json({
                success:false,
                message:"Invalid College ID Format"
            })
        }

        const collegeExists=await collegeId.findById(collegeId)
        if(!collegeExists){
            return res.status(404).json(
                {
                    success:false,
                    message:"The selected collge does not exist"
                }
            )
        } 

        const userExists=await User.findOne({email});
        if(userExists){
            return res.status(409).json({
                success:false,
                message:"User is already registered with this email"
            })
        }

        const recentOtp=await OTP.find({email}).sort({createdAt:-1}).limit(1)
        console.log("this is recent otp:",recentOtp)

        if(recentOtp.length===0){
            return res.status(400).json({
                success:false,
                message:"The OTP is not valid"
            })
        }else if(otp !==recentOtp[0].otp){
            return res.status(400).json({
                success:false,
                message:"otp did not matched,Enter the valid otp"
            })
        }

        const passwordHash=await bcrypt.hash(password,10)

        const newUser=await User.create({
            firstName,
            lastName,
            email,
            passwordHash,
            accountType,
            collegeId,
            collegeName
        })

        const payload={ 
            email:newUser.email,
            id:newUser._id,
            accountType:newUser.accountType
        }

        let token=jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"24h"})
        newUser.passwordHash=undefined

        const options={
            expires:new Date(Date.now()+3*24*60*60*1000),
            httpOnly:true
        }

        return res.cookie("token",token,options).status(201).json({
            success:true,
            message:"User registered successfully",
            token,
            user:newUser
        })

    }catch(error){
        console.log(error)
        res.status(500).json({
            success:false,
            message:"Internal server error during Signup"
        })
    }
}