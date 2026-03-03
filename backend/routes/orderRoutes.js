const express = require('express');
const router = express.Router();
const { 
    updateMealSection, 
    getAdminDeliveryList, 
    getKitchenSummary 
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.patch('/select-meal', protect, updateMealSection);
router.get('/admin/delivery/:date', protect, admin, getAdminDeliveryList);
router.get('/admin/summary/:date', protect, admin, getKitchenSummary);

module.exports = router;