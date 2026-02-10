import mongoose from "mongoose";
import bcrypt from "bcryptjs";

interface User extends Document{
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new mongoose.Schema<User>({
    email:{
        type: String,
        required: [true, "Email is required"],
        trim: true,
        unique: [true, "Email already exists"],
        lowercase: true,
        match: [/.+@.+\..+/, "Please enter a valid email address"]
    },
    name:{
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minlength: [2, "Name must be at least 2 characters long"],
        maxlength: [50, "Name must be less than 50 characters long"]
    },
    password:{
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"]
    },
}, { timestamps: true });

userSchema.pre("save",async function(next: any){
    if(!this.isModified("password")){
        return next();
    }
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    return next();
})

userSchema.methods.comparePassword = async function(password: string){
    return await bcrypt.compare(password, this.password);
}

export const userModel = mongoose.model<User>("User", userSchema);