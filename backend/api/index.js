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
  origin: process.env.FRONTEND_ORIGIN || '*', 
  credentials: true 
}))
app.use(express.json())

// Cached MongoDB connection for serverless
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function connectDB() {
  if (cached.conn) {
    console.log('Using cached MongoDB connection')
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    }

    const MONGO_URI = process.env.MONGO_URI
    
    // Quick check for debugging
    console.log("MONGO_URI:", MONGO_URI ? "FOUND" : "MISSING")
    
    if (!MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not set')
    }

    cached.promise = mongoose.connect(MONGO_URI, opts).then((mongoose) => {
      console.log('✅ MongoDB connected successfully')
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    console.error('❌ MongoDB connection failed:', e.message)
    throw e
  }

  return cached.conn
}

// Middleware to ensure DB connection before handling requests
app.use(async (req, res, next) => {
  try {
    await connectDB()
    next()
  } catch (err) {
    console.error('Database connection error:', err)
    res.status(503).json({ 
      message: 'Database connection failed',
      error: err.message 
    })
  }
})

// serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    mongoConnected: mongoose.connection.readyState === 1,
    mongoUriConfigured: !!process.env.MONGO_URI,
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
    error: process.env.NODE_ENV === 'development' ? err.stack : {}
  })
})

module.exports = app
