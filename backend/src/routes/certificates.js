const express = require('express')
const multer = require('multer')
const path = require('path')
const Certificate = require('../models/Certificate')
const { requireAuth } = require('../middleware/auth')

const router = express.Router()

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', '..', 'uploads'))
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname)
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1e9) + ext)
  }
})

const upload = multer({ storage })

// Get all certificates
router.get('/', async (req, res) => {
  try {
    const certificates = await Certificate.find().sort({ createdAt: -1 })
    res.json(certificates)
  } catch (err) {
    res.status(500).json({ message: 'Error fetching certificates', error: err.message })
  }
})

// Create certificate with image upload
router.post('/', requireAuth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Certificate image is required' })
    }

    const certificate = new Certificate({
      image: `/uploads/${req.file.filename}`
    })

    await certificate.save()
    res.status(201).json(certificate)
  } catch (err) {
    res.status(500).json({ message: 'Error creating certificate', error: err.message })
  }
})

// Update certificate with new image
router.put('/:id', requireAuth, upload.single('image'), async (req, res) => {
  try {
    const updateData = {}
    
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`
    }

    const certificate = await Certificate.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    )

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' })
    }

    res.json(certificate)
  } catch (err) {
    res.status(500).json({ message: 'Error updating certificate', error: err.message })
  }
})

// Delete certificate
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const certificate = await Certificate.findByIdAndDelete(req.params.id)

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' })
    }

    res.json({ message: 'Certificate deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Error deleting certificate', error: err.message })
  }
})

module.exports = router
