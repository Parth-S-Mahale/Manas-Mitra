const mongoose=require("mongoose")

const OTPSchema=new mongoose.Schema({

    email:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60
    }
})

async function sendVerificationEmail(email,otp){
    try{
        const mailResponse=await mailSender(email)
     }
     catch(error) {
        console.error("Internal server error!");
     }
}

module.exports=mongoose.model("OTP",OTPSchema)