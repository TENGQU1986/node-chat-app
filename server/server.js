const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const Filter = require('bad-words');

const publicDirectoryPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicDirectoryPath));

const welcomeMessage = 'Welcome to the chat app';

io.on('connection', (socket) => {
  console.log('New webSocket connection');

  socket.emit('welcome', welcomeMessage);
  socket.broadcast.emit('message', 'A new has joined!')

  socket.on('showMessage', () => {
    io.emit('welcome', welcomeMessage);
  });

  socket.on('sendMessage', (message, callback) => {
    const filter = new Filter();

    if(filter.isProfane(message)) {
      return callback('Profanity is not allowed!');
    }
      
    io.emit('message', message);
    callback('Delivered!');
  });

  socket.on('sendLocation', (locationInfo, callback) => {
    const locationToString = `https://www.google.com/maps?q=${locationInfo.lat},${locationInfo.long}`
    io.emit('location', locationToString);
    callback();
  })
  

  socket.on('disconnect', () => {
    io.emit('message', 'A new has left!');
  })
});


server.listen(port, () => {
  console.log(`server is up on port ${port}!`);
});
