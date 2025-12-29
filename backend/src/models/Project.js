const mongoose = require('mongoose')

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  summary: { type: String },
  techStack: { type: [String], default: [] },
  technologies: { type: [String], default: [] },
  links: { type: [String], default: [] },
  repoLink: { type: String },
  liveLink: { type: String },
  githubUrl: { type: String },
  liveUrl: { type: String },
  images: { type: [String], default: [] },
  startDate: { type: Date },
  endDate: { type: Date }
}, { timestamps: true })

module.exports = mongoose.model('Project', ProjectSchema)
