const mongoose = require('mongoose')

const badgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  issuer: {
    type: String,
    required: true
  },
  issueDate: {
    type: Date,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  credentialUrl: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Badge', badgeSchema)
