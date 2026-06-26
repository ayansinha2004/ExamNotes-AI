const jwt = require('jsonwebtoken')

const isAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        
        if (!token) {
            // Fixed: Changed status to 401 Unauthorized for unauthenticated clients
            return res.status(401).json({ message: "Access denied: No token provided" });
        }

        // jwt.verify is synchronous by default unless given a callback; no need to await it
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (!decoded || !decoded.userId) {
            return res.status(401).json({ message: "Access denied: Invalid session" });
        }

        req.userId = decoded.userId;
        next();
    } catch (err) {
        console.error("JWT Verification Exception:", err.message);
        
        // Handle explicit expiration differently so the frontend knows to clear local user state
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Session expired, please login again" });
        }
        
        return res.status(401).json({ message: "Authentication failed" });
    }
}

module.exports = isAuth;