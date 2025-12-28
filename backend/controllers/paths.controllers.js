import Path from "../models/paths.models.js";
import ExpressError from "../utils/expressError.js";

const getPathById = async(req,res) =>{
    try {
        const { pathId } = req.params;
    
        if(!pathId)
            throw new ExpressError(404,"Please provide a pathId to search for any paths .")
    
        const path = await Path.findById(pathId);
    
        if(!path)
            throw new ExpressError(404,`Path does not exist with ID : ${pathId}`)
    
        return res.status(200).json({
            success : true,
            foundPath : path
        });

    } catch (error) {
        console.log("Error in retrieving the path . Please try again later : ", error);
    }
}


const getallPaths = async(req,res) =>{
    try {
        const availablePaths = await Path.find();
    
        if(!availablePaths)
            throw new ExpressError(404,"No paths exists currenty . Please create a path to continue .")
    
        return res.status(200).json({
            success : true,
            allPaths : availablePaths
        });

    } catch (error) {
        console.log("Error in retrieving all the paths . Please try again later : ", error);
    }
}


const pathController = {
    getPathById,
    getallPaths
};

export default pathController;