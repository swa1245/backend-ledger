import type { Request, Response } from "express";
import { accountModel } from "../models/acccount.model.js";


export const createTranscation = async (req:Request,res:Response)=>{
    try {
        const {fromAccount,toAccount,amount,idempotencyKey} = req.body;
        if(!fromAccount || !toAccount || !amount || !idempotencyKey){
            return res.status(400).json({message:"All fields are required"})
        }
        const fromUserAccount = await accountModel.findOne({
            _id:fromAccount
        })
        const toUserAccount = await accountModel.findOne({
            _id:toAccount
        })
        if(!fromUserAccount || !toUserAccount){
            return res.status(400).json({message:"Invalid account"})
        }
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal server error"})
    }
}