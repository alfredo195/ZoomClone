const express = require('express')
const app = express() 
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    //get response and take user to room
    res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
    //get room ID from the url
    res.render('room', { roomId: req.params.room})
})

io.on('connection', socket => {
    socket.on ('join-room', (roomId, userId) => {
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected', userId)
    })
})

server.listen(3003)