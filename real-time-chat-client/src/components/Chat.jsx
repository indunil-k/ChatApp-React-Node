import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001'); // Connect to the server

const Chat = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [toUser, setToUser] = useState('');

  useEffect(() => {
    // Ask for the username once the client connects
    if (username) {
      socket.emit('set_username', username);
    }

    // Listen for messages from the server
    socket.on('message', (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { from: data.from, message: data.message },
      ]);
    });

    return () => {
      socket.off('message');
    };
  }, [username]);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('send_message', { to: toUser, message }); // Send message to a specific user
      setMessage('');
    }
  };

  return (
    <div>
      <h2>Chat Room</h2>

      {/* Input for username */}
      {!username && (
        <div>
          <input
            type="text"
            placeholder="Enter your username"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
        </div>
      )}

      {/* Input for recipient username */}
      {username && (
        <div>
          <input
            type="text"
            placeholder="Send message to..."
            onChange={(e) => setToUser(e.target.value)}
            value={toUser}
          />
        </div>
      )}

      {/* Display messages */}
      <div
        style={{
          height: '300px',
          overflowY: 'scroll',
          border: '1px solid #ccc',
          padding: '10px',
        }}
      >
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.from}</strong>: {msg.message}
          </div>
        ))}
      </div>

      {/* Message input */}
      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message"
          style={{ width: '70%', marginRight: '10px' }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
