const Settings = require('../models/Settings');

// @desc    Get global system settings
// @route   GET /api/settings

async function getSettings(req, res) {
    try{
        let settings = await Settings.findOne();
        if(!settings){
            settings = await Settings.create({});
        }
        res.status(200).json({ success: true, settings });
    }
    catch(error){
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Update WhatsApp timing or Pricing
// @route   PUT /api/settings
exports.updateSettings = async (req, res) => {
    try {
        const settings = await Settings.findOneAndUpdate({}, req.body, {
            new: true,
            upsert: true,
            runValidators: true
        });
        res.status(200).json({ success: true, data: settings });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};