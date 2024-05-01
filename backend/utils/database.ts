import mongoose from "mongoose";
import "colors";

let databaseConnected: boolean = false;

export const connectToDatabase = async () => {
  mongoose.set("strictQuery", true);
  try {
    const res = await mongoose.connect(process.env.MONGO_URI!);
    databaseConnected = true;
    console.log(`MongoDB connected: ${res.connection.host}`.bgCyan.bold);
  } catch (error: any) {
    console.error(`Error: ${error.message}`.red);
    process.exit(1);
  }
};
