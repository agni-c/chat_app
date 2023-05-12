const express = require('express')
const { sendMessage, allMessages } = require('../controller/messageController')
const { protect } = require('../middleware/authMiddleWare')
const router = express.Router()

router.route('/').post(protect, sendMessage) // send message api
router.route('/:chatId').get(protect, allMessages) // get message api

module.exports = router
