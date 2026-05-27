import { Router } from "express";
import userRoutes from "./user.routes.js";
import questionRoutes from "./questions.routes.js";
import pathRoutes from "./paths.routes.js";
import discussionRoutes from "./discussion.routes.js";
import commentRoutes from "./comments.routes.js";
import notificationRoutes from "./notifications.routes.js";


const router = Router();

// User Routes
router.use("/users", userRoutes);

// Question Routes
router.use("/questions", questionRoutes);

// Path Routes
router.use("/paths", pathRoutes);

// Discussion Routes
router.use("/discussions", discussionRoutes);

// Comment Routes
router.use("/comments", commentRoutes);

// Notification Routes
router.use("/notifications", notificationRoutes)


export default router;