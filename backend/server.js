require('dotenv').config(); 
const { helmet, globalLimiter, authLimiter, registerLimiter, corsOptions } = require('./middleware/securityMiddleware');
const express = require('express');
const connectDb = require('./config/db'); 

const app = express();
app.use(corsOptions);
app.use(helmet());

if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        if (req.header('x-forwarded-proto') !== 'https') {
            res.redirect(`https://${req.header('host')}${req.url}`);
        } else {
            next();
        }
    });
}

app.use('/api', globalLimiter);
app.use(express.json({ limit: '10kb' }));

connectDb(); 

const authRoutes = require('./routes/authRoutes');

// ← Apply limiters to specific routes, not entire /api/auth
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', registerLimiter);
app.use('/api/auth', authRoutes);

app.use('/api/subscriptions', require('./routes/subscriptionRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/banners', require('./routes/bannerRoutes'));
app.use('/api/menu', require('./routes/menuRoutes'));
app.use('/api/analytics', require('./routes/Analyticsroutes'));
app.use('/api/settings', require('./routes/Settingsroutes'));

app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message;
    res.status(status).json({ error: message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));