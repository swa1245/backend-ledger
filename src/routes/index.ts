import express from 'express';
import authRoutes from './auth.routes.js'

export const router = express.Router();

router.use('/auth',authRoutes)