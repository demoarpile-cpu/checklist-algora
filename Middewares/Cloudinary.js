const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { v2: cloudinary } = require("cloudinary");
require("dotenv").config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.SECRET_KEY,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        resource_type: "raw", 
        allowed_formats: ["pdf"],
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
        cb(null, true);
    } else {
        cb(new Error("Only PDF allowed"), false);
    }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
