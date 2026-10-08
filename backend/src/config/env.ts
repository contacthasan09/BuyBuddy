import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(5000),

  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),

  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 chars"),
  JWT_EXPIRES_IN: z.string().default("7d"),

  ADMIN_SEED_EMAIL: z.string().email().default("admin@store.com"),
  ADMIN_SEED_PASSWORD: z.string().min(6).default("Admin@12345"),

  STEADFAST_BASE_URL: z.string().url().default("https://portal.packzy.com/api/v1"),
  STEADFAST_API_KEY: z.string().default(""),
  STEADFAST_SECRET_KEY: z.string().default(""),
  STEADFAST_WEBHOOK_TOKEN: z.string().default("change-me-webhook-token"),

  SMS_PROVIDER: z.string().default("mock"),
  SMS_API_KEY: z.string().default(""),
  SMS_SENDER_ID: z.string().default(""),

  CORS_ORIGIN: z.string().default("http://localhost:3000"),

  STORE_NAME: z.string().default("BD Store"),
  STORE_PHONE: z.string().default("01700000000"),
  STORE_EMAIL: z.string().default("support@bdstore.com"),
  STORE_ADDRESS: z.string().default("Dhaka, Bangladesh"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;