const DailyOrder = require('../models/DailyOrder');

// Helper to ensure date is always at midnight UTC
const normalizeDate = (date) => {
    const d = new Date(date);
    d.setUTCHours(0, 0, 0, 0);
    return d;
};

async function updateMealSection(req, res) {
    try {
        const { date, selectedItem, isSkipped, planType } = req.body;
        const targetDate = normalizeDate(date);

        const order = await DailyOrder.findOneAndUpdate(
            { 
                userId: req.user.id || req.user._id, 
                date: targetDate 
            },
            { 
                selectedItem, 
                planType, 
                isSkipped, 
                deliveryStatus: isSkipped ? 'skipped' : 'pending' 
            },
            { new: true, upsert: true }
        );

        res.status(200).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

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
        res.status(500).json({ 
            success: false, 
            message: "Error fetching upcoming deliveries", 
            error: error.message 
        });
    }
};

// @desc    Admin view: See only skipped meals for planning
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
      {
        $group: {
          _id: { plan: "$planType", item: "$selectedItem" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.plan": 1 } }
    ]);

    const formattedSummary = {
      date: req.params.date,
      basic: 0,
      deluxe: {},
      royal: {}
    };

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

exports.updateMealSection = updateMealSection;

