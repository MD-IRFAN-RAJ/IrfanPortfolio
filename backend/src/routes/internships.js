const express = require('express')
const Internship = require('../models/Internship')
const { requireAuth } = require('../middleware/auth')
const multer = require('multer')
const { uploadBuffer } = require('../utils/cloudinary')
const path = require('path')

const router = express.Router()

// Configure multer for file uploads (memory + Cloudinary)
const storage = multer.memoryStorage()
const cloudFolder = process.env.CLOUDINARY_FOLDER || 'portfolio'

const upload = multer({ 
  storage,
  fileFilter: function (req, file, cb) {
    // Accept images and PDFs for certificates
    const allowedTypes = /jpeg|jpg|png|gif|pdf|webp|avif/
    const mimetype = allowedTypes.test(file.mimetype)
    
    if (mimetype) {
      return cb(null, true)
    } else {
      cb(new Error('Only images and PDF files are allowed'))
    }
  }
})

// Get all internships
router.get('/', async (req, res) => {
  try {
    const internships = await Internship.find().sort({ startDate: -1 })
    res.json(internships)
  } catch (err) {
    res.status(500).json({ message: 'Error fetching internships', error: err.message })
  }
})

// Create internship
router.post('/', requireAuth, upload.single('certificate'), async (req, res) => {
  try {
    const { 
      company, 
      position, 
      location, 
      startDate, 
      endDate, 
      duration,
      description,
      responsibilities,
      achievements,
      skills,
      technologies,
      category,
      supervisor,
      recommendation,
      projectUrl,
      paid,
      remote,
      impact
    } = req.body

    if (!company || !position || !startDate || !endDate) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    const isPdf = req.file?.mimetype === 'application/pdf'
    const ext = req.file ? path.extname(req.file.originalname || '') : ''
    const format = isPdf ? 'pdf' : ext ? ext.replace('.', '') : undefined
    const baseName = req.file ? path.basename(req.file.originalname || 'certificate', ext) : 'certificate'
    const publicId = req.file ? `${baseName}-${Date.now()}` : undefined

    // Handle certificate file upload (Cloudinary)
    const certificateUrl = req.file
      ? await uploadBuffer(req.file.buffer, { 
          folder: `${cloudFolder}/internships`,
          resourceType: isPdf ? 'raw' : 'image',
          format,
          publicId
        })
      : null

    // Parse arrays if they come as JSON strings
    const parseArray = (field) => {
      if (typeof field === 'string') {
        try {
          return JSON.parse(field)
        } catch {
          return field.split(',').map(item => item.trim()).filter(Boolean)
        }
      }
      return Array.isArray(field) ? field : []
    }

    const internship = new Internship({
      company,
      position,
      location: location || 'Not specified',
      startDate,
      endDate,
      duration,
      description: description || '',
      responsibilities: parseArray(responsibilities),
      achievements: parseArray(achievements),
      skills: parseArray(skills),
      technologies: parseArray(technologies),
      category: category || 'software',
      supervisor,
      recommendation,
      projectUrl,
      certificateUrl,
      paid: paid === 'true' || paid === true,
      remote: remote === 'true' || remote === true,
      impact: impact || ''
    })

    await internship.save()
    res.status(201).json(internship)
  } catch (err) {
    res.status(500).json({ message: 'Error creating internship', error: err.message })
  }
})

// Update internship
router.put('/:id', requireAuth, upload.single('certificate'), async (req, res) => {
  try {
    const { 
      company, 
      position, 
      location, 
      startDate, 
      endDate,
      duration,
      description,
      responsibilities,
      achievements,
      skills,
      technologies,
      category,
      supervisor,
      recommendation,
      projectUrl,
      paid,
      remote,
      impact
    } = req.body

    const isPdf = req.file?.mimetype === 'application/pdf'
    const ext = req.file ? path.extname(req.file.originalname || '') : ''
    const format = isPdf ? 'pdf' : ext ? ext.replace('.', '') : undefined
    const baseName = req.file ? path.basename(req.file.originalname || 'certificate', ext) : 'certificate'
    const publicId = req.file ? `${baseName}-${Date.now()}` : undefined

    // Handle certificate file upload
    const certificateUrl = req.file
      ? await uploadBuffer(req.file.buffer, { 
          folder: `${cloudFolder}/internships`,
          resourceType: isPdf ? 'raw' : 'image',
          format,
          publicId
        })
      : undefined

    // Parse arrays if they come as JSON strings
    const parseArray = (field) => {
      if (typeof field === 'string') {
        try {
          return JSON.parse(field)
        } catch {
          return field.split(',').map(item => item.trim()).filter(Boolean)
        }
      }
      return Array.isArray(field) ? field : []
    }

    const updateData = {
      company,
      position,
      location,
      startDate,
      endDate,
      duration,
      description,
      responsibilities: parseArray(responsibilities),
      achievements: parseArray(achievements),
      skills: parseArray(skills),
      technologies: parseArray(technologies),
      category,
      supervisor,
      recommendation,
      projectUrl,
      paid: paid === 'true' || paid === true,
      remote: remote === 'true' || remote === true,
      impact
    }

    // Only update certificate if a new one was uploaded
    if (certificateUrl) {
      updateData.certificateUrl = certificateUrl
    }

    const internship = await Internship.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    )

    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' })
    }

    res.json(internship)
  } catch (err) {
    res.status(500).json({ message: 'Error updating internship', error: err.message })
  }
})

// Delete internship
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const internship = await Internship.findByIdAndDelete(req.params.id)

    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' })
    }

    res.json({ message: 'Internship deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Error deleting internship', error: err.message })
  }
})

module.exports = router
