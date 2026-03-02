const Banner = require('../models/Banner');

// @desc    Admin uploads a new banner
// @route   POST /api/banners
exports.addBanner = async (req, res) => {
    try {
        // req.file.path is provided by the Cloudinary/Multer middleware
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Please upload an image" });
        }

        const banner = await Banner.create({
            title: req.body.title,
            imageUrl: req.file.path, // The Cloudinary URL
            linkTo: req.body.linkTo,
            isActive: true
        });

        res.status(201).json({ success: true, data: banner });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get all active banners for the Landing Page
// @route   GET /api/banners
exports.getActiveBanners = async (req, res) => {
    try {
        const banners = await Banner.find({ isActive: true }).sort({ displayOrder: 1 });
        res.status(200).json({ success: true, data: banners });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Delete or Disable a banner
// @route   DELETE /api/banners/:id
exports.deleteBanner = async (req, res) => {
    try {
        await Banner.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Banner removed" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};