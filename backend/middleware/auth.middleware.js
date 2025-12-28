import jwt from "jsonwebtoken";

const checkAuth = async (req, res, next) => {
    try {
        let token = null;
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }
        else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }
        if (!token)
            return res.status(401).json({
                success: false,
                message: "No Token Provided . Access Denied ..."
            })

        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decoded;

        next()

    } catch (error) {

        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                success: false,
                message: 'Session Expired . Please Login again ..',
            });

        }
        if (error instanceof jwt.JsonWebTokenError || error instanceof TokenError) {
            return res.status(401).json({
                success: false,
                message: 'Invalid Token',
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server Error',
        });
    }
}

export default checkAuth;