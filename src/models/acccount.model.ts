import mongoose from "mongoose";
import { Ledger } from "./ledger.model.js";
import type { IUser } from "./user.model.js";

export interface IAccount extends mongoose.Document {
    user: mongoose.Types.ObjectId | IUser;
    name: string;
    status: "active" | "frozen" | "closed";
    currency: string;
    createdAt: Date;
    updatedAt: Date;
    getBalance(): Promise<number>;
}

const accountSchema = new mongoose.Schema<IAccount>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "account must be associated with a user"],
        index: true
    },
    name: {
        type: String,
        required: [true, "account name is required"]
    },
    status: {
        type: String,
        enum: ["active", "frozen", "closed"],
        default: "active"
    },
    currency: {
        type: String,
        default: "INR",
        required: [true, "currency is required"]
    }
}, { timestamps: true })

// compound index
accountSchema.index({ user: 1, status: 1 })

accountSchema.methods.getBalance = async function (this: IAccount) {
    const balanceData = await Ledger.aggregate([
        {
            $match: {
                account: this._id
            }
        },
        {
            $group: {
                _id: null,
                totalDebit: {
                    $sum: {
                        $cond: [
                            { $eq: ["$type", "debit"] },
                            "$amount",
                            0
                        ]
                    }
                },
                totalCredited: {
                    $sum: {
                        $cond: [
                            { $eq: ["$type", "credit"] },
                            "$amount",
                            0
                        ]
                    }
                }
            }
        }
    ])

    if (balanceData.length == 0) {
        return 0
    }
    return (balanceData[0].totalCredited || 0) - (balanceData[0].totalDebit || 0)
}

export const accountModel = mongoose.model<IAccount>("Account", accountSchema)
