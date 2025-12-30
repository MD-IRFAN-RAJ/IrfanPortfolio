const { v2: cloudinary } = require('cloudinary')
const streamifier = require('streamifier')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

/**
 * Upload a file buffer to Cloudinary.
 * @param {Buffer} buffer - File buffer
 * @param {Object} options - folder, publicId, resourceType, format
 * @returns {Promise<string>} secure_url
 */
function uploadBuffer(buffer, { folder = 'portfolio', publicId, resourceType = 'image', format } = {}) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: resourceType,
        format,
        overwrite: true
      },
      (error, result) => {
        if (error) return reject(error)
        resolve(result.secure_url)
      }
    )

    streamifier.createReadStream(buffer).pipe(uploadStream)
  })
}

module.exports = {
  cloudinary,
  uploadBuffer
}
