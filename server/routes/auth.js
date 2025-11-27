const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')


const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d'


router.post('/register', async (req, res) => {
try {
const { username, password } = req.body
if (!username || !password) return res.status(400).json({ error: 'username and password required' })
const existing = await User.findOne({ username })
if (existing) return res.status(409).json({ error: 'username taken' })


const hashed = await bcrypt.hash(password, 10)
const user = await User.create({ username, password: hashed })
const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
res.json({ token, user: { userId: user._id, username: user.username } })
} catch (err) {
console.error(err)
res.status(500).json({ error: 'server error' })
}
})


router.post('/login', async (req, res) => {
try {
const { username, password } = req.body
if (!username || !password) return res.status(400).json({ error: 'username and password required' })
const user = await User.findOne({ username })
if (!user) return res.status(401).json({ error: 'invalid credentials' })
const ok = await bcrypt.compare(password, user.password)
if (!ok) return res.status(401).json({ error: 'invalid credentials' })
const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
res.json({ token, user: { userId: user._id, username: user.username } })
} catch (err) {
console.error(err)
res.status(500).json({ error: 'server error' })
}
})

module.exports = router