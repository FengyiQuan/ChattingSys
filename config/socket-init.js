const http = require('http');
const socketio = require('socket.io');
const passport = require('passport');
const expressSession = require('../config/settings').expressSession;
const {
  rooms,
  ifRoomNameExist,
  createNewRoom,
  getUserRooms,
  getSameUserSocketIds,
} = require('../controllers/roomController');
// const socketController = require('../controllers/socketController');

// rooms = {
//   roomId: {
//     users: [socket.id: userId],
//     roomName: ''
//     },
//   }

var server;
var io;

const initSocketIO = (app) => {
  server = http.createServer(app);
  io = socketio(server);

  // convert a connect middleware to a Socket.IO middleware
  const wrap = (middleware) => (socket, next) =>
    middleware(socket.request, {}, next);

  io.use(wrap(expressSession));
  io.use(wrap(passport.initialize()));
  io.use(wrap(passport.session()));
  io.use((socket, next) => {
    if (socket.request.user) {
      next();
    } else {
      next(new Error('unauthorized'));
    }
  });
  // message socket IO
  io.on('connection', (socket) => {
    console.log('new connection' + socket.id);
    const session = socket.request.session;
    // console.log(`saving sid ${socket.id} in session ${session.id}`);
    session.socketId = socket.id;
    session.save();
    // console.log(session);

    socket.on('newJoinRoom', (roomId) => {
      // console.log('new join room');
      console.log(socket);
      const session = socket.request.session;
      const user = session.passport.user;
      const username = user.username;
      const userId = user.id;
      const socketId = session.socketId;
      console.log('socketId is:' + socketId);
      // const senderId = user.id;
      // console.log(socket.request.session);
      socket.join(roomId);
      // console.log(senderId);
      rooms[roomId].users[socket.id] = userId; // TODO: socket.id as key and username as value (should be user Id)
      console.log(rooms[roomId]);
      console.log(getSameUserSocketIds(roomId, userId));
      socket
        .to(roomId)
        .except(getSameUserSocketIds(roomId, socketId, userId))
        .emit('newJoinRoom', { username, senderId: userId });
    });

    socket.on('newMessage', (roomId, message) => {
      console.log(message);
      // console.log('new message: ' + roomId, content, timestamp, sendId);
      socket.to(roomId).emit('newMessage', message);
      // console.log(data);
    });

    // private message socket IO unused
    socket.on('privateMessage', (anotherSocketId, msg) => {
      socket.to(anotherSocketId).emit('privateMessage', socket.id, msg);
    });

    socket.on('disconnect', () => {
      console.log('disconnect' + socket.id);
      console.log('get user rooms: ' + getUserRooms(socket));
      const rooms_temp = io.of('/').adapter.sids.get(socket.id);
      console.log(io.of('/').adapter.sids);
      console.log('rooms to: ' + rooms_temp);
      // console.log(`socket.room:[` + Array.from(socket.rooms) + ']');
      getUserRooms(socket).forEach((room) => {
        socket.to(room).emit('userDisconnected', rooms[room].users[socket.id]);
        delete rooms[room].users[socket.id];
      });
    });
  });
  return { server, io };
};

module.exports = (app) => {
  if (!server || !io) {
    console.log('init');
    return initSocketIO(app);
  } else {
    return { server, io };
  }
};
