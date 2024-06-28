const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });

  socket.on('join', (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
    socket.to(roomId).emit('userJoined', roomId);
  });

  socket.on('leave', (roomId) => {
    socket.leave(roomId);
    io.to(roomId).emit('userLeft');
    console.log(`User left room: ${roomId}`);
  });

  socket.on('offer', (data) => {
    io.to(data.roomId).emit('offer', data.sdp);
  });

  socket.on('answer', (data) => {
    io.to(data.roomId).emit('answer', data.sdp);
  });

  socket.on('candidate', (data) => {
    io.to(data.roomId).emit('candidate', data.candidate);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
