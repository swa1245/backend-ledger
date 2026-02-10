import express from 'express';
import { appConfig } from './config/apiConfig.js';
import { router } from './routes/index.js';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json())
app.use(cookieParser())


app.use(appConfig.API_VERSION,router)

export default app;