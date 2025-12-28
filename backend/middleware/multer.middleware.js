import multer from "multer";
import path from "path";
import ExpressError from "../utils/expressError.js"

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./temp/profile_urls"); 
    },

    filename: function (req, file, cb) {
        const uniquefileName = (req.user?.id || 'guest') + '-' + Date.now() ;

        cb(null, uniquefileName + path.extname(file.originalname));
    }
});


const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);

    } else {
        cb(new ExpressError(400,"Please upload only images.."), false);
    }
};

export const uploadFile = multer({ 
    storage,
    limits: { fileSize: 10* 1024 * 1024 }, 
    fileFilter 
});