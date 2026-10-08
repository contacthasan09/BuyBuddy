import mongoose from "mongoose";
import { env } from "./env";
import { logger } from "../utils/logger";

export async function connectDB(): Promise<void> {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(env.MONGODB_URI);
    logger.info(`✅ MongoDB connected: ${mongoose.connection.name}`);
  } catch (err) {
    logger.error({ err }, "❌ MongoDB connection failed");
    process.exit(1);
  }

  mongoose.connection.on("disconnected", () => {
    logger.warn("⚠️  MongoDB disconnected");
  });
  mongoose.connection.on("error", (err) => {
    logger.error({ err }, "MongoDB error");
  });
}