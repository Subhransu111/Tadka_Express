// 1. THIS MUST BE LINE 1
require('dotenv').config(); 

const express = require('express');
// 2. Import the DB config AFTER dotenv
const connectDb = require('./config/db'); 

const app = express();

// 3. Call the connection
connectDb(); 

app.use(express.json());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));