const { log } = require('console')
const { Socket } = require('socket.io')

const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server, {cors: {origin: 'http://localhost:5173'}})
const uuid = require('uuid');

const PORT = 3001

io.on('connection', socket => {
    console.log('Usuário conectado!', socket.id);

    socket.on('disconnect', reason => {
        console.log('Usuário desconectado!', socket.id)
    })
    
    socket.on('set_username', username => {
        socket.data.username = username
    })

    socket.on('set_admin', admin => {
        socket.data.admin = admin
    })

    socket.on('message', text => {
        io.emit('receive_message', {
            id: generateId(),
            text, 
            authorId: socket.id,
            author: socket.data.username,
            admin: socket.data.admin
        })
    })

    function generateId() {
        return uuid.v4();
    }
})

server.listen(PORT, () => console.log('Server running...'))