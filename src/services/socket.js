import { io } from 'socket.io-client';
import { SOCKET_URL } from '../utils/constants.js';

let socket = null;

export const connectSocket = (token) => {
  if (socket) socket.disconnect();
  socket = io(SOCKET_URL, {
    auth: { token },
    withCredentials: true,
    autoConnect: true
  });
  return socket;
};

export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
};

export const getSocket = () => socket;
