require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const userRoutes = require('./routes/user')
const adminRoutes = require('./routes/admin')
const messageRoutes = require('./routes/messages')
const { Server } = require('socket.io')

const app = express()
app.use(express.static('public'))
app.use(express.json())

app.use('/api/user', userRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/message', messageRoutes)

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'))
})

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('DB Connetion Successfull')
  })
  .catch((err) => console.log(err))

const port = process.env.PORT || 4000
const server = app.listen(port, () => console.log(`Server started on ${port}`))
const io = new Server(server, {
  cors: {
    origin: '*',
    credentials: true,
  },
})

global.onlineUsers = new Map()
io.on('connection', (socket) => {
  global.chatSocket = socket
  socket.on('add-user', (userId) => {
    onlineUsers.set(userId, socket.id)
  })

  socket.on('send-msg', (data) => {
    const sendUserSocket = onlineUsers.get(data.to)
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit('receive-msg', data.message)
    }
  })
})
