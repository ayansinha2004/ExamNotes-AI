const express = require('express')
const authMiddleware = require('../middleware/auth.middleware')
const userController = require('../controllers/user.controller')

const userRouter = express.Router()

//login of the current user
userRouter.get('/currentUser', authMiddleware, userController.getCurrentUser)

module.exports = userRouter
