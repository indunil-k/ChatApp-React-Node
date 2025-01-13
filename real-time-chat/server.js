const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

// Set up the server
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Replace with your client URL
    methods: ['GET', 'POST'],
  },
});

app.get('/', (req, res) => {
  res.send('Server is running');
});

// Listen for client connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  

  // Handle incoming messages
  socket.on('message', (msg) => {
    console.log(`Message from ${socket.id}: ${msg}`);
    // Broadcast the message to all clients
    io.emit('message', msg);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start the server
server.listen(3001, () => {
  console.log('Server is running on http://localhost:3001');
});
