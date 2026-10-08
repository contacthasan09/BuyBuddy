import { Router } from "express";
import * as ctrl from "./auth.controller";
import { validate } from "../../middleware/validate.middleware";
import { loginSchema } from "./auth.validation";
import { requireAdmin } from "../../middleware/auth.middleware";
import { loginLimiter } from "../../middleware/rateLimit.middleware";

const router = Router();

/* ═══════════════════════════════════════════════════════
   AUTHENTICATION (public)
   ═══════════════════════════════════════════════════════ */

// Stage 1 — email + password
router.post(
  "/login",
  loginLimiter,
  validate({ body: loginSchema }),
  ctrl.login
);

// Stage 2 — verify 2FA code (only needed if login returned requires2FA)
router.post("/verify-2fa", loginLimiter, ctrl.verify2FA);

// Logout — clears cookie + revokes session
router.post("/logout", ctrl.logout);

/* ═══════════════════════════════════════════════════════
   PROFILE (authenticated)
   ═══════════════════════════════════════════════════════ */

router.get("/me", requireAdmin, ctrl.me);

/* ═══════════════════════════════════════════════════════
   SESSION MANAGEMENT (authenticated)
   ═══════════════════════════════════════════════════════ */

// List all active sessions for the current admin
router.get("/sessions", requireAdmin, ctrl.listSessions);

// Revoke a specific session by ID
router.delete("/sessions/:sessionId", requireAdmin, ctrl.revokeSession);

// Force logout from ALL devices
router.post("/sessions/revoke-all", requireAdmin, ctrl.revokeAllSessions);

/* ═══════════════════════════════════════════════════════
   2FA MANAGEMENT (authenticated)
   ═══════════════════════════════════════════════════════ */

// Generate TOTP secret + QR code (not yet enabled)
router.post("/2fa/setup", requireAdmin, ctrl.setup2FA);

// Enable 2FA after verifying the first code — returns backup codes
router.post("/2fa/enable", requireAdmin, ctrl.enable2FA);

// Disable 2FA — requires password + current 2FA code
router.post("/2fa/disable", requireAdmin, ctrl.disable2FA);

export default router;