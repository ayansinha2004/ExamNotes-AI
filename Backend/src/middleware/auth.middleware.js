const jwt = require('jsonwebtoken')

const isAuth = async (req, res, next) => {
    try {
        let token = req.cookies.token
        if (!token) {
            return res.status(400).json({ message: "Token is not found" })
        }
        const verifyToken = await jwt.verify(token, process.env.JWT_SECRET)
        if (!verifyToken) {
            return res.status(400).json({ message: "Unauthorized access" })
        }
        req.userId = verifyToken.userId
        next()
    } catch (err) {
        return res.status(400).json({ "Auth error": err })
    }
}

module.exports = isAuth