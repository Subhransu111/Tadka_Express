const jwt = require('jsonwebtoken');
const User = require('../models/user');

const protect = async (req, res, next) => {
    let token;

    // 1. Check if the token is sent in the headers (Bearer Token)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header: "Bearer <token>"
            token = req.headers.authorization.split(' ')[1];

            // 2. Verify the token using your JWT_SECRET
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. Attach the user data (except password) to the request object
            req.user = await User.findById(decoded.id).select('-passwordHash');

            next(); // Move to the controller
        } catch (error) {
            console.error(error);
            res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
};

// Middleware to restrict access to Admins only
const admin = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'superadmin')) {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Not authorized as an admin' });
    }
};

const superadmin = (req, res, next) => {
    if (req.user && req.user.role === 'superadmin') {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Not authorized as superadmin' });
    }
};

module.exports = { protect, admin, superadmin };