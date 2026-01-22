import { Router } from "express";
import pathController from "../controllers/paths.controllers.js";
import asyncHandler from "../utils/asyncHandler.js"


const router = Router();


// Get all the available paths 
router.get("/paths", asyncHandler(pathController.getallPaths));



// Get a path by a Id
router.get("/:id", asyncHandler(pathController.getPathById));




export default router;