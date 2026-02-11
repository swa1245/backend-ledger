import mongoose from "mongoose";

interface Account extends mongoose.Document {
    user: mongoose.Schema.Types.ObjectId;
    status: "active" | "frozen" | "closed";
    currency: string;  
    createdAt: Date;
    updatedAt: Date;
}

const accountSchema =  new mongoose.Schema<Account>({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true,"account must be associated with a user"],
        index: true
    },
    status:{
        type: String,
        enum: ["active", "frozen","closed"],
        message: "status can be active, frozen or closed"
    },
    currency:{
        type: String,
        default: "INR",
        required: [true,"currency is required"]
    }
}, {timestamps: true})

// compound index
accountSchema.index({ user: 1 , status: 1 })

export const accountModel = mongoose.model<Account>("Account", accountSchema)
