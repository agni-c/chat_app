const express = require('express')
const {
	registerUser,
	authUser,
	allUsers
} = require('../controller/userController')
const { protect } = require('../middleware/authMiddleWare')
const router = express.Router()

router
	.route('/')
	.get(protect, allUsers) // get user api
	.post(registerUser) // register user api

router.post('/login', authUser)

module.exports = router
