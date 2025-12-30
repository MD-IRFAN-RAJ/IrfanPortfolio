const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })
const mongoose = require('mongoose')
const Internship = require('../src/models/Internship')
const Certificate = require('../src/models/Certificate')

async function fixPdfUrls() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/portfolio'
    console.log('Connecting to MongoDB...')
    await mongoose.connect(mongoUri)
    console.log('Connected to MongoDB')

    // Fix internship certificate URLs
    const internships = await Internship.find({ certificateUrl: { $exists: true, $ne: null } })
    console.log(`Found ${internships.length} internships with certificates`)

    let fixedCount = 0
    for (const internship of internships) {
      if (internship.certificateUrl && internship.certificateUrl.includes('/image/upload/') && 
          internship.certificateUrl.endsWith('.pdf')) {
        const fixedUrl = internship.certificateUrl.replace('/image/upload/', '/raw/upload/')
        internship.certificateUrl = fixedUrl
        await internship.save()
        console.log(`Fixed: ${internship.company} - ${internship.position}`)
        console.log(`  Old: ${internship.certificateUrl}`)
        console.log(`  New: ${fixedUrl}`)
        fixedCount++
      }
    }

    console.log(`\nFixed ${fixedCount} internship PDF URLs`)

    // Check certificates too (if any PDFs exist there)
    const certificates = await Certificate.find({ image: { $exists: true, $ne: null } })
    console.log(`\nFound ${certificates.length} certificates`)

    let certFixedCount = 0
    for (const cert of certificates) {
      if (cert.image && cert.image.includes('/image/upload/') && cert.image.endsWith('.pdf')) {
        const fixedUrl = cert.image.replace('/image/upload/', '/raw/upload/')
        cert.image = fixedUrl
        await cert.save()
        console.log(`Fixed certificate: ${cert._id}`)
        certFixedCount++
      }
    }

    console.log(`Fixed ${certFixedCount} certificate PDF URLs`)

    await mongoose.connection.close()
    console.log('\nDatabase connection closed')
  } catch (error) {
    console.error('Error fixing PDF URLs:', error)
    process.exit(1)
  }
}

fixPdfUrls()
