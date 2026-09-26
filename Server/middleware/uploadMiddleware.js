const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary-v2");const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "audit-axon/resumes",
    allowed_formats: ["pdf", "doc", "docx"],
    resource_type: "raw", // needed for non-image files like PDFs
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 1 * 1024 * 1024 }, // 1MB
});

module.exports = upload;