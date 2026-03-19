const express = require('express');
const router = express.Router();
const {
    registerUser, loginUser, updateUserRole,
    getUserDashboardData, getProfile, updateProfile,
    getReferralInfo, getUserOrders, getUserSubscriptions,
    getAllUsers, getAllSubscriptions
} = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middleware/validator');
const { protect, admin } = require('../middleware/authMiddleware');

// Public
router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);

// Protected - User
router.get('/dashboard',     protect, getUserDashboardData);
router.get('/profile',       protect, getProfile);
router.put('/profile',       protect, updateProfile);
router.get('/referral',      protect, getReferralInfo);
router.get('/orders',        protect, getUserOrders);
router.get('/subscriptions', protect, getUserSubscriptions);

// Admin only
router.patch('/update-role',          protect, admin, updateUserRole);
router.get('/admin/users',            protect, admin, getAllUsers);
router.get('/admin/subscriptions',    protect, admin, getAllSubscriptions);

module.exports = router;