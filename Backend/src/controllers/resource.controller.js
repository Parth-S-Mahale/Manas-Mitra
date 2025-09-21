const Resource = require("../models/resource_model.models.js");
const ResourceAccess = require("../models/resource_access.models.js");
const mongoose = require("mongoose");

/* ==================================================
--- Create a New Resource (Admins/Counselors only) ---
================================================== */
exports.createResource = async (req, res) => {
    try {
        const { title, url, type, description, collegeId, language, isAnonymous } = req.body;

        if (!title || !url || !type || !collegeId) {
            return res
                    .status(400)
                    .json({
                        success: false,
                        message: "Title, URL, type, and collegeId are required."
                    });
        }

        if (!mongoose.Types.ObjectId.isValid(collegeId)) {
            return res
                    .status(400)
                    .json({
                        success: false,
                        message: "Title, URL, type, and collegeId are required"
                    });
        }

        if (!mongoose.Types.ObjectId.isValid(collegeId)) {
            return res
                    .status(400)
                    .json({
                        success: false,
                        message: "Invalid College ID format."
                    });
        }

        const newResource = await Resource.create({
            title,
            url,
            type,
            description,
            collegeId,
            language: language || 'English',
            isAnonymous: isAnonymous || false,
        })

        res
        .status(201)
        .json({
            success: true,
            message: "Resource created successfully.",
            resource: newResource,
        });

    } catch (error) {
        console.error("Error creating resource:", error);
        res
        .status(500)
        .json({
            success: false,
            message: "Failed to create resource."
        });
    }
};


/* ==================================================
--- Get All Resources (Public) ---
================================================== */
exports.getAllResources = async (req, res) => {
    try {
        const { type } = req.query;
        const filter = type ? { type } : {};

        const resources = await Resource.find(filter)
                                .populate('collegeId', 'name')
                                .sort({createdAt: -1});

        res
        .status(200)
        .json({
            success: true,
            count: resources.length,
            resources,
        });
    } catch (error) {
        console.error("Error fetching all resources:", error);
        res
        .status(500)
        .json({
            success: false,
            message: "Failed to fetch resources."
        });
    }
};


/* ==================================================
--- Get Resources for a Specific College (Public) ---
================================================== */
exports.getResourcesByCollege = async (req, res) => {
    try {
        const { collegeId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(collegeId)) {
            return res
                    .status(400)
                    .json({
                        success: false,
                        message: "Invalid college ID format."
                    });
        }

        const resources = (await Resource.find({collegeId})).sort({createdAt: -1});

        res
        .status(200)
        .json({
          success: true,
          count:resources.length,
          resources,
        });
    } catch (error) {
        console.error("Error fetching resources by college:", error);
        res.status(500).json({
          success: false,
          message: "Failed to fetch resources for the specified college.",
        });
    }
}


/* 
==================================================
--- Update a Resource (Admins/Counselors only) ---
==================================================*/
exports.updateResource = async (req, res) => {
    try {
        const { resourceId } = req.params;

        if(!mongoose.Types.ObjectId.isValid(resourceId)) {
            return res
                    .status(400)
                    .json({
                        success: false,
                        message: "Invalid Resources ID format."
                    });
        }

        const updatedResource = await Resource.findByIdAndUpdate(
            resourceId,
            req.body,
            { 
                new: true, 
                runValidators: true 
            }
        );

        if (!updatedResource) {
            return res
                    .status(404)
                    .json({
                        success: false,
                        message: "Resource not found."
                    });
        }

        res
        .status(200)
        .json({
            success: true,
            message: "Resource updated successfully.",
            resource: updatedResource,
        });
    } catch (error) {
        console.error("Error updating resource:", error);
        res
        .status(500)
        .json({
            success: false,
            message: "Failed to update resource."
        });
    }
};


/* 
==============================================
--- Delete a Resource (Admins/Counselors only) ---
============================================== 
*/
exports.deleteResource = async (req, res) => {
    try {
        const { resourceId } = req.params;

        if(!mongoose.Types.ObjectId.isValid(resourceId)) {
            return res
                    .status(400)
                    .json({
                        success: false,
                        message: "Invalid Resource ID format."
                    });
        }

        const resource = await Resource.findByIdAndDelete(resourceId);

        if (!resource) {
            return res
                    .status(404)
                    .json({
                        success: false, 
                        message: "Resource not found."
                    });
        }

        await ResourceAccess.deleteMany({resourceId});

        res
        .status(200)
        .json({
            success: true,
            message: "Resouce and associated access logs deleted successfully."
        });
    } catch (error) {
        console.error("Error deleting resource:" ,error);
        res
        .status(500)
        .json({
            success: true,
            message: "Failed to delete resource."
        });
    }
}



/* 
===============================================
--- Track Resource Access (Authenticated Users) ---
=============================================== 
*/
exports.trackResourceAccess = async (req, res) => {
    try {
        const { resourceId } = req.params;
        const userId = req.user.id; // From auth middleware

        if(!mongoose.Types.ObjectId.isValid(resourceId)) {
            return res
                    .status(400)
                    .json({
                        success: false,
                        message: "Invalid Resource ID format."
                    });
        }

        const resource = await Resource.findById(resourceId);
        if(!resource) {
            return res
                    .status(404)
                    .json({
                        success: false,
                        message: "Resource not found."
                    })
        }

        await ResourceAccess.create({
            resourceId,
            userId,
            accessedAt: new Date(),
            isAnonymous: resource.isAnonymous,
        });

        res
        .status(200)
        .json({
            success: true,
            message: "Resource access tracked successfully.",
        })

    } catch (error) {
        console.error("Error tracking resource access:", error);
        res
        .status(500)
        .json({
            success: false,
            message: "Failed to track resource access."
        });
    }
};