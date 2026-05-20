import mongoose from "mongoose";

declare global {
  var _mongooseConnectPromise: Promise<void> | undefined;
}

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;

  if (!global._mongooseConnectPromise) {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
      throw new Error("Please define the MONGODB_URI environment variable");
    }

    global._mongooseConnectPromise = mongoose
      .connect(MONGODB_URI)
      .then(() => {
        console.log("MongoDB successfully connected");
      })
      .catch((error) => {
        global._mongooseConnectPromise = undefined;
        console.error("MongoDB connection error:", error);
        throw error;
      });
  }

  await global._mongooseConnectPromise;
};
