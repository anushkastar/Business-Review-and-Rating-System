const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const URL = process.env.MONGO_URI;
console.log('MongoDB URI:', URL);

const connectDb = async () => {
    try{
        await mongoose.connect(URL);
        console.log('Database connected successfully');
    }
    catch(err) {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1);
    }
}
module.exports = connectDb;