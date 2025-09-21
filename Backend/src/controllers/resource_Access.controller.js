const Resource_access=require('../models/resource_access.models')
const Resource=require('../models/resource_model.models')
const mongoose=require('mongoose')

exports.logResourceAccess=async(req,res)=>{
    try{
        const {resourceId,isAnonymized}=req.body;
        const userId=req.user.id

        if(!resourceId){
            return res.status(400).json({
                success:false,
                message:"ResourceId is required"
            })
        }

        if(!mongoose.Types.ObjectId.isValid(resourceId)){
            return res.status(400).json({
                success:false,
                message:"Invalid Resource ID format."
            })
        }

        const resourceExists=await Resource.findById(resourceId);
        if(!resourceExists){
            return res.status(404).json({
                success:false,
                message:"The resource are trying to access does not exist"
            })
        }

        await Resource_access.create({
            userId,
            resourceId,
            isAnonymized:isAnonymized || false,
        })

        res.status(201).json({
            success:true,
            message:"Resource access logged successfully"
        })
    }catch(error){
        console.error("Error logging resource access",error)
        res.status(500).json({
            success:false,
            message:"Failed to log resource access due to a server error"
        })

    }
}

exports.getAccessHistoryForUser=async(req,res)=>{
    try{
        const userId=req.user.id;
        const page=parseInt(req.query.page)||1
        const limit=parseInt(req.query.limit) ||10
        const skip=(page-1)*limit

        const accessLogs=await ResourceAccess({userId})
            .populate({
                path:'resourceId',
                select:'title type language url'
            })
            .sort({accessedAt:-1})
            .skip(skip)
            .limit(limit);

        const totalLogs=await Resource_access.countDocuments({userId})

        res.status(200).json({
            success:true,
            totalPages:Math.ceil(totalLogs/limit),
            currentPage:page,
            history:accessLogs
        })

    }catch(error){
         console.error("Error fetching user access history:", error);
         res.status(500).json({ success: false, message: "Failed to fetch access history." });

    }
}
