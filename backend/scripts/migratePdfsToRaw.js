const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })
const mongoose = require('mongoose')
const Internship = require('../src/models/Internship')
const { cloudinary } = require('../src/utils/cloudinary')
const https = require('https')

function fetchPdf(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`))
        return
      }
      
      const chunks = []
      response.on('data', (chunk) => chunks.push(chunk))
      response.on('end', () => resolve(Buffer.concat(chunks)))
      response.on('error', reject)
    }).on('error', reject)
  })
}

async function migratePdfsToRaw() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/portfolio'
    console.log('Connecting to MongoDB...')
    await mongoose.connect(mongoUri)
    console.log('Connected to MongoDB')

    // Find all internships with PDF certificates
    const internships = await Internship.find({ 
      certificateUrl: { $exists: true, $ne: null, $regex: /\.pdf$/i } 
    })
    
    console.log(`Found ${internships.length} internships with PDF certificates\n`)

    for (const internship of internships) {
      try {
        console.log(`\n${'='.repeat(70)}`)
        console.log(`Processing: ${internship.company} - ${internship.position}`)
        console.log(`Current URL: ${internship.certificateUrl}`)

        // Extract the public_id from the URL
        const urlParts = internship.certificateUrl.split('/')
        const publicIdWithExt = urlParts.slice(urlParts.indexOf('portfolioirfan25')).join('/')
        const publicId = publicIdWithExt.replace('.pdf', '')

        console.log(`Public ID: ${publicId}`)

        // Try to download the PDF from the image URL
        const imageUrl = internship.certificateUrl.replace('/raw/upload/', '/image/upload/')
        console.log(`Attempting to fetch from: ${imageUrl}`)
        
        try {
          const pdfData = await fetchPdf(imageUrl)
          
          console.log(`✓ Successfully downloaded PDF (${pdfData.length} bytes)`)
          
          // Convert to base64 for Cloudinary upload
          const base64Data = pdfData.toString('base64')
          const dataUri = `data:application/pdf;base64,${base64Data}`
          
          // Upload to Cloudinary as 'raw' type
          console.log(`Uploading to Cloudinary as raw resource...`)
          const result = await cloudinary.uploader.upload(dataUri, {
            public_id: publicId,
            resource_type: 'raw',
            overwrite: true
          })

          console.log(`✓ Successfully uploaded as raw`)
          console.log(`New URL: ${result.secure_url}`)

          // Update the database
          internship.certificateUrl = result.secure_url
          await internship.save()
          console.log(`✓ Database updated`)

          // Delete the old image resource
          try {
            await cloudinary.uploader.destroy(publicId, { resource_type: 'image', invalidate: true })
            console.log(`✓ Deleted old image resource`)
          } catch (deleteErr) {
            console.log(`  (Could not delete old image resource: ${deleteErr.message})`)
          }

        } catch (fetchError) {
          console.log(`✗ Error fetching PDF from image URL: ${fetchError.message}`)
          console.log(`  Please re-upload this certificate through the admin interface.`)
        }

      } catch (err) {
        console.error(`✗ Error processing ${internship.company}: ${err.message}`)
      }
    }

    await mongoose.connection.close()
    console.log(`\n${'='.repeat(70)}`)
    console.log('Database connection closed')
    console.log('✓ Process completed!')
    console.log('\nNOTE: For any PDFs that could not be migrated, please re-upload them')
    console.log('through the admin interface.')
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

migratePdfsToRaw()
