const { Socket } = require('socket.io');
const app = require('express')();
const express = require('express');
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: 'http://localhost:5173' } });
const uuid = require('uuid');
const fs = require('fs');
const axios = require('axios');

app.use(express.json());

const PORT = 3001;

let messageList = [];
const caminhoArquivo = 'C:/Users/Luiz/Desktop/estudos/TurboZap/TurboZap/server/deleted_messages.txt';

app.post('/escrever-arquivo', (req, res) => {
    const { conteudo } = req.body;

    fs.writeFile(caminhoArquivo, conteudo, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erro ao escrever no arquivo.');
        }

        res.status(200).send('Conteúdo escrito no arquivo com sucesso.');
    });
});

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

    socket.on('deleteMessage', async (messageId) => {
        const deletedMessage = messageList.find((message) => message.id === messageId);

        if (deletedMessage) {
            messageList = messageList.filter((message) => message.id !== messageId);
            io.emit('messageDeleted', messageId);

            // Adiciona a mensagem deletada à lista para escrever no arquivo
            messageList.push(deletedMessage);

            // Imprime todas as informações da mensagem
            console.log('Mensagem deletada:', deletedMessage);

            try {
                // Escreve todas as mensagens deletadas no arquivo
                const conteudo = messageList
                    .map(
                        (message) =>
                            `ID da Mensagem: ${message.id}, ID do Usuário: ${message.authorId}, Conteúdo: ${message.text}`
                    )
                    .join('\n');
                await axios.post('http://localhost:3001/escrever-arquivo', {
                    conteudo: conteudo,
                });

                console.log('Conteúdo escrito no arquivo com sucesso.');
            } catch (erro) {
                console.error('Erro ao realizar a solicitação:', erro.message);
            }
        }
    });
});

server.listen(PORT, () => console.log('Server running...'));
