import rateLimit from "express-rate-limit";

export const publicLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 120,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

export const orderLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  message: { success: false, message: "Too many orders. Please slow down." },
});

export const webhookLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 300,
});

/* ═══════════════════════════════════════════════════════
   LOGIN RATE LIMIT — strict, per-IP
   ═══════════════════════════════════════════════════════
   Blocks brute force: max 5 attempts per 15 minutes per IP.
   Success is NOT counted — only failures count.
*/
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5, // 5 failed attempts max
  skipSuccessfulRequests: true, // successful logins don't count
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    message:
      "Too many login attempts. Please try again after 15 minutes.",
  },
});

/* ═══════════════════════════════════════════════════════
   ADMIN API LIMIT — protects against token abuse
   ═══════════════════════════════════════════════════════ */
export const adminLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 200,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many admin requests.",
  },
});