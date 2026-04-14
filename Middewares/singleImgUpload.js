const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: "dfporfl8y",
    api_key: "244749221557343",
    api_secret: "jDkVlzvkhHjb81EvaLjYgtNtKsY",
});

const uploadSingleImageToCloudinary = async (req, res, next) => {
    try {
        if (!req.file) {
            return next();
        }

        const dataUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        const result = await cloudinary.uploader.upload(dataUrl);
        req.uploadedImageUrl = result.secure_url;

        next();
    } catch (error) {
        res.status(500).json({ message: "File was not uploaded in backend", error: error.message });
    }
};

module.exports = { uploadSingleImageToCloudinary };
