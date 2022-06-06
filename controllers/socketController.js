const newJoinRoom = (socket) => {
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
};

module.exports = socketController;
