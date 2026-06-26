const jwt = require('jsonwebtoken')

const getToken = async (userId) => {
    try {
        const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" })
        return token
    } catch (err) {
        console.log(err)
    }
}

module.exports = getToken