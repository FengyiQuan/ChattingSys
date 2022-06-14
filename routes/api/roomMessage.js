const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const RoomMessage = require('../../models/GroupMessage');

router.get('/api/room/getAllMessagesByRoomId/:roomId', async (req, res) => {
  const roomId = req.params.roomId;
  // console.log('test');
  try {
    const messages = await mongoose.model('GroupMessage').find({ roomId });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// save message to db
router.post('/api/room/addMessage', (req, res) => {
  // const { content, createBy, senderId, senderName, roomId } = req.body;
  const newMessage = new RoomMessage({...req.body});
  newMessage
    .save()
    .then((msg) => {
      res.status(201).json(msg);
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
});

module.exports = router;
