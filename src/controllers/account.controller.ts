import type { Request, Response } from "express"

export const createAccount = async (req: Request, res: Response) => {
    try {
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}