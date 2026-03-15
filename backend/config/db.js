const mongoose = require('mongoose');

const connectDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('MongoDB connection error:', error);
        setTimeout(connectDb, 5000); // ← retry instead of crash
    }
};

mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB connection lost. Attempting to reconnect...');
    setTimeout(connectDb, 5000);
});

mongoose.connection.on('error', (err) => {
    console.error(`MongoDB Connection Error: ${err}`);
});

module.exports = connectDb;