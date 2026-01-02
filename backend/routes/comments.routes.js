import { Router } from "express";
import commentController from "../controllers/comment.controller.js";
import asyncHandler from "../utils/asyncHandler.js";
import checkAuth from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/checkrole.middleware.js";


const router = Router();


// Post a comment for a discussion
router.post("/add-comment",checkAuth , checkRole("user"), asyncHandler(commentController.addaComment))

// Handle comment likes
router.post("/like-comment/:id", checkAuth, checkRole("user"), asyncHandler(commentController.likeaComment));


// Reply to a comment
router.post("/reply-comment",checkAuth, checkRole("user"),asyncHandler(commentController.addreplytoaComment))


// Get all comments under a given discussion
router.get("/discussions/:id", checkAuth, checkRole("user"), asyncHandler(commentController.getallCommentsforaDiscussion))



export default router;