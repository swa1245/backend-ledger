import type { Request, Response } from "express"
import { accountModel } from "../models/acccount.model.js";

export const createAccount = async (req: Request, res: Response) => {
    try {
        const user = req.user
        const account = await accountModel.create({
            user: user._id
        })
        return res.status(201).json({ account })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}