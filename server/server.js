const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const Filter = require('bad-words');
const { generateMessage, generateLocationMessage } = require('./utils/messages');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

const publicDirectoryPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicDirectoryPath));



io.on('connection', (socket) => {
  console.log('New webSocket connection');

  socket.on('join', ({ username, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, username, room})

    if(error) {
      return callback(error)
    }


    socket.join(user.room)
  
    socket.emit('welcome', generateMessage('Admin', 'Welcome!'));
    socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`));

    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room)
    })

    callback()
  
    //socket.emit, io.emit, socket.broadcast.emit
    //io.to.emit, socket.broadcast.to.emit
  })

  socket.on('showMessage', () => {
    io.emit('welcome', welcomeMessage);
  });

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id)
    const filter = new Filter();

    if(filter.isProfane(message)) {
      return callback('Profanity is not allowed!');
    }
      
    io.to(user.room).emit('message', generateMessage(user.username, message));
    callback('Delivered!');
  });

  socket.on('sendLocation', (locationInfo, callback) => {
    // const locationToString = `https://www.google.com/maps?q=${locationInfo.lat},${locationInfo.long}`
    const user = getUser(socket.id);
    io.to(user.room).emit('location', generateLocationMessage(user.username, `https://www.google.com/maps?q=${locationInfo.lat},${locationInfo.long}`));
    callback();
  })
  

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if(user) {
      io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`))
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room)
      })
    }
  })
});


server.listen(port, () => {
  console.log(`server is up on port ${port}!`);
});
