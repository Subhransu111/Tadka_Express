const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middleware/validator');

const { protect, admin } = require('../middleware/authMiddleware');

router.patch('/update-role', protect, admin, updateUserRole);
router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);

module.exports = router;