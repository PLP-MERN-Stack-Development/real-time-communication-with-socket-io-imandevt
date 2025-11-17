// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');

dotenv.config();

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/chatapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log("MongoDB connection error:", err));

// Message Schema
const messageSchema = new mongoose.Schema({
  sender: String,
  senderId: String,
  message: String,
  room: { type: String, default: "global" },
  timestamp: { type: Date, default: Date.now },
  isPrivate: { type: Boolean, default: false },
  to: String,
  reactions: { type: Map, of: [String] }, // { emoji: [username, ...] }
  readBy: { type: [String], default: [] }, // usernames who read
  type: { type: String, default: "text" }, // text or image
});

const Message = mongoose.model("Message", messageSchema);

// Express + Socket.io
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Connected users tracking
const users = {};       // { socketId: { username, currentRoom, socketId } }
const typingUsers = {}; // { socketId: username }
const usernames = {};   // { username: socketId } - for private messages

// Helper to get all online usernames
const getOnlineUsers = () => Object.values(users).map(u => u.username);

// SOCKET.IO
io.on('connection', (socket) => {
  console.log(`[SOCKET] User connected: ${socket.id}`);

  // Join chat
  socket.on('user_join', (username) => {
    if (!username || username.trim() === '') {
      console.warn('[SOCKET] Invalid username on join');
      return;
    }
    
    users[socket.id] = { username, currentRoom: "global", socketId: socket.id };
    usernames[username] = socket.id;
    socket.join("global");

    console.log(`[SOCKET] ${username} joined global room. Total users: ${Object.keys(users).length}`);
    
    // Notify everyone
    const onlineUsers = getOnlineUsers();
    io.emit('user_list', onlineUsers);
    io.emit('user_joined', { username });
  });

  // Switch room
  socket.on('switch_room', async (room) => {
    if (!users[socket.id]) return;
    const oldRoom = users[socket.id].currentRoom;
    socket.leave(oldRoom);
    socket.join(room);
    users[socket.id].currentRoom = room;

    // Send room messages
    const msgs = await Message.find({ room, isPrivate: false }).sort({ timestamp: 1 });
    socket.emit('room_messages', msgs);
  });

  // Send message
  socket.on('send_message', async ({ message, room, type }) => {
    const user = users[socket.id];
    if (!user) return;

    const msg = {
      sender: user.username,
      senderId: socket.id,
      message,
      room: room || user.currentRoom,
      timestamp: new Date(),
      type: type || "text",
      isPrivate: false,
    };

    try {
      const saved = await Message.create(msg);
      io.to(saved.room).emit('receive_message', saved);

      // Notifications for browser
      io.to(saved.room).emit('new_message_notification', {
        message: saved.message,
        sender: saved.sender,
        room: saved.room,
      });
    } catch (err) {
      console.log(err);
    }
  });

  // Private messages
  socket.on('private_message', async ({ to, message }) => {
    const user = users[socket.id];
    if (!user) return;
    const msg = {
      sender: user.username,
      senderId: socket.id,
      message,
      timestamp: new Date(),
      isPrivate: true,
      to,
    };
    const saved = await Message.create(msg);
    socket.to(to).emit('private_message', saved);
    socket.emit('private_message', saved);
  });

  // Typing
  socket.on('typing', (isTyping) => {
    const user = users[socket.id];
    if (!user) return;
    
    if (isTyping) {
      typingUsers[socket.id] = user.username;
    } else {
      delete typingUsers[socket.id];
    }
    
    const typingList = Object.values(typingUsers);
    io.to(user.currentRoom).emit('typing_users', typingList);
  });

  // Reactions
  socket.on('add_reaction', async ({ messageId, emoji }) => {
    const user = users[socket.id];
    if (!user) return;
    const msg = await Message.findById(messageId);
    if (!msg) return;

    if (!msg.reactions) msg.reactions = new Map();
    const usersReacted = msg.reactions.get(emoji) || [];
    if (!usersReacted.includes(user.username)) usersReacted.push(user.username);
    msg.reactions.set(emoji, usersReacted);
    await msg.save();

    io.to(user.currentRoom).emit('update_reactions', { messageId, reactions: msg.reactions });
  });

  // Disconnect
  socket.on('disconnect', () => {
    const user = users[socket.id];
    if (user) {
      console.log(`[SOCKET] ${user.username} disconnected. Total users: ${Object.keys(users).length - 1}`);
      delete usernames[user.username];
      io.emit('user_left', { username: user.username });
    }
    delete users[socket.id];
    delete typingUsers[socket.id];
    const onlineUsers = getOnlineUsers();
    io.emit('user_list', onlineUsers);
    io.emit('typing_users', Object.values(typingUsers));
  });
});

// API for messages
app.get('/api/messages', async (req, res) => {
  const room = req.query.room || "global";
  const page = parseInt(req.query.page) || 1;
  const limit = 20;
  try {
    const msgs = await Message.find({ room, isPrivate: false })
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    res.json(msgs.reverse());
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// API for users
app.get('/api/users', (req, res) => res.json(Object.values(users)));

// Root
app.get('/', (req, res) => res.send('Socket.io Chat Server Running'));

// Start
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on ${PORT}`));

module.exports = { app, server, io };
