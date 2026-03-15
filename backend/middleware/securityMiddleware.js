const ratelimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');

const globalLimiter = ratelimit({
    windowMs: 15 * 60 * 1000,  
    max: 100, 
    message: 'Too many requests from this IP'
});

// Only for login route
const authLimiter = ratelimit({
    windowMs: 15 * 60 * 1000,   
    max: 10, // increased for testing
    message: { error: 'Too many login attempts from this IP' }
});

// Separate limiter for register
const registerLimiter = ratelimit({
    windowMs: 60 * 60 * 1000, // 1 hour  
    max: 20, // 20 registrations per hour per IP
    message: { error: 'Too many registration attempts' }
});

const corsOptions = cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://tadkaexpress.com', 'https://www.tadkaexpress.com'] 
        : ['http://localhost:3000', 'http://localhost:5173'], 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
    optionsSuccessStatus: 200
});

module.exports = { helmet, globalLimiter, authLimiter, registerLimiter, corsOptions };