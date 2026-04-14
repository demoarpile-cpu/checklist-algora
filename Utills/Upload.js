const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// ✅ Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// ✅ Cloudinary Storage Setup for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'checklist-images', // Cloudinary folder name
    allowed_formats: ['jpg', 'png', 'jpeg'], // Allowed file formats
    transformation: [{ width: 800, height: 800, crop: 'limit' }] // Optional: Resize limit
  }
});

// ✅ Multer Middleware
const uploadData = multer({ storage });

// ✅ Exports
module.exports = { cloudinary, uploadData };
