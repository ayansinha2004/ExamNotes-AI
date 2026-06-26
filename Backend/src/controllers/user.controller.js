const userModel = require('../models/user.model')

const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId
        const user = await userModel.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        return res.status(200).json({
            message: "User found",
            user: user
        })
    } catch (err) {
        console.log(err)
    }
}

module.exports = { getCurrentUser }