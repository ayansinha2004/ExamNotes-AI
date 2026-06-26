const express = require('express')
const paymentController = require('../controllers/payment.controller')
const isAuth = require('../middleware/auth.middleware')

const creditRouter = express.Router()

creditRouter.post('/order', isAuth, paymentController.createCreditsOrder)

module.exports = creditRouter
