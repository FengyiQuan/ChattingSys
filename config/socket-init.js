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
// const RoomMessage = require('../models/GroupMessage');
const socketController = require('../controllers/socketController');

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
    console.log('new connection: ' + socket.id);
    const session = socket.request.session;
    // console.log(`saving sid ${socket.id} in session ${session.id}`);
    session.socketId = socket.id;
    session.save();
    // console.log(session);

    socketController.handleNewJoinRoom(socket);
    socketController.handleNewMessage(socket);
    socketController.handlePrivateMessage(socket);
    socketController.handleDisconnect(socket);
  });
  return { server, io };
};

// function getIoInstance(app) {
//   if (!server || !io) {
//     console.log('init');

//     return initSocketIO(app);
//   } else {
//     console.log('no init');
//     return { server, io };
//   }
// }

module.exports = (app) => {
  if (!server || !io) {
    console.log('init');

    return initSocketIO(app);
  } else {
    console.log('no init');
    return { server, io };
  }
};
