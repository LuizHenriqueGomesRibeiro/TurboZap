const { Socket } = require('socket.io');
const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: 'http://localhost:5173' } });
const uuid = require('uuid');

const PORT = 3001;

let messageList = [];

io.on('connection', socket => {
    console.log('Usuário conectado!', socket.id);

    socket.on('disconnect', reason => {
        console.log('Usuário desconectado!', socket.id);
    });

    socket.on('set_username', username => {
        socket.data = { username, admin: false };
    });

    socket.on('set_admin', isAdmin => {
        socket.data.admin = isAdmin;
        io.emit('adminUpdated', { userId: socket.id, admin: isAdmin });
    });

    socket.on('message', text => {
        const timestamp = new Date().getTime();
        const newMessage = {
            id: generateId(),
            text,
            authorId: socket.id,
            author: socket.data.username,
            timestamp: timestamp,
            admin: socket.data.admin,
        };

        messageList.push(newMessage);
        io.emit('receive_message', newMessage);
    });

    function generateId() {
        return uuid.v4();
    }

    socket.on('deleteMessage', messageId => {
        const deletedMessage = messageList.find(message => message.id === messageId);

        if (deletedMessage) {
            messageList = messageList.filter(message => message.id !== messageId);
            io.emit('messageDeleted', messageId);
        }
    });
});

server.listen(PORT, () => console.log('Server running...'));
