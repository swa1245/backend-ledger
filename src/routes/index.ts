import express from 'express';
import authRoutes from './auth.routes.js'
import accountRoutes from './account.routes.js'

export const router = express.Router();

router.use('/auth',authRoutes)
router.use('/account',accountRoutes)