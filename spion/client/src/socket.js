import { io } from 'socket.io-client';
const URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';
const socket = io(URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 500,
  reconnectionDelayMax: 3000,
  transports: ['websocket', 'polling']
});
export default socket;
