const Subscription = require('../models/Subscription');
const DailyOrder = require('../models/DailyOrder');
const User = require('../models/user');

// @desc    Get high-level business stats
// @route   GET /api/analytics/dashboard
exports.getDashboardStats = async (req, res) => {
    try {
        // 1. Calculate Total Revenue from Active/Expired subscriptions
        const revenueData = await Subscription.aggregate([
            { $match: { status: 'active' } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);

        // 2. Count Active Users (Subscribed)
        const activeSubscribers = await Subscription.countDocuments({ status: 'active' });

        // 3. Count Total Registered Users
        const totalUsers = await User.countDocuments({ role: 'user' });

        // 4. Today's Skip Rate (For logistics efficiency)
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        const skippedToday = await DailyOrder.countDocuments({ date: today, isSkipped: true });

        res.status(200).json({
            success: true,
            data: {
                totalRevenue: revenueData[0]?.total || 0,
                activeSubscribers,
                totalUsers,
                skippedToday
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};