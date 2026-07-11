import mongoose from "mongoose";

let cached: typeof mongoose | null = null;

const connectDB = async (): Promise<void> => {
  if (cached) return;
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI!);
    cached = conn;
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

export default connectDB;
