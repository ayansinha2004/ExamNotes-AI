const userModel = require('../models/user.model')

const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId;

        // If the auth middleware passed but userId is missing, handle gracefully as Guest Mode
        if (!userId) {
            return res.status(200).json({ 
                authenticated: false, 
                message: "Guest session active" 
            });
        }

        const user = await userModel.findById(userId);
        
        if (!user) {
            return res.status(404).json({ 
                authenticated: false, 
                message: "Session expired or user not found" 
            });
        }

        return res.status(200).json({
            authenticated: true,
            message: "User context loaded successfully",
            user: user
        });
        
    } catch (err) {
        console.error("Get Current User Engine Error:", err);
        return res.status(500).json({ 
            authenticated: false, 
            message: "Internal server error fetching user context status." 
        });
    }
}

module.exports = { getCurrentUser };