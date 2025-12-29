import User from "../models/user.models.js"
import ExpressError from "../utils/expressError.js"

export const checkRole = (role = "user") => {
    return async (req, res, next) => {
        try {
            const userId = req.user?.id || req.user?._id;

            if (!userId) {
                return next(new ExpressError(401, "Unauthorized: No user ID found"));
            }

            const user = await User.findById({ _id: userId });

            if (!user) {
                return next(new ExpressError(404, "User not found"));
            }

            if (user.role === role) {
                return next();
            }
            else {
                res.status(403).json({
                    success: false,
                    message: "Access Denied: Insufficient Permissions"
                });
            };

        } catch (error) {
            return next(new ExpressError(400, "Error checking user role"));
        }
    }
}