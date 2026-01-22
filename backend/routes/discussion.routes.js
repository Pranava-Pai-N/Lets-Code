import { Router } from "express";
import checkAuth from "../middleware/auth.middleware.js";
import userProtected from "../middleware/userProtected.middleware.js";
import discussionController from "../controllers/discussions.controllers.js";
import asyncHandler from "../utils/asyncHandler.js"


const router = Router();


// Handle new Discussions
router.post("/post-discussion", checkAuth, userProtected ,asyncHandler(discussionController.createDiscussion))



// Handle discussion likes
router.post("/like-discussion/:id", checkAuth, userProtected ,asyncHandler(discussionController.likeaDiscussion))



// Get all discussion for a given questionId
router.get("/question/:id", checkAuth , userProtected , asyncHandler(discussionController.getallDiscussionforaQuestion))



export default router;