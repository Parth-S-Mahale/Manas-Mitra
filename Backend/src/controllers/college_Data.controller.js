const College=require('../models/college.models')
const mongoose=require("mongoose")

exports.createCollege=async(req,res)=>{
    try{
        const {name,address,contactEmail}=req.body;

        if(!name||!address||!contactEmail){
            return res.status(400).json({
                success:false,
                message:"Name,address and contact email are required"
            })
        }

        const existingCollege=await College.findOne({$or:[{name},{contactEmail}]});
        if(existingCollege){
            return res.status(409).json({
                success:false,
                message:"College with this name or contact email already exists"
            })
        }

        const newCollege=await College.create({
            name,
            college,
            contactEmail,
            languagesSupport:req.body.languagesSupport ||['English']

        })

        res.status(201).json({
            success:true,
            message:"College created successfully",
            college:newCollege
        })

    }catch(error){
        console.error("Error creating college",error)
        res.status(500).json({
            success:false,
            message:"Failed  create college due to a server error."
        })
    }
}

exports.getAllColleges=async(req,res)=>{
    try{
        const colleges=await College.find({},'name address')
        res.status(200).json({
            success:true,
            colleges
        })
    }catch(error){
         console.error("Error fetching all colleges:", error);
          res.status(500).json({
          success: false, 
          message: "Failed to fetch colleges"
        })
    }
}

exports.getCollegeById=async(req,res)=>{
    try{
        const {collegeId}=req.params;

        if(!mongoose.Types.ObjectId.isValid(collegeId)){
            return res.status(400).json({
                success:false,
                message:"Invalid Colege Id format"
            })
        }

        const college=await College.findById(collegeId)
        if(!college){
            return res.status(404).json({
                success:false,
                message:"College not found"
            })
        }

        res.status(200).json({
            success:true,
            college,
        })


    }catch(error){
        console.error("Error fetching college by ID",error);
        res.status(500).json({
            success:false,
            message:"Failed to fetch college details"
        })
    }
}

exports.updateCollege=async(req,res)=>{
    try{
        const {collegeId}=req.params;
        const updates=req.body;

        if(!mongoose.Types.ObjectId.isValid(collegeId)){
            return res.status(400).json({
                success:false,
                message:"Invalid College ID Format"
            })
        }

        const updatedCollege=await College.findByIdAndUpdate(collegeId,updates,{new:true,runValidators:true})

        if(!updatedCollege){
            return res.status(404).json({
                success:false,
                message:"College not found"
            })
        }

        res.status(200).json({
            success:true,
            message:"College updated successfully",
            college:updatedCollege
        })
    }catch(error){
        console.error("Error updating college:", error);
        res.status(500).json({
             success: false,
              message: "Failed to update college"
            })
    }
}