import mongoose from "mongoose";

export interface ITransaction extends mongoose.Document {
    fromAccount: mongoose.Types.ObjectId;
    toAccount: mongoose.Types.ObjectId;
    status: "pending" | "completed" | "failed" | "reversed";
    amount: number;
    idempotencyKey: string;
    createdAt: Date;
    updatedAt: Date;
}

const transactionSchema = new mongoose.Schema<ITransaction>({
    fromAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: [true, "fromAccount is required"],
        index: true
    },
    toAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: [true, "toAccount is required"],
        index: true
    },
    status: {
        type: String,
        enum: ["pending", "completed", "failed", "reversed"],
        default: "pending"
    },
    amount: {
        type: Number,
        required: [true, "amount is required"],
        min: [0, "amount must be greater than 0"]
    },
    idempotencyKey: {
        type: String,
        required: [true, "idempotencyKey is required"],
        unique: true
    }
}, { timestamps: true })


export const Transaction = mongoose.model<ITransaction>("Transaction", transactionSchema);
