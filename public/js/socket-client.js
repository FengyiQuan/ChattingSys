// const moment = require('moment');
const socket = io();
const messageContainer = document.getElementById('message-container');
const roomContainer = document.getElementById('room-container');
const roomList = document.getElementById('roomList');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');

// const sendMsg = () => {
//   console.log(messageInput.value);
//   socket.emit(
//     'newMessage',
//     roomId,
//     formatMessage(0, messageInput.value.trim())
//   );
// };

const renderNewMsg = (newmMsg) => {
  const messages = document.getElementById('chat-messages');
  const newMsgCard = document.createElement('div');
  newMsgCard.classList.add('container');
  newMsgCard.innerHTML = `<div class="msg-head">
                            <span> ${newmMsg.senderId} </span>
                            <span> ${newmMsg.timestamp} </span>
                          </div>
                          <div class="msg-body">
                              ${newmMsg.content}
                          </div>`;
  messages.appendChild(newMsgCard);
};

function formatMessage(content) {
  const msg = {
    senderId: userId,
    username: username,
    content: content,
    createBy: new Date().toLocaleTimeString(), //moment().format('h:mm a'),
  };
  console.log(msg);
  return msg;
}

if (messageForm != null) {
  //   const username = prompt('What is your name?');
  renderNewMsg(formatMessage('You joined'));
  console.log('socket client join ' + roomId);
  socket.emit('newJoinRoom', roomId);

  messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    renderNewMsg(formatMessage(`You: ${message}`));
    socket.emit('newMessage', roomId, formatMessage(messageInput.value.trim()));
    messageInput.value = '';
  });
}

socket.on('newJoinRoom', ({ username, userId }) => {
  //   console.log('new join room', username, userId);
  renderNewMsg(formatMessage(`${username} connected`));
});
socket.on('newMessage', (msg) => {
  renderNewMsg(msg);
});
socket.on('userDisconnected', (name) => {
  renderNewMsg(formatMessage(`${name} disconnected`));
});

socket.on('roomCreated', (roomName, roomId) => {
  // console.log('room create by client', roomName, roomId);

  const roomElement = document.createElement('a');
  roomElement.classList.add(
    'list-group-item',
    'd-flex',
    'justify-content-between',
    'align-items-start',
    'list-group-item-action'
  );
  roomElement.href = `/chatRoom/${roomId}`;
  roomElement.innerHTML = `<div class="ms-2 me-auto">
                            <div class="fw-bold">Subheading roomId: ${roomId} </div>
                            ${roomName}
                            </div>
                           <span class="badge bg-primary rounded-pill">14</span>`;
  roomList.appendChild(roomElement);
});
socket.on('connect_error', (err) => {
  console.log(err.message); // prints the message associated with the error
});
