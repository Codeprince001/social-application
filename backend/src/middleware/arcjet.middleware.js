import { aj } from "../config/arcjet";

export const arcjetMiddleware =async  (req, res, next) => {
    try {
        const decision = await aj.protect(req, {
            requested: 1,
        })

        if (decision.isDenied()) {
            if (decision.isBot()) {
                return res.status(403).json({message: "Access denied: Bot traffic detected"});
            }
            else if (decision.reason.isRateLimit()) {
                return res.status(429).json({message: "Too many requests. Please try again later."});
            }else {
                return res.status(403).json({message: "Access denied by security policy"});
            }
        }


        next();
    } catch (error) {
        console.error("Arcjet middleware error:", error);
        return res.status(500).json({message: "Internal server error"});
    }
};