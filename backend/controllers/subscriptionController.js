const Subscription = require('../models/Subscription')
const Razorpay = require('razorpay');
const crypto = require('crypto')

/*const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});
*/

async function createSubscription(req, res){
    try{
        const { planType , totalDays , startDate } = req.body

        // Validate required fields
        if (!planType || !totalDays || !startDate) {
            return res.status(400).json({ 
                error: 'Missing required fields: planType, totalDays, startDate' 
            });
        }

        // Validate plan type
        if (!['basic', 'deluxe'].includes(planType)) {
            return res.status(400).json({ 
                error: 'Invalid planType. Must be "basic" or "deluxe"' 
            });
        }

        // Validate total days
        if (totalDays < 15) {
            return res.status(400).json({ error: 'Total days must be at least 15' });
        }

        // Parse and validate start date
        const parsedStartDate = new Date(startDate);
        
        
        if (isNaN(parsedStartDate.getTime())) {
            return res.status(400).json({ 
                error: 'Invalid startDate format. Use ISO format (e.g., 2026-03-04)' 
            });
        }

        const pricePerDay = planType === 'basic' ? 90:130;
        const totalPrice = pricePerDay * totalDays;

        const options = {
            amount : totalPrice * 100,
            currency: 'INR',
            receipt: `receipt_${Date.now()}`
        };

        const mockOrder = {
            id: `fake_order_${Date.now()}`,
            amount: totalPrice * 100,
            currency: 'INR'
        };

        // TODO: Integrate real Razorpay payment when service is active

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
    }
    catch(error){
        
        res.status(500).json({ 
            error: 'Failed to create subscription',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });

    }
};

exports.createSubscription = createSubscription;

// @desc    Cancel subscription (Stop future service)
// @route   PUT /api/subscriptions/cancel/:id
exports.cancelSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findById(req.params.id);

        if (!subscription) {
            return res.status(404).json({ success: false, message: "Subscription not found" });
        }

        // Verify ownership 
        if (subscription.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ success: false, message: "Not authorized" });
        }

        // Update status
        subscription.status = 'cancelled';
        await subscription.save();

        res.status(200).json({ 
            success: true, 
            message: "Subscription cancelled. Access will remain until the 15 days are completed." 
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

async function verifyPayment(req,res) {
        const {razorpay_order_id , razorpay_payment_id , razorpay_signature} = req.body

        const dataToVerify = razorpay_order_id + "|" + razorpay_payment_id;
        const generated_signature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET) // Use the "Secret Sauce"
        .update(dataToVerify.toString())
        .digest("hex");

    if (generated_signature === razorpay_signature) {
        const subscription = await Subscription.findOneAndUpdate(
            { razorpayOrderId: razorpay_order_id },
            { status: 'active' },
            { new: true }
        );
        res.status(200).json({ success: true, message: "Verification Successful", subscription });
    } else {
        res.status(400).json({ success: false, message: "Signature mismatch! Possible fraud detected." });
    }
}

exports.verifyPayment = verifyPayment;
        


    