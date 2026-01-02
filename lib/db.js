import mongoose from "mongoose";
import dotenv from "dotenv";

// 1. Load environment variables (so process.env.MONGODB_URI works)
dotenv.config();

const connectDB = async () => {
  try {
    // 2. Simple connection (No cache logic needed)
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Error: ${error.message}`);
    process.exit(1); // Stop the server if DB fails
  }
};

export default connectDB;