import { v2 as cloudinary } from "cloudinary";
import fs from "fs"
import ExpressError from "./expressError.js";
import dotenv from "dotenv";

dotenv.config();



cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


export const uploadtoCloudinary = async (localFilePath , id) => {
    try {
        if (!localFilePath)
            throw new ExpressError(404, "File local path not found ..");

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type : "auto",
            folder : `profile_urls/${id}`
        })
        
        if(fs.existsSync(localFilePath)){
            fs.unlinkSync(localFilePath);
        }

        return response;
        
    } catch (error) {
        if (localFilePath && fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        
        console.log("Error uploading file to cloudinary : ", error);
        throw new ExpressError(400, "Error uploading to cloudinary : ", error);
    }
}


