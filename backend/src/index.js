const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')

dotenv.config()

const authRoutes = require('./routes/auth')
const projectRoutes = require('./routes/projects')
const internshipRoutes = require('./routes/internships')
const certificateRoutes = require('./routes/certificates')
const badgeRoutes = require('./routes/badges')

const app = express()

app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173', credentials: true }))
app.use(express.json())

let mongoConnected = false

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    mongoConnected: mongoConnected,
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

const PORT = process.env.PORT || 5000

async function start() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/portfolio'
  try {
    await mongoose.connect(uri)
    console.log('Connected to MongoDB')
    mongoConnected = true
  } catch (err) {
    console.error('Failed to connect to MongoDB', err)
    mongoConnected = false
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    if (!mongoConnected) {
      console.warn('⚠️ WARNING: MongoDB is not connected. Database operations will fail.')
    }
  })
}

// Only start server if not in serverless environment
if (require.main === module) {
  start()
}

module.exports = app
