import { Router } from "express";
import { createTranscation } from "../controllers/transaction.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/",authMiddleware,createTranscation)



export default router;