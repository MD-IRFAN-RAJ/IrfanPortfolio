const mongoose = require('mongoose')

const internshipSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  location: {
    type: String,
    default: 'Not specified'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  duration: {
    type: String
  },
  description: {
    type: String,
    default: ''
  },
  responsibilities: {
    type: [String],
    default: []
  },
  achievements: {
    type: [String],
    default: []
  },
  skills: {
    type: [String],
    default: []
  },
  technologies: {
    type: [String],
    default: []
  },
  category: {
    type: String,
    enum: ['software', 'data-science', 'research', 'business', 'design'],
    default: 'software'
  },
  companyLogo: {
    type: String
  },
  supervisor: {
    type: String
  },
  recommendation: {
    type: String
  },
  projectUrl: {
    type: String
  },
  certificateUrl: {
    type: String
  },
  paid: {
    type: Boolean,
    default: true
  },
  remote: {
    type: Boolean,
    default: false
  },
  impact: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Internship', internshipSchema)
