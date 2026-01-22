import { Router } from "express";
import questionController from "../controllers/questions.contollers.js";
import asyncHandler from "../utils/asyncHandler.js"
import checkAuth from "../middleware/auth.middleware.js"
import userProtected from "../middleware/userProtected.middleware.js";
import adminProtected from "../middleware/adminProtected.middleware.js";

const router = Router();


// Post a question
router.post("/post-question", checkAuth, adminProtected ,asyncHandler(questionController.addQuestion))


// Run a question to compiler
router.post("/run-question", checkAuth, userProtected , asyncHandler(questionController.runaQuestion));


// Submit a question to compiler
router.post("/submit-question", checkAuth, userProtected, asyncHandler(questionController.submitaQuestion));


// Make a daily question
router.post("/daily-question/:id", checkAuth, adminProtected, asyncHandler(questionController.makeaDailyQuestion))


// Get any question by id 
router.get("/questions/:id", asyncHandler(questionController.getQuestionById))


// Get all Questions 
router.get("/questions", asyncHandler(questionController.getAllQuestions))


export default router;