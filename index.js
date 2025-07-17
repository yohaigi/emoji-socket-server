const http = require('http');
const express = require('express');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 4000;

// 🔁 מסלול health check – נדרש ל-Render
app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

// 🟢 הגדרת Socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);

  socket.on('join-room', (roomId, username) => {
    socket.join(roomId);
    console.log(`👤 ${username} הצטרף לחדר ${roomId}`);
    socket.to(roomId).emit('player-joined', username);
  });

  socket.on('attack', ({ roomId, emoji }) => {
    socket.to(roomId).emit('receive-attack', emoji);
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

// 🚀 הפעלת השרת
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on http://0.0.0.0:${PORT}`);
});
