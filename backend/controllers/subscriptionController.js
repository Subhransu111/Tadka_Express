const Subscription = require('../models/Subscription')
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

async function createSubscription(req, res){
    try{
        const { planType , totalDays , startDate } = req.body

        if (totalDays < 15) {
            return res.status(400).json({ error: 'Total days must be at least 15' });
        }
        const pricePerDay = planType === 'basic' ? 90:130;
        const totalPrice = pricePerDay * totalDays;

        const options = {
            amount : totalPrice * 100,
            currency: 'INR',
            receipt: `receipt_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);

        const subscription = new Subscription({
            userId: req.user._id,
            planType,
            totalDays,
            startDate,
            pricePerDay,
            totalPrice,
            razorpayOrderId: order.id,
            status: 'pending_payment'

        });
         res.status(201).json({ subscription, order });
    }
    catch(error){
        res.status(500).json({ error: 'Failed to create subscription' });

    }
};

exports.createSubscription = createSubscription;