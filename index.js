const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*", // לאפשר גישה מה-Client (Next.js)
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

server.listen(4000, () => {
  console.log('🚀 Socket server running on http://localhost:4000');
});
