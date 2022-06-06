const rooms = {
  r1: { users: [], roomName: '12345' },
  r2: { users: [], roomName: '222222222' },
};

let roomIdTracker = 3;
function getRoomIdInc() {
  let roomIdFinal = 'r' + roomIdTracker;
  roomIdTracker += 1;
  return roomIdFinal;
}
function ifRoomNameExist(roomName) {
  return Object.values(rooms).some((room) => room.roomName === roomName);
}
function createNewRoom(roomName) {
  const roomId = getRoomIdInc();
  rooms[roomId] = { users: {}, roomName: roomName };
  return roomId;
}
function getUserRooms(socket) {
  return Object.entries(rooms).reduce((roomIds, [roomId, room]) => {
    if (room.users[socket.id] != null) roomIds.push(roomId);
    return roomIds;
  }, []);
}
// filter from rooms array check if the userIdInput == userId, return arrayn of socketIds
function getSameUserSocketIds(roomId, userIdInput) {
  return Object.entries(rooms[roomId].users).reduce(
    (socketIds, [socketId, userId]) => {
      if (userIdInput == userId) socketIds.push(socketId);

      return socketIds;
    },
    []
  );
}

module.exports = {
  rooms,
  ifRoomNameExist,
  createNewRoom,
  getUserRooms,
  getSameUserSocketIds,
};
