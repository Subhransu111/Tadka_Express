const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { addBanner, getActiveBanners, deleteBanner } = require('../controllers/bannerController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getActiveBanners); // Public: for landing page
router.post('/', protect, admin, upload.single('image'), addBanner); // Admin only
router.delete('/:id', protect, admin, deleteBanner);

module.exports = router;