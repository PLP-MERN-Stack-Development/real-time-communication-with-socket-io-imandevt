const mongoose = require('mongoose');


const ReactionSchema = new mongoose.Schema({
user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
emoji: String,
}, { _id: false });


const MessageSchema = new mongoose.Schema({
from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // null = room/global
room: { type: String, default: 'global' },
text: { type: String, default: '' },
file: { type: String, default: null }, // file path or base64
readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
reactions: [ReactionSchema],
}, { timestamps: true });


module.exports = mongoose.model('Message', MessageSchema);