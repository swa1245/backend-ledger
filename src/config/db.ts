import mongoose from "mongoose";
import { env } from "./env.js";

export const connectDB = async () :Promise<void> => {
  try {
    await mongoose.connect(env.MONGO_URI as string);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
