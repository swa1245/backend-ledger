import type { Request, Response } from "express";
import { accountModel } from "../models/acccount.model.js";
import { Transaction } from "../models/transcation.mode.js";
import mongoose from "mongoose";
import { Ledger } from "../models/ledger.model.js";
import { sendTransactionEmail } from "../services/email.service.js";
import type { IUser } from "../models/user.model.js";


export const createTransaction = async (req: Request, res: Response) => {
    try {
        const { fromAccount, toAccount, amount, idempotencyKey } = req.body;
        if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
            return res.status(400).json({ message: "All fields are required" })
        }

        // Populate 'user' to get email address for notifications
        const fromUserAccount = await accountModel.findOne({ _id: fromAccount }).populate("user");
        const toUserAccount = await accountModel.findOne({ _id: toAccount }).populate("user");

        if (!fromUserAccount || !toUserAccount) {
            return res.status(400).json({ message: "Invalid account" })
        }

        const isTransactionAlreadyExist = await Transaction.findOne({
            idempotencyKey
        })
        if (isTransactionAlreadyExist) {
            if (isTransactionAlreadyExist.status === "completed") {
                return res.status(200).json({ message: "Transaction already completed" })
            }
            if (isTransactionAlreadyExist.status === "failed") {
                return res.status(400).json({ message: "Transaction already failed" })
            }
            if (isTransactionAlreadyExist.status === "reversed") {
                return res.status(200).json({ message: "Transaction already reversed" })
            }
        }

        if (fromUserAccount.status !== "active" || toUserAccount.status !== "active") {
            return res.status(400).json({ message: "Account is not active" })
        }

        const balance = await fromUserAccount.getBalance()
        if (balance < amount) {
            return res.status(400).json({ message: `Insufficient balance current balance is ${balance} and amount is ${amount}` })
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const result = await Transaction.create([{
                fromAccount,
                toAccount,
                amount,
                idempotencyKey,
                status: "pending"
            }], { session })
            const transaction = result[0];

            if (!transaction) {
                throw new Error("Failed to create transaction");
            }

            await Ledger.create([{
                account: toAccount,
                amount,
                type: "credit",
                transaction: transaction._id as mongoose.Types.ObjectId,
            }], { session })

            await Ledger.create([{
                account: fromAccount,
                amount,
                type: "debit",
                transaction: transaction._id as mongoose.Types.ObjectId,
            }], { session })

            transaction.status = "completed"
            await transaction.save({ session })

            await session.commitTransaction();
            session.endSession();

            // Extract emails from populated user objects
            const toEmail = (toUserAccount.user as IUser).email;
            const fromEmail = (fromUserAccount.user as IUser).email;

            await sendTransactionEmail(toEmail, toUserAccount.name, amount, "credit", toAccount, fromAccount)
            await sendTransactionEmail(fromEmail, fromUserAccount.name, amount, "debit", toAccount, fromAccount)

            return res.status(200).json({ message: "Transaction completed successfully" })
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const systemInitialFunds = async (req: Request, res: Response) => {
    try {
        const { toAccount, amount,idempotencyKey } = req.body
        if (!toAccount || !amount || !idempotencyKey) {
            return res.status(400).json({ message: "All fields are required" })
        }
        const account = await accountModel.findOne({ _id: toAccount })
        if (!account) {
            return res.status(400).json({ message: "Account not found" })
        }
        const balance = await account.getBalance()
        if (balance > 0) {
            return res.status(400).json({ message: "Account already has balance" })
        }
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            await Ledger.create({
                account:toAccount,
                amount,
                type: "credit",
                transaction: null,
            }, { session })
            await session.commitTransaction();
            session.endSession();
            return res.status(200).json({ message: "Initial funds added successfully" })
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" })
    }
}

