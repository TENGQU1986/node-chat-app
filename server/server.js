const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicDirectoryPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicDirectoryPath));

const welcomeMessage = 'Welcome to the chat app';

io.on('connection', (socket) => {
  console.log('New webSocket connection');

  socket.on('sendMessage', (message) => {
    console.log(message);
    io.emit('message', message);
  });

});

server.listen(port, () => {
  console.log(`server is up on port ${port}!`);
});
