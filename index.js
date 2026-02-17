const express = require('express');
const connectDb = require('./config/database');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/authRoutes.js');

const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());


const port = process.env.PORT || 5000;

app.use('/api/auth' , authRouter);


connectDb().then(() => {
    app.listen(port , () => {
        console.log(`Server is running on port ${port}`);
    })
}).catch((error) => {
    console.error('Database connection error:', error);
    process.exit(1);
});