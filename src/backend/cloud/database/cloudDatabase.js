import mongoose from "mongoose";
import * as dotenv from 'dotenv';

// Ensure dotenv is configured immediately
dotenv.config(); 

// FIX: Removed ": string" type annotation here
const getURI = (dbName) => 
  `${process.env.MONGODB_URI}/${dbName}?retryWrites=true&w=majority`;

export async function connectToDatabase(cloudId) {
    // 1. Check if already connected
    if (mongoose.connection.readyState === 1) {
      console.log("Already connected to MongoDB.");
      return { success: true, message: "Already connected" };
    }

    // 2. Logic: Use cloudId if passed, otherwise env var, otherwise 'test'
    const dbName = cloudId || process.env.MONGODB_DB_NAME || 'test';
    const uri = getURI(dbName);

    console.log(`Connecting to DB: ${dbName}...`);

    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000
      });
      console.log(`Mongo DB Connected: ${conn.connection.host}`);
      return { success: true, message: "Connection Established Successfully" };
    } catch (error) {
      console.error("Error connecting to MongoDB Atlas:", error);
      throw { success: false, message: "Connection failed", error };
    }
}