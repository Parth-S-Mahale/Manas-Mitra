const ForumModerationLog = require("../models/forum_moderation_log.models.js");
const mongoose = require("mongoose");

/* 
===============================================
--- Create a Log Entry (Internal Function) ---
This is not an API endpoint. It's a helper function called by other controllers.
=============================================== 
*/
exports.createLogEntry = async (logData) => {
    try {
        const { postId, action, reason, moderatorId } = logData;

        if (!postId || !action || !moderatorId) {
            console.error("Attended to create a log entry with missing data.");
            return;
        }

        await ForumModerationLog.create({
            postId,
            action,
            reason: reason || "No reason provided",
            moderatorId,
        });

        console.log("Error creating moderation log entry:", error);
    } catch (error) {
        console.error("Error creating moderation log entry:", error);
    }
};


/* 
===============================================
--- Get All Moderation Logs (For Admins) ---
Fetches a paginated list of all log entries.
=============================================== 
*/
exports.getAllModerationLogs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const logs  = await ForumModerationLog.find({})
                            .populate('moderatorId', 'firstname lastname email')
                            .populate('postId', 'title')
                            .sort({created:-1})
                            .skip(skip)
                            .limit(limit);
        
        const totalLogs = await ForumModerationLog.countDocuments();

        res
        .status(200)
        .json({
            success: true,
            totalPages: Math.ceil(totalLogs / limit),
            currentPage: page,
            logs
        });
    } catch (error) {
        console.error("Error fetching all moderation logs:", error);
        res
        .status(500)
        .json({
            success: false,
            message: "Failed to fetch moderation logs."
        });
        
    }
};


/* 
===============================================
--- Get Logs for a Specific Post (For Admins) ---
Fetches the full moderation history for a single forum post.
=============================================== 
*/
exports.getLogsForPost = async (req, res) => {
    try {
        const {postId} = req.params;

        if(!mongoose.Types.ObjectId.isValid(postId)) {
            return res
                    .status(400)
                    .json({
                        success: false,
                        message: "Invalid Post ID format."
                    });
        }

        const logs = await ForumModerationLog.find({postId})
                            .populate('moderatorId', 'firstName lastName email')
                            .sort({createdAt: -1});
        
        if (!logs.length) {
            return res
                    .status(404)
                    .json({
                        success: false,
                        message: "No moderation history found for this post."
                    })
        }

        res
        .status(200)
        .json({
            success: true,
            logs,
        });

    } catch (error) {
        console.error("Error fetching logs for post:", error);
        res
        .status(500)
        .json({
            success: false,
            message: "Failed to fetch moderation logs for the specified post."
        })
        
    }
}