const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Subscription = require('../models/Subscription');
const DailyOrder = require('../models/DailyOrder');

// Helper to generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user
// @route   POST /api/auth/register
exports.registerUser = async (req, res) => {
    try {
        const { name, phone, email, password, referredByCode, address } = req.body;

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
            email: email || undefined,
            passwordHash: hashedPassword,
            referralCode: myReferralCode,
            referredBy: referrerId,
            address: address || {}
        });

        res.status(201).json({
            success: true,
            _id: user._id,
            name: user.name,
            role: user.role,
            referralCode: user.referralCode,
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
            referralCode: user.referralCode,
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

// @desc    Get aggregated dashboard data for the user
// @route   GET /api/auth/dashboard
// @access  Private
exports.getUserDashboardData = async (req, res) => {
    try {
        const userId = req.user._id;

        // 1. Get User Profile Data
        const user = await User.findById(userId).select('name phone email address rewardPoints referralCode');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // 2. Get Active Subscription
        const activeSubscription = await Subscription.findOne({
            userId: userId,
            status: 'active',
            endDate: { $gte: new Date() } // Ensures it hasn't expired
        }).sort({ createdAt: -1 });

        // 3. Get Recent Orders (last 5)
        const recentOrders = await DailyOrder.find({ userId: userId })
            .sort({ date: -1 })
            .limit(5)
            .select('date planType selectedItem isSkipped deliveryStatus');

        // 4. Calculate total orders count
        const totalOrdersCount = await DailyOrder.countDocuments({
            userId: userId,
            deliveryStatus: 'delivered'
        });

        // 5. Calculate "this week" change (mocked as +5 for now, or calculate based on date)
        const weeklyOrders = await DailyOrder.countDocuments({
            userId: userId,
            deliveryStatus: 'delivered',
            date: { $gte: new Date(new Date().setDate(new Date().getDate() - 7)) }
        });

        res.status(200).json({
            success: true,
            data: {
                profile: user,
                stats: {
                    totalOrders: totalOrdersCount,
                    weeklyOrdersChange: weeklyOrders
                },
                subscription: activeSubscription,
                recentOrders: recentOrders
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
// @desc    Get user profile
// @route   GET /api/auth/profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select('name phone email address referralCode rewardPoints role createdAt');
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
exports.updateProfile = async (req, res) => {
    try {
        const { name, email, address } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { name, email, address },
            { new: true, runValidators: true }
        ).select('name phone email address referralCode rewardPoints');
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get referral info + referred users count
// @route   GET /api/auth/referral
exports.getReferralInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select('referralCode rewardPoints referredBy');
        const referredCount = await User.countDocuments({ referredBy: req.user._id });
        res.status(200).json({
            success: true,
            data: {
                referralCode: user.referralCode,
                rewardPoints: user.rewardPoints,
                referredCount,
                referredBy: user.referredBy
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get user's order history
// @route   GET /api/auth/orders
exports.getUserOrders = async (req, res) => {
    try {
        const orders = await DailyOrder.find({ userId: req.user._id })
            .sort({ date: -1 })
            .select('date planType selectedItem isSkipped deliveryStatus orderType createdAt');
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get user's subscriptions
// @route   GET /api/auth/subscriptions
exports.getUserSubscriptions = async (req, res) => {
    try {
        const subscriptions = await Subscription.find({ userId: req.user._id })
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: subscriptions });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get all users (admin)
// @route   GET /api/auth/admin/users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({})
            .select('name phone email address referralCode rewardPoints createdAt')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: users.length, data: users });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get all subscriptions (admin)
// @route   GET /api/auth/admin/subscriptions
exports.getAllSubscriptions = async (req, res) => {
    try {
        const subs = await Subscription.find()
            .populate('userId', 'name phone')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: subs.length, data: subs });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};