const userModel = require('../models/user.model')
const getToken = require('../utils/token')

// Helper for cookie options to keep configuration consistent
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', 
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
}

const googleAuth = async (req, res) => {
    try {
        const { name, email } = req.body
        let existingUser = await userModel.findOne({ email })

        if (existingUser) {
            const token = await getToken(existingUser._id)
            res.cookie('token', token, cookieOptions)

            return res.status(200).json({
                message: "Login successful",
                user: existingUser
            })
        }

        const newUser = await userModel.create({
            name,
            email
        })
        
        let token = await getToken(newUser._id)
        res.cookie('token', token, cookieOptions)

        return res.status(200).json({
            message: "User created successfully",
            user: newUser
        })
    } catch (err) {
        console.error("Google Auth Error:", err)
        return res.status(500).json({ message: "Internal server error during authentication" })
    }
}

const logout = async (req, res) => {
    try {
        // Pass the same cookie options (minus maxAge) when clearing
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
        })
        return res.status(200).json({ message: "User logged out successfully" }) // Fixed to 200
    } catch (err) {
        console.error("Logout Error:", err)
        return res.status(500).json({ message: "Internal server error during logout" })
    }
}

module.exports = { googleAuth, logout }