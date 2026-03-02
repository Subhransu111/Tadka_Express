const Menu = require('../models/Menu');

/**
 * @desc    Add a new item to the menu (Basic, Deluxe, or Royal)
 * @route   POST /api/menu
 * @access  Admin Only
 */
async function addMenuItem(req,res) {
    try{
        const { planType , itemName , components , price , availableDays , optionNumber } = req.body

        if(!planType || !itemName || !components || components.length === 0 || !availableDays || availableDays.length === 0){
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const menuitem = await Menu.create({
            planType,
            itemName,
            components,
            price,
            availableDays,
            optionNumber
        })
        res.status(201).json({ success: true, menuitem });
        

    }
    catch(error){
        res.status(500).json({ success:false , error: error.message });
    }
}

exports.addMenuItem = addMenuItem;

/**
 * @desc    Get all active menu items for a specific plan
 * @route   GET /api/menu/:planType
 * @access  Public/User
 */

async function getMenuByPlan(req,res){
    try{
        const { planType } = req.params

        const menuItems = await Menu.find({ planType, isAvailable: true }).sort({ optionNumber: 1 });

        res.status(200).json({ success: true, count: menuItems.length, data: menuItems });

    }
    catch(error){
        res.status(500).json({ success:false , error: error.message });
    }
};

exports.getMenuByPlan = getMenuByPlan;


/**
 * @desc    Toggle availability or update meal details
 * @route   PUT /api/menu/:id
 * @access  Admin Only
 */

async function updateMenuItem(req, res) {
    try {
        const menuItem = await Menu.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        );

        if (!menuItem) {
            return res.status(404).json({ success: false, error: 'Item not found' });
        }

        res.status(200).json({ success: true, data: menuItem });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

exports.updateMenuItem = updateMenuItem;

/**
 * @desc    Delete a menu item
 * @route   DELETE /api/menu/:id
 * @access  Admin Only
 */

async function deleteMenuItem (req,res){
    try{
        const menuItem = await Menu.findByIdAndDelete(req.params.id);
        if(!menuItem){
            return res.status(404).json({ success: false, error: 'Menu item not found' });
        }
        res.status(200).json({ success: true, message: 'Menu item deleted successfully' });

    }
    catch(error){
        res.status(500).json({ success:false , error: error.message });
    }
}

exports.deleteMenuItem = deleteMenuItem;

