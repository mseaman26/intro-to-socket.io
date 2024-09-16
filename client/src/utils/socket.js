import { io } from 'socket.io-client';

// Function to initialize the socket connection
export const initSocket = (token) => {
  const socket = io('http://localhost:3001', {
    auth: {
      token, // Pass the token in the authentication handshake
    },
  });

  // Handle connection errors
  socket.on('connect_error', (err) => {
    console.error('Socket connection error:', err.message);
  });

  return socket;
};
