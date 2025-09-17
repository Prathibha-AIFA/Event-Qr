import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";
    const dbName = process.env.DB_NAME || "tech_event_dev";

    await mongoose.connect(uri, { dbName });

    console.log(`[INFO] MongoDB connected: ${uri}/${dbName}`);
  } catch (err) {
    console.error("[ERROR] MongoDB connection error:", err);
    process.exit(1);
  }
};
