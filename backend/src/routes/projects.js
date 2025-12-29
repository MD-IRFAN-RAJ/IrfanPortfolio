const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const Project = require('../models/Project')
const { requireAuth } = require('../middleware/auth')

// simple disk storage for uploads (dev)
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
    const images = (req.files || []).map(f => `/uploads/${f.filename}`)
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
    const images = (req.files || []).map(f => `/uploads/${f.filename}`)
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
