const express = require('express');
const router = express.Router();
const {
    updateMealSection,
    getUpcomingMeal,
    getAdminDeliveryList,
    getKitchenSummary,
    getSkippedMeals
} = require('../controllers/orderControllers');
const { protect, admin } = require('../middleware/authMiddleware');

// User routes
router.patch('/select-meal',              protect, updateMealSection);
router.get('/upcoming',                   protect, getUpcomingMeal);

// Admin routes
router.get('/admin/delivery/:date',       protect, admin, getAdminDeliveryList);
router.get('/admin/summary/:date',        protect, admin, getKitchenSummary);
router.get('/admin/skipped/:date',        protect, admin, getSkippedMeals);

module.exports = router;