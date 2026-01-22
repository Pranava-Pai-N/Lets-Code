import { Router } from "express";
import commentController from "../controllers/comment.controller.js";
import asyncHandler from "../utils/asyncHandler.js";
import checkAuth from "../middleware/auth.middleware.js";
import userProtected from "../middleware/userProtected.middleware.js";


const router = Router();


// Post a comment for a discussion
router.post("/add-comment", checkAuth , userProtected , asyncHandler(commentController.addaComment))

// Handle comment likes
router.post("/like-comment/:id", checkAuth, userProtected , asyncHandler(commentController.likeaComment));


// Reply to a comment
router.post("/reply-comment", checkAuth, userProtected ,asyncHandler(commentController.addreplytoaComment))


// Get all comments under a given discussion
router.get("/discussions/:id", checkAuth, userProtected, asyncHandler(commentController.getallCommentsforaDiscussion))



export default router;