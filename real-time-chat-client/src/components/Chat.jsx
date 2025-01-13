import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001'); // Connect to the server

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false); // Track connection status

  useEffect(() => {
    // Listen for messages from the server
    socket.on('message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // Listen for connection
    socket.on('connect', () => {
      setConnected(true); // Set connected to true when the client connects
    });

    socket.on('disconnect', () => {
      setConnected(false); // Set connected to false if disconnected
    });

    return () => {
      socket.off('message');
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('message', message); // Send message to the server
      setMessage('');
    }
  };

  return (
    <div>
      <h2>Chat Room</h2>
      {/* Display connection status */}
      <p>{connected ? 'Connected to server' : 'Not connected to server'}</p>
      
      <div style={{ height: '300px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px' }}>
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message"
        style={{ width: '70%', marginRight: '10px' }}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
