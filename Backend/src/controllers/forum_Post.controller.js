const ForumPost = require("../models/forum_post.models.js");
const User = require("../routes/user.route.js");
const  {mongoose, mongo } = require("mongoose");

/* 
=================================
--- Create a New Forum Post ---
=================================
*/
exports.createPost = async (req, res) => {
    try {
        const {title, content, collegeId} = req.body;

        const userId = req.user.id // Extracted from auth middleware

        if (!title || !content || !collegeId) {
            return res
                    .status(400)
                    .json({
                        success: false,
                        message: 'Title, content, and collegeId are required.'
                    })
        }

        if (!mongoose.Types.ObjectId.isValid(collegeId)) {
            return res 
                    .status(400)
                    .json({
                        success: false,
                        message: "Invalid College ID format."
                    })
        }

        const newPost = await ForumPost.create({
            title,
            content,
            userId,
            collegeId,
            status: 'active', // Default status
            isModerated: false,
        })

        const populatedPost = await ForumPost.findById(newPost._id).populate('userId', 'firstName lastName Image')

        res
        .status(201)
        .json({
            success: true,
            message: "Forum post created successfully.",
            post: populatedPost
        });
    } catch (error) {
        console.error("Error creating forum post:", error);
        res
        .status(500)
        .json({
            success: false,
            message: "Failed to create forum post."
        })  
    }
}

/* 
==================================
--- Get All Posts (Paginated) ---
==================================
*/
exports.getAllPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const posts = await ForumPost.find({status: 'active'})
                            .populate('userId', 'firstName lastName image') // Populate user info
                            .populate('collegeId', 'name') // Populate college name
                            .sort({ createdAt: -1 }) // show newest first
                            .skip(skip)
                            .limit(limit);

        const totalPosts = await ForumPost.countDocuments({ status: 'active' });                    

        res
        .status(200)
        .json({
            success: true,
            totalPages: Math.ceil(totalPosts / limit),
            currentPage: page,
            posts,
        })                    

    } catch (error) {
        console.error("Error fetching all posts:", error);
        res
        .status(500)
        .json({
            success: false,
            message: "Failed to fetch posts."
        });  
    }
};

/* 
=========================================
--- Get Posts for a Specific College ---
=========================================
*/
exports.getPostsByCollege = async (req, res) => {
    try {
        const {collegeId} = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        if (!mongoose.Types.ObjectId.isValid(collegeId)) {
            return res 
                    .status(400)
                    .json({
                        success: false,
                        message: "Invalid College ID format."
                    })
        }

        const posts = await ForumPost.find({ collegeId, status: 'active' })
                            .populate('userId', 'firstName lastName image')
                            .sort({ createdAt: -1}) // Newest Post
                            .skip(skip)
                            .limit(limit);

        const totalPosts = await ForumPost.countDocuments({ collegeId, status: 'active' })

        res
        .status(200)
        .json({
            success: true,
            totalPages: Math.ceil(totalPosts / limit),
            currentPage: page,
            posts,
        });

    } catch (error) {
        console.error("Error fetching posts by college:", error);
        res
        .status(500)
        .json({
            success: false,
            message: "Failed to fetch posts for the specified college."
        })        
    }
};

/* 
=========================================
--- Update a User's Own Post ---
=========================================
*/

exports.updatePost = async (req, res) => {
    try {
        const {postId} = req.params;
        const {title, content} = req.body;
        const userId = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res
                    .status(404)
                    .json({
                        success: false,
                        message: "Invalid Post ID format."
                    })
        }

        const post = await ForumPost.findById(postId);

        if (!post) {
            return res  
                    .status(404)
                    .json({
                        success: false,
                        message: 'Post not found.'
                    })
        }

        if (post.userId.toString() !== userId) {
            return res  
                    .status(403)
                    .json({
                        success: false,
                        message: "Forbidden. You are not authorized to update this post."
                    })
        }

        post.title = title || post.title;
        post.content = content || post.content;
        post.isModerated = false; // Reset moderation status on edit

        await post.save();

        const populatedPost = await ForumPost.findById(post._id).populate('userId', 'firstName lastName image');

        res
        .status(200)
        .json({
            success: true,
            message: "Post updated successfully",
            post: populatedPost,
        });

    } catch (error) {
        console.error("Error updating successfully.");
        res
        .status(500)
        .json({
            success: false,
            message: "Failed to update post."
        });
    }
};

/* 
=========================================
--- Delete a User's Own Post ---
=========================================
*/
exports.deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user.id;
        const userRole = req.user.accountType;

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res
                    .status(400)
                    .json({
                        success: false,
                        message: "Invalid Post ID format."
                    });
        }


        const post = await ForumPost.findById(postId);

        if (!post) {
            return res
                    .status(404)
                    .json({
                        success: false,
                        message: "Post not found."
                    });
        }

        // Allow deletion if the user is the author OR if they are an Admin/SuperAdmin
        if(post.userId.toString() !== userId && !['Admin', 'SuperAdmin'].includes(userRole)) {
            return res
                    .status(403)
                    .json({
                        success: false,
                        message: "Forbidden. You are not authorized to delete this post"
                    })
        }

        await FormData.findByIdAndDelete(postId);

        res
        .status(200)
        .json({
            success: true,
            message: "Post deleted successfully.",
        });
    } catch (error) {
        console.error("Error deleting post:", error);
        res
        .status(200)
        .json({
            success: false,
            message: "Failed to delete post."
        })
    }
};