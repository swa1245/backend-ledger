import jwt from "jsonwebtoken"
import { env } from "../config/env.js"
import type { Request, Response, NextFunction } from "express"
import { userModel } from "../models/user.model.js"

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authMiddleware = async (req:Request, res:Response, next:NextFunction) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" })
    }
    try {
        const decoded = jwt.verify(token, env.JWT_SECRET as string) as { id: string }
        const user = await userModel.findById(decoded.id)
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        req.user = user
        next()
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const systemUserAuthMiddleware = async (req:Request, res:Response, next:NextFunction) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" })
    }
    try {
        const decoded = jwt.verify(token, env.JWT_SECRET as string) as { id: string }
        const user = await userModel.findById(decoded.id).select("+SystemUser")
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        if (!user.SystemUser) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        req.user = user
        next()
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
