const express = require("express");
const router = express.Router();

const { auth, isStudent, isAdmin } = require("../middlewares/auth");

const {
  createPost,
  getAllPosts,
  getPostsByCollege,
  updatePost,
  deletePost,
} = require("../controllers/forum_Post.controller");

router.get("/", getAllPosts);

router.get("/college/:collegeId", getPostsByCollege);

router.post("/create", auth, isStudent, createPost);

router.put("/:postId", auth, updatePost);

router.delete("/:postId", auth, deletePost);

module.exports = router;
