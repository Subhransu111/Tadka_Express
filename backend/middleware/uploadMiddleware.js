const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Banner uploads (admin → landing page) ──
const bannerStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'tadka_express/banners',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
        transformation: [{ width: 1200, height: 400, crop: 'limit', quality: 'auto', fetch_format: 'auto' }],
    },
});

// ── General image uploads (menu items, etc.) ──
const generalStorage = new CloudinaryStorage({
    cloudinary,
    params: (req, file) => ({
        folder: `tadka_express/${req.body.folder || 'general'}`,
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    }),
});

const upload = multer({ storage: bannerStorage });
const uploadGeneral = multer({ storage: generalStorage });

// Helper: upload a file buffer directly (for programmatic use)
const uploadBuffer = (buffer, folder = 'tadka_express/general') => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { folder, resource_type: 'image', transformation: [{ quality: 'auto', fetch_format: 'auto' }] },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        ).end(buffer);
    });
};

module.exports = { upload, uploadGeneral, uploadBuffer, cloudinary };