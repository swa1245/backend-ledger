import mongoose from "mongoose";

interface Transcation extends Document {
    fromAccount: mongoose.Schema.Types.ObjectId;
    toAccount: mongoose.Schema.Types.ObjectId;
    status: "pending" | "completed" | "failed"|"reversed";
    amount: number;
    idempotencyKey:string;
    createdAt:Date;
    updatedAt:Date;
}

const transcationSchema = new mongoose.Schema<Transcation>({
    fromAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: [true,"fromAccount is required"],
        index:true
    },
    toAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: [true,"toAccount is required"],
        index:true
    },
    status: {
        type: String,
        enum: ["pending", "completed", "failed","reversed"],
        default: "pending"
    },
    amount: {
        type: Number,
        required: [true,"amount is required"],
        min: [0,"amount must be greater than 0"]
    },
    idempotencyKey: {
        type: String,
        required: [true,"idempotencyKey is required"],
        unique: true
    }
},{timestamps:true})


export const Transcation = mongoose.model<Transcation>("Transcation", transcationSchema);
