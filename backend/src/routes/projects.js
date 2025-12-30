const express = require('express')
const router = express.Router()
const Project = require('../models/Project')
const { requireAuth } = require('../middleware/auth')
const multer = require('multer')
const { uploadBuffer } = require('../utils/cloudinary')

// Use in-memory storage; upload to Cloudinary
const storage = multer.memoryStorage()
const upload = multer({ storage })

const cloudFolder = process.env.CLOUDINARY_FOLDER || 'portfolio'

// Public: list projects
router.get('/', async (req, res) => {
  try {
    const items = await Project.find().sort({ createdAt: -1 })
    res.json(items)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'server error' })
  }
})

// Public: get by id
router.get('/:id', async (req, res) => {
  try {
    const item = await Project.findById(req.params.id)
    if (!item) return res.status(404).json({ message: 'not found' })
    res.json(item)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'server error' })
  }
})

// Admin create (supports file uploads for images)
router.post('/', requireAuth, upload.array('images', 6), async (req, res) => {
  try {
    const payload = req.body
    const files = req.files || []
    const images = await Promise.all(files.map(f => uploadBuffer(f.buffer, {
      folder: `${cloudFolder}/projects`
    })))
    const projectData = {
      title: payload.title,
      summary: payload.summary || '',
      techStack: payload.techStack ? JSON.parse(payload.techStack) : [],
      technologies: payload.technologies ? JSON.parse(payload.technologies) : [],
      links: payload.links ? JSON.parse(payload.links) : [],
      repoLink: payload.repoLink || '',
      liveLink: payload.liveLink || '',
      githubUrl: payload.githubUrl || '',
      liveUrl: payload.liveUrl || '',
      images
    }
    const p = new Project(projectData)
    await p.save()
    res.status(201).json(p)
  } catch (err) {
    console.error('Create error:', err)
    res.status(500).json({ message: 'server error', error: err.message })
  }
})

// Admin update
router.put('/:id', requireAuth, upload.array('images', 6), async (req, res) => {
  try {
    const payload = req.body
    const files = req.files || []
    const images = await Promise.all(files.map(f => uploadBuffer(f.buffer, {
      folder: `${cloudFolder}/projects`
    })))
    const update = {
      title: payload.title,
      summary: payload.summary || '',
      techStack: payload.techStack ? JSON.parse(payload.techStack) : [],
      technologies: payload.technologies ? JSON.parse(payload.technologies) : [],
      links: payload.links ? JSON.parse(payload.links) : [],
      repoLink: payload.repoLink || '',
      liveLink: payload.liveLink || '',
      githubUrl: payload.githubUrl || '',
      liveUrl: payload.liveUrl || ''
    }
    if (images.length) update.images = images
    const p = await Project.findByIdAndUpdate(req.params.id, update, { new: true })
    if (!p) return res.status(404).json({ message: 'not found' })
    res.json(p)
  } catch (err) {
    console.error('Update error:', err)
    res.status(500).json({ message: 'server error', error: err.message })
  }
})

// Admin delete
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const p = await Project.findByIdAndDelete(req.params.id)
    if (!p) return res.status(404).json({ message: 'not found' })
    res.json({ message: 'deleted' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'server error' })
  }
})

module.exports = router
