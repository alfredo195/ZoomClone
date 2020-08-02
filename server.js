const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')
const PORT = process.env.PORT || 3003;

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('zoom-clon3-app.herokuapp.com', (req, res) => {
  res.redirect(`zoom-clon3-app.herokuapp.com${uuidV4()}`)
})

app.get('zoom-clon3-app.herokuapp.com:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId)

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
})

server.listen(PORT)