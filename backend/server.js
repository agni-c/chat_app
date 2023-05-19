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
const { notFound, errorHandler } = require('./middleware/errorMiddleWare.js')
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
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})
