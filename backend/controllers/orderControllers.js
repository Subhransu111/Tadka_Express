const DailyOrder = require('../models/DailyOrder');
const Subscription = require('../models/Subscription');

const normalizeDate = (date) => {
    const d = new Date(date);
    d.setUTCHours(0, 0, 0, 0);
    return d;
};

// @desc    User selects or skips meal for a specific date
// @route   PATCH /api/orders/select-meal
exports.updateMealSection = async (req, res) => {
    try {
        const { date, selectedItem, isSkipped, planType } = req.body;
        const userId = req.user.id || req.user._id;
        const targetDate = normalizeDate(date);

        // Get active subscription
        const subscription = await Subscription.findOne({
            userId,
            status: 'active',
            endDate: { $gte: new Date() }
        });

        if (!subscription) {
            return res.status(400).json({ success: false, error: 'No active subscription found' });
        }

        // Check admin-configured window for changes (for next-day changes only)
        // Pre-order during subscription setup always allowed

        // If skipping — enforce skip limit
        if (isSkipped) {
            // Check existing skip for this date (don't double count)
            const existingOrder = await DailyOrder.findOne({ userId, date: targetDate });
            const wasAlreadySkipped = existingOrder?.isSkipped === true;

            if (!wasAlreadySkipped) {
                // Check skip limit
                if (subscription.skipCount >= 2) {
                    return res.status(400).json({
                        success: false,
                        error: 'Skip limit reached. You can only skip 2 meals per subscription period.',
                        skipCount: subscription.skipCount,
                        maxSkips: 2
                    });
                }
                // Increment skip count
                await Subscription.findByIdAndUpdate(subscription._id, {
                    $inc: { skipCount: 1 }
                });
            }

            // If un-skipping (changing back from skip), decrement
            if (wasAlreadySkipped && !isSkipped) {
                await Subscription.findByIdAndUpdate(subscription._id, {
                    $inc: { skipCount: -1 }
                });
            }
        } else if (!isSkipped) {
            // If previously skipped and now unSkipping
            const existingOrder = await DailyOrder.findOne({ userId, date: targetDate });
            if (existingOrder?.isSkipped) {
                await Subscription.findByIdAndUpdate(subscription._id, {
                    $inc: { skipCount: -1 }
                });
            }
        }

        const order = await DailyOrder.findOneAndUpdate(
            { userId, date: targetDate },
            {
                selectedItem: isSkipped ? 'skipped' : (selectedItem || 'chef_choice'),
                planType: planType || subscription.planType,
                isSkipped,
                orderType: 'subscription',
                deliveryStatus: isSkipped ? 'skipped' : 'pending'
            },
            { new: true, upsert: true }
        );

        // Return updated skip count
        const updatedSub = await Subscription.findById(subscription._id).select('skipCount');

        res.status(200).json({
            success: true,
            order,
            skipCount: updatedSub.skipCount,
            skipsRemaining: 2 - updatedSub.skipCount
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get user's upcoming meal (tomorrow's order)
// @route   GET /api/orders/upcoming
exports.getUpcomingMeal = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        const tomorrow = normalizeDate(new Date(Date.now() + 86400000));

        const order = await DailyOrder.findOne({ userId, date: tomorrow });
        const subscription = await Subscription.findOne({
            userId,
            status: 'active',
            endDate: { $gte: new Date() }
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: {
                order,
                subscription,
                skipCount: subscription?.skipCount || 0,
                skipsRemaining: Math.max(0, 2 - (subscription?.skipCount || 0))
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Admin: Get delivery list for a date
exports.getAdminDeliveryList = async (req, res) => {
    try {
        const queryDate = normalizeDate(req.params.date);
        const orders = await DailyOrder.find({ date: queryDate })
            .populate('userId', 'name phone address')
            .select('planType selectedItem isSkipped deliveryStatus')
            .sort({ planType: 1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            date: queryDate.toISOString().split('T')[0],
            data: orders
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getSkippedMeals = async (req, res) => {
    try {
        const queryDate = normalizeDate(req.params.date);
        const skipped = await DailyOrder.find({ date: queryDate, isSkipped: true })
            .populate('userId', 'name phone');
        res.status(200).json({ success: true, count: skipped.length, data: skipped });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getKitchenSummary = async (req, res) => {
    try {
        const queryDate = normalizeDate(req.params.date);
        const summary = await DailyOrder.aggregate([
            { $match: { date: queryDate, isSkipped: false } },
            { $group: { _id: { plan: "$planType", item: "$selectedItem" }, count: { $sum: 1 } } },
            { $sort: { "_id.plan": 1 } }
        ]);

        const formattedSummary = { date: req.params.date, basic: 0, deluxe: {}, royal: {} };
        summary.forEach(group => {
            const { plan, item } = group._id;
            if (plan === 'basic') formattedSummary.basic = group.count;
            if (plan === 'deluxe') formattedSummary.deluxe[item] = group.count;
            if (plan === 'royal') formattedSummary.royal[item] = group.count;
        });

        res.status(200).json({ success: true, data: formattedSummary });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};