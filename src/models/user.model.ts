import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends mongoose.Document {
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(password: string): Promise<boolean>;
    SystemUser: boolean;
}

const userSchema = new mongoose.Schema<IUser>({
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        unique: true,
        lowercase: true,
        match: [/.+@.+\..+/, "Please enter a valid email address"]
    },
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minlength: [2, "Name must be at least 2 characters long"],
        maxlength: [50, "Name must be less than 50 characters long"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"]
    },
    SystemUser: {
        type: Boolean,
        default: false,
        immutable: true,
        select: false
    }
}, { timestamps: true });

userSchema.pre("save", async function (this: IUser) {
    if (!this.isModified("password")) {
        return;
    }
    const hash = await bcrypt.hash(this.password as string, 10);
    this.password = hash;
    return;
})

userSchema.methods.comparePassword = async function (this: IUser, password: string) {
    return await bcrypt.compare(password, this.password as string);
}

export const userModel = mongoose.model<IUser>("User", userSchema);