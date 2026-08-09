import mongoose from "mongoose";
import dns from "node:dns";
import "dotenv/config"; // this loads .env automatically

// 1. Force Google DNS to bypass ISP block on MongoDB SRV
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async () => {
  // 2. Event listeners
  mongoose.connection.on("connected", () => {
    console.log("MongoDB connected successfully");
  });

  mongoose.connection.on("error", (err) => {
    console.error(`MongoDB connection error: ${err.message}`);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected");
  });

  // 3. Connect
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error(
        "MONGODB_URI is not defined in your environment variables",
      );
    }

    await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    console.error("Initial MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
