const path = require('path')
const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary-v2')
const cloudinary = require('cloudinary').v2

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'audit-axon/resumes',
    allowed_formats: ['pdf', 'doc', 'docx'],
    resource_type: 'raw', // needed for non-image files like PDFs
  },
})

const ALLOWED_TYPES = {
  '.pdf': ['application/pdf'],
  '.doc': ['application/msword'],
  '.docx': ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
}

// Reject anything that isn't a PDF/DOC/DOCX before it is uploaded to Cloudinary.
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname || '').toLowerCase()
  const allowedMimes = ALLOWED_TYPES[ext]
  if (allowedMimes && allowedMimes.includes(file.mimetype)) return cb(null, true)

  const err = new Error('Resume must be a PDF, DOC or DOCX file')
  err.code = 'INVALID_FILE_TYPE'
  cb(err)
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1 * 1024 * 1024, files: 1, fields: 30 }, // 1MB, one résumé
})

module.exports = upload
