const express = require('express');
const axios = require('axios');
const deployUrl = require('../config/settings').deployURL;
const router = express.Router();
const { requireAuthentication } = require('../middleware/authCheck');
const { server, io } = require('../config/socket-init')();
const {
  rooms,
  ifRoomNameExist,
  createNewRoom,
  getUserRooms,
  getSameUserSocketIds,
} = require('../controllers/roomController');

// const msgs = [
//   { content: 'asb', createBy: 'today', senderId: 0 },
//   { content: 'qqq', createBy: 'tmr', senderId: 1 },
//   { content: 'bbb', createBy: 'yest', senderId: 2  },
// ];

// start with /chatRoom

router.get('/', requireAuthentication, (req, res) => {
  res.render('chatRoomList', { rooms: rooms });
});

router.get('/:roomId', requireAuthentication, function (req, res) {
  const roomId = req.params.roomId;
  if (rooms[roomId] == null) {
    req.flash('error_msg', 'Room not found');
    res.redirect('/');
  } else {
    axios
      .get(`${deployUrl}/api/room/getAllMessagesByRoomId/${roomId}`)
      .then((response) => {
        const messageHistory = response.data;
        console.log(messageHistory);
        res.render('chatRoom', {
          roomId,
          roomName: rooms[roomId].roomName,
          messages: messageHistory,
        });
      })
      .catch((err) => {
        console.log(err.message);
      });
  }
});
router.post('/createRoom', requireAuthentication, (req, res) => {
  const roomName = req.body.roomName;
  if (ifRoomNameExist(roomName)) {
    req.flash('error_msg', 'Room name already exist');
    return res.redirect('/chatRoom');
  } else {
    const roomId = createNewRoom(roomName);
    res.redirect(`/chatRoom/${roomId}`);
    // Send message that new room was created
    io.emit('roomCreated', roomName, roomId);
    // console.log('room created by server');
  }
});

module.exports = router;
