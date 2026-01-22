import { Router } from "express";
import userController from "../controllers/user.controllers.js";
import asyncHandler from "../utils/asyncHandler.js"
import checkAuth from "../middleware/auth.middleware.js";
import passport from "passport";
import { uploadFile } from "../middleware/multer.middleware.js";
import userProtected from "../middleware/userProtected.middleware.js";
import adminProtected from "../middleware/adminProtected.middleware.js";



const router = Router();


// Register a new User
router.post("/register", asyncHandler(userController.registerUser))


// Complete user profile
router.patch("/complete-profile", checkAuth, userProtected, asyncHandler(userController.completeProfile))


// Verify a User
router.post("/verify", asyncHandler(userController.verifyUser))



// Login a user 
router.post("/login", asyncHandler(userController.loginUser));


// Edit user profile
router.patch("/edit-profile", checkAuth , userProtected , asyncHandler(userController.editProfile))



// Forgot a password
router.post("/forgot-password", asyncHandler(userController.forgotPasswordwithotp))



// Reset a password
router.post("/reset-password", asyncHandler(userController.handlePasswordReset))


// Get UserDetails from Leetcode
router.post("/leetcode-data", checkAuth , userProtected , asyncHandler(userController.getLeetCodeDatabyUsername))


// Change user profile url
router.patch("/update-profileurl", checkAuth , userProtected , uploadFile.single("profileImage") , asyncHandler(userController.handleProfileURlChange))


// Get Gemini Help
router.post("/ai-help" ,checkAuth , userProtected , asyncHandler(userController.getGeminiHelp));



// Get all submissions by a user
router.get("/submissions", checkAuth, userProtected , asyncHandler(userController.getallSubmissions));



// Get submission by id
router.get("/submissions/:submissionId", checkAuth, userProtected , asyncHandler(userController.getSubmissionbyId))



// Get recent activity
router.get("/recent-activity", checkAuth, userProtected , asyncHandler(userController.getRecentActivity))



// Logout a User
router.get("/logout", asyncHandler(userController.logoutUser));


// Get all available users in the platform
router.get("/users" , adminProtected , asyncHandler(userController.getallUsers));



// Get Logged in User
router.get("/me", checkAuth, userProtected , asyncHandler(userController.getMe));



// Google authentication
router.get("/google-auth", (req,res,next) =>{
    const mode = req.query.mode || "signup";

    passport.authenticate("google", { scope : ["profile","email"] , state : mode })(req,res,next);
});



// User will be redirected after login
router.get("/google/callback", (req, res, next) => {
    passport.authenticate("google", { session: false }, (err, user, info) => {
        if (err) {
            return res.redirect(`${process.env.FRONTEND_URL}/login?errorMessage=${encodeURIComponent(err)}`);
        }
        if (!user) {
            const errorMessage = info?.message || "Authentication failed";
            
            return res.redirect(`${process.env.FRONTEND_URL}/login?errorMessage=${encodeURIComponent(errorMessage)}`);
        }
        
        req.user = user;
        next();

    })(req, res, next);
}, asyncHandler(userController.googleAuthSuccess)
);


// Github Authentication
router.get("/github-auth",(req,res,next) =>{
    const mode = req.query.mode || "signup";

    passport.authenticate("github" , { scope : ["user:email", "read:user"] , state : mode })(req,res,next)
});



// User will be redirected after login
router.get("/github/callback", (req, res, next) => {
    passport.authenticate("github", { session : false , failureRedirect : "/login" , failureFlash : true}, (err, user, info) => {
        if (err) {
            return res.redirect(`${process.env.FRONTEND_URL}/login?errorMessage=${encodeURIComponent(err)}`);
        }
        if (!user) {
            const errorMessage = info?.message || "Authentication failed";
            return res.redirect(`${process.env.FRONTEND_URL}/login?errorMessage=${encodeURIComponent(errorMessage)}`);
        }
        
        req.user = user;
        next();

    })(req, res, next);
} , asyncHandler(userController.githubAuthSuccess)
)


export default router;