const asyncHandler = require('express-async-handler')
const Chat = require('../models/chatModel.js')
const User = require('../models/userModel.js')

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body

  if (!userId) {
    res.status(400)
    throw new Error('User not found')
  }

	// find all chat of user excluding group chat
  let isChat = Chat.find({
    isGroupChat: false,
    $and: [
			{ users: { $elemMatch: { $eq: req.user._id } } },
			{ users: { $elemMatch: { $eq: userId } } }
    ]
  })
		.populate('users', '-password')
		.populate('latestMessage')

  isChat = await User.populate(isChat, {
    path: 'latestMessage.sender',
    select: 'name pic email'
  })

  if (isChat.length > 0) {
    return res.json(isChat[0])
  }

	// if no chat found then create new chat
  const newChat = await Chat.create({
    users: [req.user._id, userId],
    chatName: `sender`,
    isGroupChat: false
  })
  try {
    const createdChat = await newChat.save()
    const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
			'users',
			'-password'
		)

    res.status(201).json(fullChat)
  } catch (error) {
    throw new Error('Chat not created')
  }
})

const fetchChat = asyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
			.populate('users', '-password')
			.populate('groupAdmin', '-password')
			.populate('latestMessage')
			.sort({ updatedAt: -1 })
			.then(async results => {
  const chats = await User.populate(results, {
    path: 'latestMessage.sender',
    select: 'name pic email'
  })
  res.status(200).json(chats)
})
  } catch (error) {
    res.status(400)
    throw new Error('Chat not found')
  }
})
const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    res.status(400)
    throw new Error('Please fill all the fields')
  }
  const users = JSON.parse(req.body.users)
  if (users.length < 2) {
    res.status(400)
    throw new Error('Please add atleast 2 users')
  }
  users.push(req.user._id)

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users,
      isGroupChat: true,
      groupAdmin: req.user
    })

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
			.populate('users', '-password')
			.populate('groupAdmin', '-password')

    res.status(201).json(fullGroupChat)
  } catch (error) {
    res.status(400)
    throw new Error('Chat not created')
  }
})
const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body
  const updatedChat = await Chat.findOneAndUpdate(
		{ _id: chatId },
		{ chatName },
		{ new: true }
	)
		.populate('users', '-password')
		.populate('groupAdmin', '-password')
  if (!updatedChat) {
    res.status(400)
    throw new Error('Chat not found')
  }
  res.status(200).json(updatedChat)
})
const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body

  if (!chatId || !userId) {
    res.status(400)
    throw new Error('Please fill all the fields')
  }

	// if (!chat.groupAdmin.equals(req.user._id)) {
	//   res.status(400)
	//   throw new Error('You are not admin of this group')
	// }
  const updatedChat = await Chat.findOneAndUpdate(
    {
      _id: chatId
    },
		{ $push: { users: userId } },
		{ new: true }
	)
		.populate('users', '-password')
		.populate('groupAdmin', '-password')

  if (!updatedChat) {
    res.status(400)
    throw new Error('Chat not found')
  }

  res.status(200).json(updatedChat)
})
const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body

  if (!chatId || !userId) {
    res.status(400)
    throw new Error('Please fill all the fields')
  }

	// if (!chat.groupAdmin.equals(req.user._id)) {
	//   res.status(400)
	//   throw new Error('You are not admin of this group')
	// }
  const updatedChat = await Chat.findOneAndUpdate(
    {
      _id: chatId
    },
		{ $pull: { users: userId } },
		{ new: true }
	)
		.populate('users', '-password')
		.populate('groupAdmin', '-password')

  if (!updatedChat) {
    res.status(400)
    throw new Error('Chat not found')
  }

  res.status(200).json(updatedChat)
})

module.exports = {
  accessChat,
  fetchChat,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup
}
