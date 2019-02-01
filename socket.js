const app = require("./index.js");
const http = require('http');
const socketIO = require('socket.io');
const querystring = require('querystring');
var server = http.createServer(app);

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');
const User = require("./models/UserModel");
var io = socketIO(server);
var users = new Users();

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('join', (name, callback) => {
    const userName = {name: name};
    User.findOne(userName)
    .then(user => {
    const params = {
        name: user.name,
        room:user.room
      }; 
      return params
    }).then (params => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
     return callback('Name and room name are required.');
    }

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));
    callback()})  
    .catch( error => {
      console.error( error.message );
    })
  });

  socket.on('createMessage', (message, callback) => {
    var user = users.getUser(socket.id);

    if (user && isRealString(message.text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
    }

    callback();
  });

  socket.on('createLocationMessage', (coords) => {
    var user = users.getUser(socket.id);

    if (user) {
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }
  });

  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
    }
  });
});
module.exports = server;

