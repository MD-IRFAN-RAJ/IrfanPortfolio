const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })
const mongoose = require('mongoose')
const Internship = require('../src/models/Internship')
const { cloudinary } = require('../src/utils/cloudinary')

async function reuploadPdfs() {
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
        console.log(`Processing: ${internship.company} - ${internship.position}`)
        console.log(`Current URL: ${internship.certificateUrl}`)

        // Extract the public_id from the URL
        // URL format: https://res.cloudinary.com/dwlkowrre/image/upload/v1767081422/portfolioirfan25/internships/mavknajqgnrxwpf9xadj.pdf
        const urlParts = internship.certificateUrl.split('/')
        const publicIdWithExt = urlParts.slice(urlParts.indexOf('portfolioirfan25')).join('/')
        const publicId = publicIdWithExt.replace('.pdf', '')

        console.log(`Public ID: ${publicId}`)

        // Try to get the resource from Cloudinary as 'image' type (where it currently exists)
        try {
          const imageResource = await cloudinary.api.resource(publicId, { resource_type: 'image' })
          console.log(`Found as image resource, re-uploading as raw...`)

          // Get the original URL (as image type)
          const originalUrl = imageResource.secure_url

          // Upload it again as 'raw' type using the URL
          const result = await cloudinary.uploader.upload(originalUrl, {
            public_id: publicId,
            resource_type: 'raw',
            overwrite: true
          })

          console.log(`✓ Successfully re-uploaded as raw`)
          console.log(`New URL: ${result.secure_url}`)

          // Update the database with the new URL
          internship.certificateUrl = result.secure_url
          await internship.save()

          // Optionally, delete the old image resource
          await cloudinary.uploader.destroy(publicId, { resource_type: 'image' })
          console.log(`✓ Deleted old image resource`)

        } catch (resourceError) {
          // If not found as image, check if it already exists as raw
          try {
            const rawResource = await cloudinary.api.resource(publicId, { resource_type: 'raw' })
            console.log(`Already exists as raw resource`)
            console.log(`URL: ${rawResource.secure_url}`)
            
            // Update database if URL is different
            if (internship.certificateUrl !== rawResource.secure_url) {
              internship.certificateUrl = rawResource.secure_url
              await internship.save()
              console.log(`✓ Updated database with correct URL`)
            }
          } catch (rawError) {
            console.error(`✗ Resource not found in Cloudinary: ${resourceError.message}`)
          }
        }

        console.log('') // Empty line for readability
      } catch (err) {
        console.error(`✗ Error processing ${internship.company}: ${err.message}\n`)
      }
    }

    await mongoose.connection.close()
    console.log('Database connection closed')
    console.log('\n✓ Process completed!')
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

reuploadPdfs()
