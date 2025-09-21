const mongoose = require("mongoose");
const Analytic = require("../models/analytic.models");

exports.getAnalyticsByCollege = async (req, res) => {
    try {
        const { collegeId } = req.params;

        if(!mongoose.Types.ObjectId.isValid(collegeId)){
            return res
                    .status(400)
                    .json({
                        message: 'Invalid College ID format'
                    })
        }

        const analytics = await Analytic.find({
            collegeId
        });

        if (!analytics || analytics.length === 0) {
            return res
                    .status(404)
                    .json({
                        message: "No analytics data found for this college"
                    })
        }

        res
        .status(200)
        .json(analytics)

    } catch (error) {
        console.error('Error fetching analytics:', error);
        res
        .status(500)
        .json({
            message: 'Server error while fetching analytics data'
        })
    }
}

/**
 * @desc    Create a new analytics entry
 * @route   POST /api/analytics
 * @access  Private (System/Admin) - This might be an internal endpoint
 */

exports.createAnalyticEntry = async (req, res) => {
    try {
        const { collegeId, metric, value, period } = req.body;

        if(!collegeId || !metric || value === undefined || !period) {
            return res.status(400).json({
              message:
                "Missing required fields: collegeId, metric, value, period",
            });
        }

        if(!mongoose.Types.ObjectId.isValid(collegeId)) {
            return res
                    .status(400)
                    .json({
                        message: 'Invalid College ID format'
                    })
        }

        const newAnalytic = new Analytic({
            collegeId,
            metric,
            value,
            period,
        });

        const savedAnalytic =  await newAnalytic.save();

        res
        .status(201)
        .json(savedAnalytic);
    } catch (error) {
        console.error('Error creating analytic entry:', error);
        res
        .status(500)
        .json({
            message: 'Server error while creating analytic entry'
        });
    }
};