import dotenv from 'dotenv';
dotenv.config();
export const env ={
    PORT : process.env.PORT,
    MONGO_URI : process.env.MONGO_URI,
    NODE_ENV : process.env.NODE_ENV,
    JWT_SECRET : process.env.JWT_SECRET,
    CLIENT_ID : process.env.CLIENT_ID,
    CLIENT_SECRET : process.env.CLIENT_SECRET,
    REFRESH_TOKEN : process.env.REFRESH_TOKEN,
    EMAIL_USER : process.env.EMAIL_USER,
}