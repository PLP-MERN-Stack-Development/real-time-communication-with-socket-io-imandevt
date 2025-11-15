// server.js - Full-featured Socket.io chat server with rooms, private messages, file sharing, read receipts, reactions

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/chatapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log("MongoDB connection error:", err));

const messageSchema = new mongoose.Schema({
  sender: String,
  senderId: String,
  message: String,
  room: { type: String, default: "global" },
  timestamp: { type: Date, default: Date.now },
  isPrivate: { type: Boolean, default: false },
  to: String,
  type: { type: String, default: "text" }, // text or image
  read: { type: Boolean, default: false },
  reactions: { type: Map, of: [String], default: {} },
});

const Message = mongoose.model("Message", messageSchema);

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

const users = {};
const typingUsers = {};

// --- Socket.io ---
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // User joins
  socket.on('user_join', (username) => {
    users[socket.id] = { username, id: socket.id, currentRoom: "global" };
    socket.join("global");
    io.emit('user_list', Object.values(users));
    io.emit('user_joined', { username, id: socket.id });
  });

  // Switch rooms
  socket.on('switch_room', async (room) => {
    const user = users[socket.id];
    if (!user) return;

    const oldRoom = user.currentRoom;
    socket.leave(oldRoom);
    socket.join(room);
    user.currentRoom = room;

    const roomMessages = await Message.find({ room, isPrivate: false }).sort({ timestamp: 1 });
    socket.emit('room_messages', roomMessages);
  });

  // Send chat message
  socket.on('send_message', async ({ message, room }) => {
    const user = users[socket.id];
    if (!user) return;

    const msg = {
      sender: user.username,
      senderId: socket.id,
      message,
      room: room || user.currentRoom,
      type: "text",
      timestamp: new Date(),
      isPrivate: false,
    };

    const saved = await Message.create(msg);
    io.to(saved.room).emit('receive_message', saved);
  });

  // Typing indicator
  socket.on('typing', (isTyping) => {
    const user = users[socket.id];
    if (!user) return;

    const room = user.currentRoom;
    if (isTyping) typingUsers[socket.id] = user.username;
    else delete typingUsers[socket.id];

    io.to(room).emit('typing_users', Object.values(typingUsers));
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
      type: "text",
    };

    const saved = await Message.create(msg);
    socket.to(to).emit('private_message', saved);
    socket.emit('private_message', saved);
  });

  // File/image sharing
  socket.on('send_file', async ({ fileData, fileName, room }) => {
    const user = users[socket.id];
    if (!user) return;

    const msg = {
      sender: user.username,
      senderId: socket.id,
      message: fileData,
      room: room || user.currentRoom,
      type: 'image',
      timestamp: new Date(),
      isPrivate: false,
    };

    const saved = await Message.create(msg);
    io.to(saved.room).emit('receive_message', saved);
  });

  // Read receipts
  socket.on('message_read', async (messageId) => {
    const msg = await Message.findByIdAndUpdate(messageId, { read: true }, { new: true });
    io.emit('message_read', messageId);
  });

  // Message reactions
  socket.on('react_message', async ({ messageId, reaction, username }) => {
    const msg = await Message.findById(messageId);
    if (!msg.reactions) msg.reactions = {};
    if (!msg.reactions[reaction]) msg.reactions[reaction] = [];
    if (!msg.reactions[reaction].includes(username)) msg.reactions[reaction].push(username);

    await msg.save();
    io.emit('message_reaction', { messageId, reactions: msg.reactions });
  });

  // Disconnect
  socket.on('disconnect', () => {
    const user = users[socket.id];
    if (user) {
      io.emit('user_left', { username: user.username, id: socket.id });
    }
    delete users[socket.id];
    delete typingUsers[socket.id];
    io.emit('user_list', Object.values(users));
    io.emit('typing_users', Object.values(typingUsers));
  });
});

// --- API ---
app.get('/api/messages', async (req, res) => {
  try {
    const room = req.query.room || "global";
    const messages = await Message.find({ room, isPrivate: false }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.get('/api/users', (req, res) => res.json(Object.values(users)));

app.get('/', (req, res) => res.send('Socket.io Chat Server is running'));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = { app, server, io };
