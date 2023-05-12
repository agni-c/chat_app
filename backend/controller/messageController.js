const expressAsyncHandler = require('express-async-handler')
const Message = require('../models/messageModel.js')
const User = require('../models/userModel.js')
const Chat = require('../models/chatModel.js')

const sendMessage = expressAsyncHandler(async (req, res) => {
  const { content, chatId } = req.body

  if (!content || !chatId) {
    res.status(400)
    throw new Error('Invalid message data')
  }
  let newMessage = {
    sender: req.user._id,
    content,
    chat: chatId
  }
  try {
    let message = await Message.create(newMessage)
    message = await message.populate('sender', 'name pic')
    message = await message.populate('chat')
    message = await User.populate(message, {
      path: 'chat.sender',
      select: 'name pic email'
    })

    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message
    })

    res.status(201).json(message)
  } catch (error) {
    throw new Error(error)
  }
})

const allMessages = expressAsyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
			.populate('sender', 'name pic email')
			.populate('chat')
			.sort({ createdAt: -1 })

    res.json(messages)
  } catch (error) {
    throw new Error(error)
  }
})

module.exports = { sendMessage, allMessages }
