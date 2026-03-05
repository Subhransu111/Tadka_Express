const ratelimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');

// Rate Limiting Middleware
const globalLimiter = ratelimit({
    windowMs: 15 * 60 * 1000,  
    max: 100, 
    message: 'Too many requests from this IP'
});

const authLimiter = ratelimit({
    windowMs: 15 * 60 * 1000,   
    max: 5,
    message: 'Too many login attempts from this IP'
});

const corsOptions = cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://tadkaexpress.com', 'https://www.tadkaexpress.com'] 
        : ['http://localhost:3000', 'http://localhost:5173'], 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true, // Required for cookies or authorization headers
    optionsSuccessStatus: 200
});

module.exports = { helmet, globalLimiter, authLimiter, corsOptions };