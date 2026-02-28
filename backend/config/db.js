const mongoose = require('mongoose')

const connectDb = async() => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    }
    catch(error){
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }

};

mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB connection lost. Attempting to reconnect...');
});
mongoose.connection.on('error', (err) => {
  console.error(`Ì€ MongoDB Connection Error: ${err}`);
});

module.exports = connectDb;