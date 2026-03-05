const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createSubscription,verifyPayment} = require('../controllers/subscriptionController');
const { validateSubscription } = require('../middleware/validator');

router.post('/create', protect, validateSubscription, createSubscription);
router.post('/verify', protect, verifyPayment);

module.exports = router;
