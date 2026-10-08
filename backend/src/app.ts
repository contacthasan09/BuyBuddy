import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { errorHandler } from "./middleware/error.middleware";
import { notFoundHandler } from "./middleware/notFound.middleware";
import {
  publicLimiter,
  webhookLimiter,
} from "./middleware/rateLimit.middleware";

// Routers
import authRoutes from "./modules/auth/auth.routes";
import {
  publicProductRouter,
  adminProductRouter,
} from "./modules/products/product.routes";
import {
  publicCategoryRouter,
  adminCategoryRouter,
} from "./modules/categories/category.routes";
import {
  publicSettingRouter,
  adminSettingRouter,
} from "./modules/settings/setting.routes";
import {
  publicOrderRouter,
  adminOrderRouter,
} from "./modules/orders/order.routes";
import {
  publicCustomerRouter,
  adminCustomerRouter,
} from "./modules/customers/customer.routes";
import inventoryRouter from "./modules/inventory/inventory.routes";
import shippingRouter from "./modules/shipping/shipping.routes";
import auditRouter from "./modules/audit/audit.routes";
import webhookRouter from "./webhooks";
import {
  publicReviewRouter,
  adminReviewRouter,
} from "./modules/reviews/review.routes";

const app = express();

/* ═══════════════════════════════════════════════════════
   Security headers
   ═══════════════════════════════════════════════════════ */
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

/* ═══════════════════════════════════════════════════════
   CORS — must allow credentials + specific origin
   ═══════════════════════════════════════════════════════ */
const allowedOrigins = env.CORS_ORIGIN.split(",").map((s) => s.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, Postman, server-to-server)
      if (!origin) return callback(null, true);

      // Exact match from allowlist
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Dev fallback — any localhost:<port>
      if (
        env.NODE_ENV === "development" &&
        /^https?:\/\/localhost(:\d+)?$/.test(origin)
      ) {
        return callback(null, true);
      }

      callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true, // ← MUST be true for cookies
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    // Explicitly expose Set-Cookie to the browser (some browsers need this)
    exposedHeaders: ["Set-Cookie"],
  })
);

/* ═══════════════════════════════════════════════════════
   Body + cookie parsing
   ═══════════════════════════════════════════════════════ */
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* ═══════════════════════════════════════════════════════
   Compression + logging
   ═══════════════════════════════════════════════════════ */
app.use(compression());
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

/* ═══════════════════════════════════════════════════════
   Health check
   ═══════════════════════════════════════════════════════ */
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    env: env.NODE_ENV,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

/* ═══════════════════════════════════════════════════════
   PUBLIC API
   ═══════════════════════════════════════════════════════ */
app.use("/api/products", publicLimiter, publicProductRouter);
app.use("/api/categories", publicLimiter, publicCategoryRouter);
app.use("/api/settings", publicSettingRouter);
app.use("/api/orders", publicOrderRouter);
app.use("/api/customers", publicLimiter, publicCustomerRouter);
app.use("/api/reviews", publicLimiter, publicReviewRouter);

/* ═══════════════════════════════════════════════════════
   ADMIN API
   ═══════════════════════════════════════════════════════ */
app.use("/api/admin/auth", authRoutes);
app.use("/api/admin/products", adminProductRouter);
app.use("/api/admin/categories", adminCategoryRouter);
app.use("/api/admin/settings", adminSettingRouter);
app.use("/api/admin/orders", adminOrderRouter);
app.use("/api/admin/customers", adminCustomerRouter);
app.use("/api/admin/inventory", inventoryRouter);
app.use("/api/admin/shipments", shippingRouter);
app.use("/api/admin/audit", auditRouter);
app.use("/api/admin/reviews", adminReviewRouter);

/* ═══════════════════════════════════════════════════════
   Webhooks
   ═══════════════════════════════════════════════════════ */
app.use("/api/webhooks", webhookLimiter, webhookRouter);

/* ═══════════════════════════════════════════════════════
   404 + error
   ═══════════════════════════════════════════════════════ */
app.use(notFoundHandler);
app.use(errorHandler);

export default app;