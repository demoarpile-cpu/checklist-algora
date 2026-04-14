const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./ChecklistImg'); // Cloudinary config

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'checklist_images',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage });

module.exports = upload;
