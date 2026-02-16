import mongoose from "mongoose";

export interface ILedger extends mongoose.Document {
    account: mongoose.Types.ObjectId;
    amount: number;
    transaction: mongoose.Types.ObjectId;
    type: "credit" | "debit";
    createdAt: Date;
    updatedAt: Date;
}

const ledgerSchema = new mongoose.Schema<ILedger>({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: [true, "account is required"],
        index: true,
        immutable: true
    },
    amount: {
        type: Number,
        required: [true, "amount is required"],
        min: [0, "amount must be greater than 0"],
        immutable: true
    },
    transaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
        required: [true, "transaction is required"],
        index: true,
        immutable: true
    },
    type: {
        type: String,
        enum: ["credit", "debit"],
        required: [true, "type is required"],
        immutable: true
    }
}, { timestamps: true })

function preventLedgerModifictaion() {
    throw new Error("Ledger cannot be modified");
}

ledgerSchema.pre("findOneAndUpdate", preventLedgerModifictaion);
ledgerSchema.pre("updateOne", preventLedgerModifictaion);
ledgerSchema.pre("deleteOne", preventLedgerModifictaion);
ledgerSchema.pre("deleteMany", preventLedgerModifictaion);
ledgerSchema.pre("updateMany", preventLedgerModifictaion);
ledgerSchema.pre("findOneAndDelete", preventLedgerModifictaion);
ledgerSchema.pre("findOneAndReplace", preventLedgerModifictaion);


export const Ledger = mongoose.model<ILedger>("Ledger", ledgerSchema);