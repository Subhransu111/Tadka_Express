const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createSubscription,verifyPayment} = require('../controllers/subscriptionController');

router.post('/create',protect,createSubscription);
router.post('/verify',protect,verifyPayment);

module.exports = router;
