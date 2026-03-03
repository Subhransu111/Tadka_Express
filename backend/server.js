require('dotenv').config(); 

const express = require('express');
const connectDb = require('./config/db'); 

const app = express();

// 3. Call the connection
connectDb(); 

app.use(express.json());
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/subscriptions', require('./routes/subscriptionRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/banners', require('./routes/bannerRoutes'));
app.use('/api/menu', require('./routes/menuRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));