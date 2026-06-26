const userModel = require('../models/user.model')
const getToken = require('../utils/token')

const googleAuth = async (req, res) => {
    try {
        const { name, email } = req.body
        let existingUser = await userModel.findOne({ email })
        if (existingUser) {

            const token = await getToken(existingUser._id)

            res.cookie('token', token, {
                httpOnly: true,
                secure: false,
                sameSite: "none",
                maxAge: 7 * 24 * 60 * 60 * 1000
            })

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
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return res.status(200).json({
            message: "User created successfully",
            user: newUser
        })
    } catch (err) {
        console.log(err)
    }
}

const logout = async (req, res) => {
    try {
        await res.clearCookie('token')
        res.status(201).json({ message: "User logged out successfully" })
    } catch (err) {
        console.log(err)
    }
}

module.exports = { googleAuth, logout }