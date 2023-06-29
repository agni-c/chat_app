const express = require('express')
const app = express()

// env
require('dotenv').config()

// parse json
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// security middleware
require('colors')
const cors = require('cors')
const morgan = require('morgan')
const helmet = require('helmet')

app.use(cors())
app.use(helmet())
app.use(cors())
app.use(morgan('tiny'))

// db connect initialize
const connectDB = require('./config/db.js')
connectDB()

// test route
app.get('/', (req, res) => {
  res.send('API is running...')
})

// routes
const userRoutes = require('./routes/userRoutes.js')
const chatRoutes = require('./routes/chatRoutes.js')
const messageRoutes = require('./routes/messageRoutes.js')
app.use('/api/users', userRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/message', messageRoutes)

// middleWare
const {
	notFound,
	errorHandler
} = require('./middleware/errorMiddleWare.js')
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT

const server = app.listen(PORT, () =>
	console.log(`Server running on port http://localhost:${PORT}`.cyan)
)

const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000'
  },
  pingTimeout: 60000
})

io.on('connection', socket => {
  console.log('a user connected')

	// on: disconnect
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })

	// on: initial setup
  socket.on('setup', userData => {
    socket.join(userData._id) // personal room
    console.log('user joined room', { userData })
    socket.emit('connected') // connected signal
  })

	// on: join chat
  socket.on('join chat', room => {
    socket.join(room) // room is chatId
    console.log('joined room ', room)
  })

	// on: new message
  socket.on('new message', newMessageRecieved => {
    var chat = newMessageRecieved.chat
    if (!chat.users) return console.log('chat.users not defined')
		// console.log({ userInfo: chat.users })
    chat.users.forEach(userId => {
      if (userId === newMessageRecieved.sender._id) return
      console.log({ userId, chat })

			// in: sends message to a room
      socket
				.in(chat._id)
				.emit('message received', newMessageRecieved) // sending message to our personal room
			// socket.in(userId).emit('message received', newMessageRecieved) // sending message to our personal room
			// console.log({
			//   user: userId,
			//   sender: newMessageRecieved.sender._id,
			//   newMessageRecieved
			// })
    })
  })

  socket.on('typing', room => {
    console.log(`typing in room ${room}`)
    socket.in(room).emit('typing')
  })
  socket.on('stop typing', room => {
    console.log('stop typing')
    socket.in(room).emit('stop typing')
  })
})
