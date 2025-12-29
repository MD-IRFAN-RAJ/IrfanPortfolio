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

// serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/internships', internshipRoutes)
app.use('/api/certificates', certificateRoutes)
app.use('/api/badges', badgeRoutes)

const PORT = process.env.PORT || 5000

async function start() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/portfolio'
  try {
    await mongoose.connect(uri)
    console.log('Connected to MongoDB')
  } catch (err) {
    console.error('Failed to connect to MongoDB', err)
    process.exit(1)
  }
}

start()

module.exports = app
