const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth.controller')

//google authentication
router.post('/google', authController.googleAuth)
//logout 
router.get('/logout', authController.logout)

module.exports = router