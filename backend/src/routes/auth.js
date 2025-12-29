const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const Admin = require('../models/Admin')

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_in_production'

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) return res.status(400).json({ message: 'username and password required' })
  try {
    const admin = await Admin.findOne({ username })
    if (!admin) return res.status(401).json({ message: 'invalid credentials' })
    const valid = bcrypt.compareSync(password, admin.passwordHash)
    if (!valid) return res.status(401).json({ message: 'invalid credentials' })
    const token = jwt.sign({ sub: admin._id, username: admin.username, role: admin.role }, JWT_SECRET, { expiresIn: '12h' })
    res.json({ token })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'server error' })
  }
})

module.exports = router
