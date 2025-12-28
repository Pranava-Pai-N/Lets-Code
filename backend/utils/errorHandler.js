const errorHandler = (err,req,res,next) =>{
    if (err) {
        const statusCode = err.status || 500;
        const message = err.message || "Internal Server Error";

        return res.json({
            success : false,
            status : statusCode,
            message : message
        });
        
    } else {
        next();
    }
}

export default errorHandler;