const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { createSubscription, verifyPayment, getAllSubscriptions } = require('../controllers/subscriptionController');
const { validateSubscription } = require('../middleware/validator');

router.post('/create', protect, validateSubscription, createSubscription);
router.post('/verify', protect, verifyPayment);
router.get('/admin/all', protect, admin, getAllSubscriptions);

module.exports = router;
