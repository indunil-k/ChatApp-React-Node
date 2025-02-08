const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');  // Import CORS

// Set up the server
const app = express();
const server = http.createServer(app);

// Set up CORS configuration
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5174", // Replace with your client URL
    methods: ["GET", "POST"],
  }
});

const users = {}; // Store usernames and their corresponding socket IDs

app.use(cors()); // Enable CORS for Express if necessary

app.get('/', (req, res) => {
  res.send('Server is running');
});

// Listen for client connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Ask the user to set a username
  socket.on('set_username', (username) => {
    users[username] = socket.id; // Store the username and socket ID
    console.log(`Username set: ${username}`);
  });

  // Handle incoming messages
  socket.on('send_message', (data) => {
    const { to, message } = data;
    const recipientSocketId = users[to]; // Get recipient's socket ID using the username

    if (recipientSocketId) {
      io.to(recipientSocketId).emit('message', { from: socket.id, message });
      console.log(`Message sent to ${to}: ${message}`);
    } else {
      console.log(`User ${to} not found`);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // Remove the user from the users object when they disconnect
    for (const [username, socketId] of Object.entries(users)) {
      if (socketId === socket.id) {
        delete users[username];
        break;
      }
    }
  });
});

// Start the server
server.listen(3001, () => {
  console.log('Server is running on http://localhost:3001');
});
