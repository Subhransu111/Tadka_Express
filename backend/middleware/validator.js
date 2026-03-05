const { body, validationResult } = require('express-validator');

const validate = (req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }   
    next();

};

const validateRegister =[
    body('name').notEmpty().withMessage('Name is required').trim(),
    body('phone').matches(/^[6-9]\d{9}$/).withMessage('Valid 10-digit phone required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
                    .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
                    .matches(/[0-9]/).withMessage('Password must contain a number')
                    .matches(/[!@#$%^&*]/).withMessage('Password must contain a special character'),
    validate
];

const validateLogin = [
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('password').notEmpty().withMessage('Password is required'),
    validate
];

const validateSubscription = [
    body('planType').isIn(['basic', 'deluxe', 'royal']).withMessage('Invalid plan type'),
    body('totalDays').isInt({ min: 15 }).withMessage('Minimum subscription is 15 days'),
    body('startDate').isISO8601().withMessage('Valid start date is required'),
    validate
];

module.exports = { validateRegister, validateLogin, validateSubscription };