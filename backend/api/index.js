const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')

dotenv.config()

const authRoutes = require('../src/routes/auth')
const projectRoutes = require('../src/routes/projects')
const internshipRoutes = require('../src/routes/internships')
const certificateRoutes = require('../src/routes/certificates')
const badgeRoutes = require('../src/routes/badges')

const app = express()

app.use(cors({ 
  origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173', 
  credentials: true 
}))
app.use(express.json())

// serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    mongoConnected: mongoose.connection.readyState === 1,
    timestamp: new Date().toISOString()
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/internships', internshipRoutes)
app.use('/api/certificates', certificateRoutes)
app.use('/api/badges', badgeRoutes)

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({ 
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  })
})

// Connect to MongoDB
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return
  
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/portfolio'
  try {
    await mongoose.connect(uri)
    console.log('Connected to MongoDB')
  } catch (err) {
    console.error('Failed to connect to MongoDB', err)
  }
}

connectDB()

module.exports = app
