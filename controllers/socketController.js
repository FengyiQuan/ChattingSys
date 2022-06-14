const {
  rooms,
  ifRoomNameExist,
  createNewRoom,
  getUserRooms,
  getSameUserSocketIds,
} = require('../controllers/roomController');
// requrie mongoose.Schema.Types.ObjectId
const ObjectId = require('mongoose').Types.ObjectId;
const axios = require('axios');
const deployUrl = require('../config/settings').deployURL;

//require RoomMessage
const GroupMessage = require('../models/GroupMessage');
// const { server, io } = require('./config/socket-init')();

// console.log(test);

const handleNewJoinRoom = (socket) => {
  socket.on('newJoinRoom', (roomId) => {
    // console.log('new join room');
    // console.log(socket);
    const session = socket.request.session;
    const user = session.passport.user;
    const username = user.username;
    const userId = user.id;
    const socketId = session.socketId;
    console.log('socketId is:' + socketId + 'join');
    socket.join(roomId);
    rooms[roomId].users[socket.id] = userId; // TODO: socket.id as key and username as value (should be user Id)
    // console.log(rooms[roomId]);
    // console.log(getSameUserSocketIds(roomId, userId));
    const newMessage = new GroupMessage({
      roomId,
      senderId: ObjectId('000000000000000000000000'),
      senderName: 'Robot',
      content: `${username} has joined the room. `,
      createBy: new Date(),
    });
    console.log(newMessage);
    socket
      .to(roomId)
      // .except(getSameUserSocketIds(roomId, socketId, userId))
      .emit('newJoinRoom', newMessage);
  });
};
const handleNewMessage = (socket) => {
  socket.on('newMessage', (roomId, message) => {
    // console.log(message);
    const session = socket.request.session;
    const user = session.passport.user;
    const username = user.username;
    const userId = user.id;
    const newMessage = new GroupMessage({
      roomId,
      senderId: userId,
      senderName: username,
      content: message,
      createBy: new Date(),
    });
    console.log(newMessage);
    // console.log('new message: ' + roomId, content, timestamp, sendId);
    // console.log(`${deployUrl}/api/room/addMessage`);
    axios
      .post(`${deployUrl}/api/room/addMessage`, newMessage)
      .then((response) => {
        socket.to(roomId).emit('newMessage', newMessage);
        const data = response.data;
        console.log(data);
      })
      .catch((err) => {
        console.log(err.message);
      });

    // console.log(data);
  });
};
const handlePrivateMessage = (socket) => {
  // private message socket IO unused
  socket.on('privateMessage', (anotherSocketId, msg) => {
    socket.to(anotherSocketId).emit('privateMessage', socket.id, msg);
  });
};

const handleDisconnect = (socket) => {
  socket.on('disconnect', () => {
    console.log('disconnect' + socket.id);
    // console.log('get user rooms: ' + getUserRooms(socket));

    // const rooms_temp = io.of('/').adapter.sids.get(socket.id);
    // console.log(io.of('/').adapter.sids);
    // console.log('rooms to: ' + rooms_temp);
    // console.log(`socket.room:[` + Array.from(socket.rooms) + ']');
    const session = socket.request.session;
    const user = session.passport.user;
    const username = user.username;
    const userId = user.id;
    getUserRooms(socket).forEach((room) => {
      const newMessage = new GroupMessage({
        roomId: getUserRooms(socket),
        senderId: ObjectId('000000000000000000000000'), //userId,
        senderName: 'Robot',
        content: `${username}, socketId: ${
          rooms[room].users[socket.id]
        } has left the room`,
        createBy: new Date(),
      });
      socket.to(room).emit('userDisconnected', newMessage);
      delete rooms[room].users[socket.id];
    });
  });
};
module.exports = {
  handleNewJoinRoom,
  handleNewMessage,
  handlePrivateMessage,
  handleDisconnect,
};
