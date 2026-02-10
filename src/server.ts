import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';

const PORT = env.PORT || 3000;

const startServer = async()=>{
    await connectDB();
    app.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`);
    })
}

startServer();
