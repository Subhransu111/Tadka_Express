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

        const user = await User.findOne({ phone });
        if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

        if (user.lockUntil && user.lockUntil > Date.now()) {
        const remaining = Math.round((user.lockUntil - Date.now()) / 60000);
        return res.status(429).json({ error: `Account locked. Try again in ${remaining} minutes.` });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
        user.loginAttempts += 1;
        if (user.loginAttempts >= 5) {
            user.lockUntil = Date.now() + 30 * 60 * 1000; 
            user.loginAttempts = 0; 
        }
        await user.save();
        return res.status(401).json({ error: "Invalid credentials" });
    }

    // Reset on success
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    res.json({
        success: true,
        _id: user._id,
        name: user.name,
        role: user.role, 
        token: generateToken(user._id)
    });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Promote a user to Admin
// @route   PATCH /api/auth/update-role
exports.updateUserRole = async (req, res) => {
    try {
        const { phone, newRole } = req.body;

        // 1. Validation: Ensure role is valid
        if (!['user', 'admin'].includes(newRole)) {
            return res.status(400).json({ success: false, message: "Invalid role type" });
        }

        
        const user = await User.findOneAndUpdate(
            { phone },
            { role: newRole },
            { new: true }
        ).select('-passwordHash');

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            message: `User ${user.name} is now an ${newRole}`,
            user
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


exports.forgotPassword = async (req, res) => {
    const user = await User.findOne({ phone: req.body.phone });
    if (!user) return res.status(404).json({ error: "User not found" });

    const resetToken = crypto.randomBytes(20).toString('hex');
    
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // Expires in 10 mins

    await user.save();

    // In production, you would send this via SMS/WhatsApp
    res.status(200).json({ 
        success: true, 
        message: "Reset token generated", 
        token: resetToken 
    });
};