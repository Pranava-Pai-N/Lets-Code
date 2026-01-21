import { Router } from "express";
import notificationController from "../controllers/notifications.controller.js";
import asyncHandler from "../utils/asyncHandler.js";
import checkAuth from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/checkrole.middleware.js";



const router = Router();



// To get top k notification
router.get("/:top_k", checkAuth , checkRole("user"),asyncHandler(notificationController.gettopKNotifications));


// To get all notifications 
router.get("/", checkAuth , checkRole("user") ,asyncHandler(notificationController.getAllNotifications));



export default router;