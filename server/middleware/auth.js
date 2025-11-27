const jwt = require('jsonwebtoken')
const User = require('../models/user')


module.exports = async function (req, res, next) {
const auth = req.headers.authorization
if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'missing token' })
const token = auth.split(' ')[1]
try {
const payload = jwt.verify(token, process.env.JWT_SECRET)
const user = await User.findById(payload.userId)
if (!user) return res.status(401).json({ error: 'invalid token' })
req.user = { userId: user._id, username: user.username }
next()
} catch (err) {
console.error(err)
res.status(401).json({ error: 'invalid token' })
}
}