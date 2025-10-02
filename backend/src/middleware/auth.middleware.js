export const protectedRoute = async (req, res, next) => {
    try {
        if (!req.auth().isAuthenticated) {
            return res.status(401).json({ error: "Unauthorized" });
        }
    }
    catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
    next();
}