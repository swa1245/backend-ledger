import { Router } from "express";
import { createTransaction } from "../controllers/transaction.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", authMiddleware, createTransaction)

router.get("/system/inital-funds",)

export default router;