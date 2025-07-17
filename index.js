const http = require('http');
const { Server } = require('socket.io');

// קובע פורט דינמי (ל־Render) או 4000 מקומית
const PORT = process.env.PORT || 4000;

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*", // אפשר להקשיח בהמשך ל־https://emoji-battle.vercel.app
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

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Socket server running on http://0.0.0.0:${PORT}`);
});
