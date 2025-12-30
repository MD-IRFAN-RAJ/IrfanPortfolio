require('dotenv').config()
const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')
const Project = require('../src/models/Project')
const Certificate = require('../src/models/Certificate')
const Badge = require('../src/models/Badge')
const Internship = require('../src/models/Internship')
const { uploadBuffer } = require('../src/utils/cloudinary')

const uploadsDir = path.join(__dirname, '..', 'uploads')
const cloudFolder = process.env.CLOUDINARY_FOLDER || 'portfolio'

async function uploadLocalFile(localPath, folder) {
  if (!fs.existsSync(localPath)) {
    console.warn('File missing, skipping:', localPath)
    return null
  }
  const buffer = await fs.promises.readFile(localPath)
  return uploadBuffer(buffer, { folder })
}

async function migrateProjects() {
  const docs = await Project.find({ images: { $elemMatch: { $regex: '^/uploads/' } } })
  let updated = 0
  for (const doc of docs) {
    const newImages = []
    for (const img of doc.images) {
      if (img && img.startsWith('/uploads/')) {
        const localPath = path.join(uploadsDir, img.replace('/uploads/', ''))
        const url = await uploadLocalFile(localPath, `${cloudFolder}/projects`)
        if (url) newImages.push(url)
      } else if (img) {
        newImages.push(img)
      }
    }
    doc.images = newImages
    await doc.save()
    updated++
  }
  console.log(`Projects updated: ${updated}`)
}

async function migrateCertificates() {
  const docs = await Certificate.find({ image: { $regex: '^/uploads/' } })
  let updated = 0
  for (const doc of docs) {
    const localPath = path.join(uploadsDir, doc.image.replace('/uploads/', ''))
    const url = await uploadLocalFile(localPath, `${cloudFolder}/certificates`)
    if (url) {
      doc.image = url
      await doc.save()
      updated++
    }
  }
  console.log(`Certificates updated: ${updated}`)
}

async function migrateBadges() {
  const docs = await Badge.find({ imageUrl: { $regex: '^/uploads/' } })
  let updated = 0
  for (const doc of docs) {
    const localPath = path.join(uploadsDir, doc.imageUrl.replace('/uploads/', ''))
    const url = await uploadLocalFile(localPath, `${cloudFolder}/badges`)
    if (url) {
      doc.imageUrl = url
      await doc.save()
      updated++
    }
  }
  console.log(`Badges updated: ${updated}`)
}

async function migrateInternships() {
  const docs = await Internship.find({ certificateUrl: { $regex: '^/uploads/' } })
  let updated = 0
  for (const doc of docs) {
    const localPath = path.join(uploadsDir, doc.certificateUrl.replace('/uploads/', ''))
    const url = await uploadLocalFile(localPath, `${cloudFolder}/internships`)
    if (url) {
      doc.certificateUrl = url
      await doc.save()
      updated++
    }
  }
  console.log(`Internships updated: ${updated}`)
}

async function run() {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is missing')
    process.exit(1)
  }
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('Cloudinary env vars are missing')
    process.exit(1)
  }

  await mongoose.connect(process.env.MONGO_URI)
  console.log('Connected to MongoDB')

  await migrateProjects()
  await migrateCertificates()
  await migrateBadges()
  await migrateInternships()

  await mongoose.disconnect()
  console.log('Migration complete')
  process.exit(0)
}

run().catch(err => {
  console.error('Migration failed:', err)
  process.exit(1)
})
