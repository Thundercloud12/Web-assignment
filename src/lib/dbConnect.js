import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URL) {
  throw new Error("Please define MONGODB_URL in your environment variables");
}

// Use global object to cache connection across hot reloads in dev
const globalWithMongoose = global._mongoose || { conn: null, promise: null };
global._mongoose = globalWithMongoose; // persist in global scope

export async function connectDb() {
  if (globalWithMongoose.conn) return globalWithMongoose.conn;

  if (!globalWithMongoose.promise) {
    globalWithMongoose.promise = mongoose.connect(MONGODB_URL, {
      bufferCommands: false,
      maxPoolSize: 10,
    }).then(() => mongoose.connection);
  }

  try {
    globalWithMongoose.conn = await globalWithMongoose.promise;
  } catch (err) {
    console.error("MONGODB connection error:", err);
    globalWithMongoose.promise = null;
    throw new Error("MongoDB connection failed");
  }

  return globalWithMongoose.conn;
}
