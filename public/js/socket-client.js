// const moment = require('moment');
const socket = io();
const messageContainer = document.getElementById('chat-messages-container');
const roomContainer = document.getElementById('room-container');
const roomList = document.getElementById('roomList');
const messageInput = document.getElementById('message-input');
// console.log(username);

const sendMsg = () => {
  console.log(messageInput.value);
  const messageContent = messageInput.value.trim();
  renderNewMsg(formatMessage(`You: ${messageContent}`));
  socket.emit('newMessage', roomId, messageContent);
  messageInput.value = '';
};
const scrollToBottom = (id) => {
  const element = document.getElementById(id);
  element.scrollTop = element.scrollHeight;
};

const renderNewMsg = (newMsg) => {
  const newMsgCard = document.createElement('div');
  const isSelf = newMsg.senderId === userId;
  newMsgCard.classList.add('d-flex', 'align-items-baseline', 'mb-5');


  const avatar = `<div class="position-relative avatar">
                    <img
                      src=""
                      class="img-fluid rounded-circle"
                      alt=""
                    />
                    <span
                      class="position-absolute bottom-0 start-100 translate-middle p-1 bg-success border border-light rounded-circle"
                    >
                      <span class="visually-hidden">New alerts</span>
                    </span>
                  </div>`;
  const msg = `<div class="pe-2">
                  <div>
                    <div class="card card-text d-inline-block p-2 px-3 m-1">
                    ${newMsg.content}
                    </div>
                  </div>
                  <div>
                    <div class="small"> ${newMsg.createBy}</div>
                  </div>
                  </div>`;
  // ${newmMsg.senderId}
  console.log(newMsg);
  switch (newMsg.senderId) {
    case '000000000000000000000000': //TODO: robot
      renderRobotMsg(newMsg.content);
      break;
    case userId: // sender self
      newMsgCard.classList.add('text-end', 'justify-content-end');
      newMsgCard.innerHTML = ` ${msg} ${avatar}`;
      break;
    default: // sender other
      newMsgCard.innerHTML = ` ${avatar} ${msg}`;
      break;
  }

  messageContainer.appendChild(newMsgCard);
  scrollToBottom('chat-messages-container');
};
const renderRobotMsg = (msg) => {
  const newMsgCard = document.createElement('div');
  newMsgCard.classList.add(
    'd-flex',
    'align-items-baseline',
    'mb-5',
    'justify-content-center'
  );
  newMsgCard.innerHTML = `<div class="pe-2">
                          <div>
                            <div class="card card-text d-inline-block p-2 px-3 m-1 small">
                            ${msg}
                            </div>
                          </div>
                          </div>`;
  messageContainer.appendChild(newMsgCard);
  scrollToBottom('chat-messages-container');
};

function formatMessage(content) {
  const msg = {
    senderId: userId,
    username: username,
    content: content,
    createBy: new Date().toLocaleTimeString(), //moment().format('h:mm a'),
  };
  // console.log(msg);
  return msg;
}

if (messageContainer != null) {
  //   const username = prompt('What is your name?');
  // renderNewMsg(formatMessage('You joined'));
  renderRobotMsg('Welcome to chat room');
  console.log('socket client join ' + roomId);
  socket.emit('newJoinRoom', roomId);
}

socket.on('newJoinRoom', (msg) => {
  // console.log('new join room', username, userId);
  renderNewMsg(msg);
});
socket.on('newMessage', (msg) => {
  console.log(msg);
  renderNewMsg(msg);
});
socket.on('userDisconnected', (msg) => {
  renderNewMsg(msg);
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
  // alert('connect error');
  console.log(err.message); // prints the message associated with the error
});
