const { v2: cloudinary } = require('cloudinary');

cloudinary.config({
    cloud_name: "dfporfl8y",
    api_key: "244749221557343",
    api_secret: "jDkVlzvkhHjb81EvaLjYgtNtKsY",
});

const uploadSingleFileToCloudinary = async (req, res, next) => {
    try {
        if (!req.file) {
            req.uploadedFileUrl = null;
            return next(); // Skip if no file is provided
        }

        const mimeType = req.file.mimetype;
        const dataUrl = `data:${mimeType};base64,${req.file.buffer.toString('base64')}`;

        // 🧠 Set resource_type based on MIME
        const resourceType = mimeType === "application/pdf" ? "raw" : "auto";

        const result = await cloudinary.uploader.upload(dataUrl, {
            resource_type: resourceType,
        });

        req.uploadedFileUrl = result.secure_url;
        next();
    } catch (error) {
        res.status(500).json({ message: "File upload failed", error: error.message });
    }
};

module.exports = { uploadSingleFileToCloudinary };
