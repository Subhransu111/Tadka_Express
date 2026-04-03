const Subscription = require('../models/Subscription');
const Settings = require('../models/Settings');
const Razorpay = require('razorpay');
const crypto = require('crypto');

async function createSubscription(req, res) {
    try {
        const { planType, totalDays, startDate } = req.body;

        if (!planType || !totalDays || !startDate) {
            return res.status(400).json({ error: 'Missing required fields: planType, totalDays, startDate' });
        }

        if (!['basic', 'deluxe', 'royal'].includes(planType)) {
            return res.status(400).json({ error: 'Invalid planType. Must be "basic", "deluxe" or "royal"' });
        }

        if (totalDays < 15) {
            return res.status(400).json({ error: 'Total days must be at least 15' });
        }

        const parsedStartDate = new Date(startDate);
        if (isNaN(parsedStartDate.getTime())) {
            return res.status(400).json({ error: 'Invalid startDate format.' });
        }

        // Fetch live pricing from Settings
        let settings = await Settings.findOne();
        if (!settings) settings = await Settings.create({});

        const pricing = settings.pricing || {};

            const pricePerDay =
            planType === 'basic'   ? (pricing.basicPerDay  || 90)  :
            planType === 'deluxe'  ? (pricing.deluxePerDay || 130) :
            /* royal */              (pricing.royalMin     || 140);

        const totalPrice = pricePerDay * totalDays;

        const mockOrder = {
            id: `fake_order_${Date.now()}`,
            amount: totalPrice * 100,
            currency: 'INR'
        };

        const subscription = await Subscription.create({
            userId: req.user._id,
            planType,
            totalDays,
            startDate: parsedStartDate,
            pricePerDay,
            totalPrice,
            razorpayOrderId: mockOrder.id,
            status: 'pending_payment'
        });

        res.status(201).json({ subscription, order: mockOrder });
    } catch (error) {
        res.status(500).json({
            error: 'Failed to create subscription',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

exports.createSubscription = createSubscription;

exports.cancelSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findById(req.params.id);
        if (!subscription) return res.status(404).json({ success: false, message: 'Subscription not found' });
        if (subscription.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }
        subscription.status = 'cancelled';
        await subscription.save();
        res.status(200).json({ success: true, message: 'Subscription cancelled.' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

async function verifyPayment(req, res) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const dataToVerify = razorpay_order_id + '|' + razorpay_payment_id;
    const generated_signature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'dev_secret')
        .update(dataToVerify.toString())
        .digest('hex');

    if (generated_signature === razorpay_signature) {
        const subscription = await Subscription.findOneAndUpdate(
            { razorpayOrderId: razorpay_order_id },
            { status: 'active' },
            { new: true }
        );
        res.status(200).json({ success: true, message: 'Verification Successful', subscription });
    } else {
        res.status(400).json({ success: false, message: 'Signature mismatch!' });
    }
}

exports.verifyPayment = verifyPayment;

exports.getAllSubscriptions = async (req, res) => {
    try {
        const subscriptions = await Subscription.find().populate('userId', 'name email phone');
        res.status(200).json({ success: true, data: subscriptions });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};