import express , { Router } from "express";
import questionController from "../controllers/questions.contollers.js";
import asyncHandler from "../utils/asyncHandler.js"
import checkAuth from "../middleware/auth.middleware.js"
import { checkRole } from "../middleware/checkrole.middleware.js";


const router = Router();


// Post a question
router.post("/post-question",checkAuth,checkRole("admin"),asyncHandler(questionController.addQuestion))


// Run a question to compiler
router.post("/run-question", checkAuth, asyncHandler(questionController.runaQuestion));


// Submit a question to compiler
router.post("/submit-question",checkAuth, asyncHandler(questionController.submitaQuestion));


// Make a daily question
router.post("/daily-question/:id",checkAuth, checkRole("admin") ,asyncHandler(questionController.makeaDailyQuestion))


// Get any question by id 
router.get("/questions/:id",asyncHandler(questionController.getQuestionById))


// Get all Questions 
router.get("/questions",checkAuth,asyncHandler(questionController.getAllQuestions))


export default router;