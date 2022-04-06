const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));

let innskráðir = 0;

let link2 = '/index.html';

app.get('/', (req, res) => {
    res.sendFile(__dirname + link2);
});


io.on('connection', (socket) => {
    innskráðir++;
    io.emit('innskráðir breyttust', innskráðir);
    console.log('a user connected');
    socket.on('disconnect', () => {
        innskráðir--;
        io.emit('innskráðir breyttust', innskráðir);
        console.log('user disconnected');
    });

    socket.on('choose_nick', (username) => {
        console.log(username);
        socket.userName = username;
    });
    socket.on('chat message', (msg) => {        
        console.log('message: ' + msg);
        io.emit('chat message', msg, socket.userName);
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});

