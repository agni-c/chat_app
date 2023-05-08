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
app.use('/api/users', userRoutes)
app.use('/api/chat', chatRoutes)

// middleWare
const { notFound, errorHandler } = require('./middleware/errorMiddleWare.js')
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () =>
	console.log(`Server running on port http://localhost:${PORT}`.cyan)
)
