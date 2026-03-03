const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Helper to generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user
// @route   POST /api/auth/register
exports.registerUser = async (req, res) => {
    try {
        const { name, phone, password, referredByCode } = req.body;

        // 1. Check if user already exists
        const userExists = await User.findOne({ phone });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // 2. Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Generate unique referral code for this user (e.g., TADKA-XXXX)
        const myReferralCode = `TADKA-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

        // 4. Handle Reward logic if they were referred
        let referrerId = null;
        if (referredByCode) {
            const referrer = await User.findOne({ referralCode: referredByCode });
            if (referrer) {
                referrerId = referrer._id;
            }
        }

        // 5. Create user
        const user = await User.create({
            name,
            phone,
            passwordHash: hashedPassword,
            referralCode: myReferralCode,
            referredBy: referrerId
        });

        res.status(201).json({
            success: true,
            _id: user._id,
            name: user.name,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
    try {
        const { phone, password } = req.body;

        // Find user by phone
        const user = await User.findOne({ phone });

        // Check if user exists and password matches
        if (user && (await bcrypt.compare(password, user.passwordHash))) {
            res.json({
                success: true,
                _id: user._id,
                name: user.name,
                role: user.role, // Important for the Admin Dashboard feature
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid phone or password' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};