import mongoose from "mongoose";
import { env } from "./env";

async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(env.MONGO_URI);

    console.log("Connected to Database");
  } catch (err) {
    console.error("Database connection error: ", err);
    process.exit(1);
  }
}

export default connectDB;
