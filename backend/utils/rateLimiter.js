import Redis from "ioredis";

const client = new Redis(); 

client.on("error", (err) => {
    console.error("Redis Client Error:", err);
});

const rateLimiter = async (req, res, next) => {
    const key = `rate:${req.ip}`;
    const requestsLimit = 10;
    const windowSize = 60;

    try {
        const current = await client.incr(key);

        if (current === 1) {
            await client.expire(key, windowSize);
        }

        if (current > requestsLimit) {
            return res.status(429).json({
                error: "Too many requests. Please wait for a while",
            });
        }
        next();
        
    } catch (error) {
        console.error("Rate limiter failed:", error);
        next(); 
    }
};

export default rateLimiter;