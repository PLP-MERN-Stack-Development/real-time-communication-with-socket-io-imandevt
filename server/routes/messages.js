const express = require('express');
const router = express.Router();
const Message = require('../models/message');
const multer = require('multer');
const path = require('path');


// store uploads in /uploads
const storage = multer.diskStorage({
destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });


// get messages with pagination for a room or private conversation
router.get('/', async (req, res) => {
// query: ?room=roomName&limit=25&skip=0 or ?userA=...&userB=... for private
try {
const { room, limit = 25, skip = 0, userA, userB } = req.query;
const q = {};
if (userA && userB) {
// private between two user ids
q.$or = [
{ from: userA, to: userB },
{ from: userB, to: userA }
];
} else if (room) {
q.room = room;
}
const messages = await Message.find(q)
.sort({ createdAt: -1 })
.skip(parseInt(skip))
.limit(parseInt(limit))
.populate('from', 'username')
.populate('to', 'username');


res.json(messages.reverse()); // send oldest -> newest
} catch (err) {
console.error(err);
res.status(500).json({ error: 'server error' });
}
});


// file upload endpoint
router.post('/upload', upload.single('file'), (req, res) => {
if (!req.file) return res.status(400).json({ error: 'no file' });
const url = `/uploads/${req.file.filename}`;
res.json({ url });
});


module.exports = router;