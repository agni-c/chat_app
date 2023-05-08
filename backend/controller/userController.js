const asyncHandler = require('express-async-handler')
const User = require('../models/userModel.js')
const { generateToken } = require('../config/generateToken.js')

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body

  if (!name || !email || !password) {
    res.status(400)
    throw new Error('Please fill all fields')
  }

  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }
  const user = await User.create({
    name,
    email,
    password,
    pic
  })

  if (!user) {
    res.status(400)
    throw new Error('Failed To Create New User')
  }
  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    pic: user.pic,
    token: generateToken(user._id)
  })
})

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    res.status(400)
    throw new Error('Please fill all fields')
  }

  const user = await User.findOne({ email })

  if (!user) {
    res.status(401)
    throw new Error('Invalid email or password')
  }

  const isMatch = await user.matchPassword(password)

  if (!isMatch) {
    res.status(401)
    throw new Error('Invalid email or password')
  }

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    pic: user.pic,
    token: generateToken(user._id)
  })
})

// /api/users?search=keyword&limit=10
const allUsers = asyncHandler(async (req, res) => {
  const { search, limit } = req.query // get query params

  const searchQuery = search
		? {
  $or: [
    {
      name: {
        $regex: search,
        $options: 'i'
      }
    },
    {
      email: {
        $regex: search,
        $options: 'i'
      }
    }
  ]
}
		: {}

  const users = await User.find({
    ...searchQuery,
    _id: { $ne: req.user._id }
  }).limit(Number(limit || 10))

  res.json(users)
})

module.exports = {
  registerUser,
  authUser,
  allUsers
}
