const express = require('express')
const Certificate = require('../models/Certificate')
const { requireAuth } = require('../middleware/auth')
const multer = require('multer')
const { uploadBuffer } = require('../utils/cloudinary')

const router = express.Router()

// Multer storage configuration (memory + Cloudinary)
const storage = multer.memoryStorage()
const upload = multer({ storage })
const cloudFolder = process.env.CLOUDINARY_FOLDER || 'portfolio'

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

    const secureUrl = await uploadBuffer(req.file.buffer, { folder: `${cloudFolder}/certificates` })

    const certificate = new Certificate({ image: secureUrl })

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
      updateData.image = await uploadBuffer(req.file.buffer, { folder: `${cloudFolder}/certificates` })
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
