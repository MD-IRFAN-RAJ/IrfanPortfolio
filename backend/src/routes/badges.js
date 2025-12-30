const express = require('express')
const Badge = require('../models/Badge')
const { requireAuth } = require('../middleware/auth')
const multer = require('multer')
const { uploadBuffer } = require('../utils/cloudinary')

const router = express.Router()

// Configure multer for image uploads (memory + Cloudinary)
const storage = multer.memoryStorage()
const cloudFolder = process.env.CLOUDINARY_FOLDER || 'portfolio'

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp|avif/
    const mimetype = allowedTypes.test(file.mimetype)
    if (mimetype) {
      return cb(null, true)
    }
    cb(new Error('Only image files are allowed'))
  }
})

// Get all badges
router.get('/', async (req, res) => {
  try {
    const badges = await Badge.find().sort({ issueDate: -1 })
    res.json(badges)
  } catch (err) {
    res.status(500).json({ message: 'Error fetching badges', error: err.message })
  }
})

// Create badge
router.post('/', requireAuth, upload.single('image'), async (req, res) => {
  try {
    const { name, issuer, issueDate, credentialUrl } = req.body

    if (!name || !issuer || !issueDate) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    const imageUrl = req.file ? await uploadBuffer(req.file.buffer, { folder: `${cloudFolder}/badges` }) : null

    const badge = new Badge({ name, issuer, issueDate, imageUrl, credentialUrl })

    await badge.save()
    res.status(201).json(badge)
  } catch (err) {
    res.status(500).json({ message: 'Error creating badge', error: err.message })
  }
})

// Update badge
router.put('/:id', requireAuth, upload.single('image'), async (req, res) => {
  try {
    const { name, issuer, issueDate, credentialUrl } = req.body

    const updateData = { name, issuer, issueDate, credentialUrl }
    if (req.file) {
      updateData.imageUrl = await uploadBuffer(req.file.buffer, { folder: `${cloudFolder}/badges` })
    }

    const badge = await Badge.findByIdAndUpdate(req.params.id, updateData, { new: true })

    if (!badge) {
      return res.status(404).json({ message: 'Badge not found' })
    }

    res.json(badge)
  } catch (err) {
    res.status(500).json({ message: 'Error updating badge', error: err.message })
  }
})

// Delete badge
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const badge = await Badge.findByIdAndDelete(req.params.id)

    if (!badge) {
      return res.status(404).json({ message: 'Badge not found' })
    }

    res.json({ message: 'Badge deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Error deleting badge', error: err.message })
  }
})

module.exports = router
