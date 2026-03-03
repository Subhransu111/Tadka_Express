const express = require('express');
const router = express.Router();
const { 
    addMenuItem, 
    getMenuByPlan, 
    updateMenuItem, 
    deleteMenuItem 
} = require('../controllers/menuController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public/User Routes
router.get('/:planType', getMenuByPlan); // Users can see menu based on their plan (Basic/Deluxe/Royal)

// Admin Protected Routes
router.post('/', protect, admin, addMenuItem); // Only Admin can add items
router.put('/:id', protect, admin, updateMenuItem); // Only Admin can update/disable items
router.delete('/:id', protect, admin, deleteMenuItem); // Only Admin can remove items

module.exports = router;