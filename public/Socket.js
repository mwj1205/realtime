import { CLIENT_VERSION } from './Constants.js';

const storageUserId = localStorage.getItem('userId');
let socket = null;
let userId = storageUserId;
let highScore = 0;
let serverHighScore = 0;

socket = io('52.79.166.57:3000', {
  query: {
    clientVersion: CLIENT_VERSION,
    userUUID: storageUserId || null,
  },
});

socket.on('response', (data) => {
  console.log(data);
  if (data.highScore) {
    highScore = data.highScore;
  }
});

socket.on('broadcast', (data) => {
  console.log(data);
  if (data.serverHighScore) {
    serverHighScore = data.serverHighScore;
  }
});

socket.on('connection', (data) => {
  console.log('connection: ', data);
  userId = data.uuid;
  localStorage.setItem('userId', userId);
  if (data.highScore) {
    highScore = data.highScore;
  }
  if (data.serverHighScore) {
    serverHighScore = data.serverHighScore;
  }
});

const sendEvent = (handlerId, payload) => {
  socket.emit('event', {
    userId,
    clientVersion: CLIENT_VERSION,
    handlerId,
    payload,
  });
};

const getHighScore = () => {
  return highScore;
};

const getServerHighScore = () => {
  return serverHighScore;
};

export { sendEvent, getHighScore, getServerHighScore };
