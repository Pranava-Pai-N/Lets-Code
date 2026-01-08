import express from "express";
import userController from "../controllers/user.controllers.js";
import asyncHandler from "../utils/asyncHandler.js"
import checkAuth from "../middleware/auth.middleware.js";
import passport from "passport";
import { uploadFile } from "../middleware/multer.middleware.js"
import { checkRole } from "../middleware/checkrole.middleware.js"


const router = express.Router();


// Register a new User
router.post("/register",asyncHandler(userController.registerUser))


// Complete user profile
router.patch("/complete-profile",checkAuth,checkRole("user"),asyncHandler(userController.completeProfile))


// Verify a User
router.post("/verify",asyncHandler(userController.verifyUser))



// Login a user 
router.post("/login",asyncHandler(userController.loginUser));


// Edit user profile
router.patch("/edit-profile", checkAuth ,checkRole("user"),asyncHandler(userController.editProfile))



// Forgot a password
router.post("/forgot-password", asyncHandler(userController.forgotPasswordwithotp))



// Reset a password
router.post("/reset-password", asyncHandler(userController.handlePasswordReset))


// Get UserDetails from Leetcode
router.post("/leetcode-data",checkAuth ,checkRole("user"),asyncHandler(userController.getLeetCodeDatabyUsername))


// Change user profile url
router.patch("/update-profileurl", checkAuth , checkRole("user") , uploadFile.single("profileImage") , asyncHandler(userController.handleProfileURlChange))


// Get Gemini Help
router.post("/ai-help" ,checkAuth , checkRole("user"),asyncHandler(userController.getGeminiHelp));



// Get all submissions by a user
router.get("/submissions",checkAuth,checkRole("user"),asyncHandler(userController.getallSubmissions));



// Get submission by id
router.get("/submissions/:submissionId",checkAuth,checkRole("user"),asyncHandler(userController.getSubmissionbyId))



// Get recent activity
router.get("/recent-activity",checkAuth,checkRole("user"),asyncHandler(userController.getRecentActivity))



// Logout a User
router.get("/logout",asyncHandler(userController.logoutUser));


// Get all available users in the platform
router.get("/users" ,checkRole("admin"), asyncHandler(userController.getallUsers));



// Get Logged in User
router.get("/me",checkAuth,checkRole("user"),asyncHandler(userController.getMe));



// Google authentication
router.get("/google-auth", passport.authenticate("google", { scope : ["profile","email"]}));



// User will be redirected after login
router.get("/google/callback", 
    passport.authenticate("google", { session: false, failureRedirect: "/login" , failureFlash : true}),
    asyncHandler(userController.googleAuthSuccess)
);


// Github Authentication
router.get("/github-auth",passport.authenticate("github" , { scope : ["user:email", "read:user"]}));



// User will be redirected after login
router.get("/github/callback",
    passport.authenticate("github", { session : false , failureRedirect : "/login" , failureFlash : true}),
    asyncHandler(userController.githubAuthSuccess)
)


export default router;