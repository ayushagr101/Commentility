import mongoose from "mongoose";

export const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error("MONGO_URI is not defined in environment variables");
  }

  try {
    const connection = await mongoose.connect(uri, {
      dbName: process.env.DB_NAME || undefined,
    });

    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error", error);
    process.exit(1);
  }
};
