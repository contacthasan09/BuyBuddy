import jwt from "jsonwebtoken";
import { Admin } from "./admin.model";
import { env } from "../../config/env";
import { AppError } from "../../utils/AppError";
import { logger } from "../../utils/logger";
import {
  createSession,
  revokeSession,
  hashToken,
} from "./session.service";
import {
  hasTwoFactor,
  verifyLogin2FA,
} from "./twofactor.service";

/* ═══════════════════════════════════════════════════════
   STAGE 1 — Login with email + password
   ═══════════════════════════════════════════════════════
   - Validates credentials
   - Handles account lockout after 5 failed attempts
   - If 2FA is enabled, returns { requires2FA: true, tempToken }
   - Otherwise, issues the full session token + cookie
*/
export async function login(
  email: string,
  password: string,
  meta?: { ip?: string; userAgent?: string }
) {
  const admin = await Admin.findOne({
    email: email.toLowerCase(),
  }).select("+password");

  // ── Email not found ────────────────────────────────
  if (!admin) {
    logger.warn(
      {
        email,
        ip: meta?.ip,
        userAgent: meta?.userAgent,
        reason: "email_not_found",
      },
      "Failed admin login"
    );
    throw new AppError("Invalid credentials", 401);
  }

  // ── Account temporarily locked ─────────────────────
  if (admin.isLocked()) {
    logger.warn(
      { email, ip: meta?.ip, reason: "account_locked" },
      "Blocked login attempt on locked account"
    );
    throw new AppError(
      "Account temporarily locked. Try again in 15 minutes.",
      423
    );
  }

  // ── Account disabled ───────────────────────────────
  if (!admin.isActive) {
    logger.warn(
      { email, ip: meta?.ip, reason: "account_disabled" },
      "Failed admin login"
    );
    throw new AppError("Account disabled", 403);
  }

  // ── Wrong password ─────────────────────────────────
  const match = await admin.comparePassword(password);
  if (!match) {
    admin.failedLoginAttempts = (admin.failedLoginAttempts || 0) + 1;

    // Lock after 5 failed attempts for 15 minutes
    if (admin.failedLoginAttempts >= 5) {
      admin.lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
      logger.warn(
        {
          email,
          ip: meta?.ip,
          failedAttempts: admin.failedLoginAttempts,
        },
        "Account locked after repeated failures"
      );
    }

    await admin.save({ validateBeforeSave: false });

    logger.warn(
      {
        email,
        ip: meta?.ip,
        reason: "wrong_password",
        attempts: admin.failedLoginAttempts,
      },
      "Failed admin login"
    );

    throw new AppError("Invalid credentials", 401);
  }

  // ── Password correct — check if 2FA is enabled ─────
  const twoFARequired = await hasTwoFactor(admin._id.toString());

  if (twoFARequired) {
    // Issue a temporary token — valid 5 minutes
    // The client must call /verify-2fa to get the real token
    const tempToken = jwt.sign(
      { sub: admin._id.toString(), stage: "2fa" },
      env.JWT_SECRET,
      { expiresIn: "5m" }
    );

    logger.info(
      {
        adminId: admin._id,
        email: admin.email,
        ip: meta?.ip,
      },
      "Admin password verified — awaiting 2FA"
    );

    return {
      requires2FA: true as const,
      tempToken,
      email: admin.email,
    };
  }

  // ── No 2FA — issue full token ──────────────────────
  return issueFullToken(admin, meta);
}

/* ═══════════════════════════════════════════════════════
   STAGE 2 — Complete 2FA login
   ═══════════════════════════════════════════════════════
   - Verifies the temp token
   - Validates the 2FA code (TOTP or backup)
   - Issues the full session token
*/
export async function completeTwoFactorLogin(
  tempToken: string,
  code: string,
  meta?: { ip?: string; userAgent?: string }
) {
  // ── Verify temp token ──────────────────────────────
  let payload: any;
  try {
    payload = jwt.verify(tempToken, env.JWT_SECRET);
  } catch {
    throw new AppError("Temp token expired or invalid", 401);
  }

  if (payload.stage !== "2fa") {
    throw new AppError("Invalid token stage", 401);
  }

  // ── Verify 2FA code (TOTP or backup) ───────────────
  await verifyLogin2FA(payload.sub, code);

  // ── Load admin ─────────────────────────────────────
  const admin = await Admin.findById(payload.sub).select("-password");
  if (!admin) throw new AppError("Admin not found", 404);
  if (!admin.isActive) throw new AppError("Account disabled", 403);

  logger.info(
    {
      adminId: admin._id,
      email: admin.email,
      ip: meta?.ip,
    },
    "Admin 2FA verified"
  );

  // ── Issue full token ───────────────────────────────
  return issueFullToken(admin, meta);
}

/* ═══════════════════════════════════════════════════════
   INTERNAL — Issue full session token + create DB record
   ═══════════════════════════════════════════════════════ */
async function issueFullToken(
  admin: any,
  meta?: { ip?: string; userAgent?: string }
) {
  // Sign JWT
  const token = jwt.sign(
    { sub: admin._id.toString(), email: admin.email },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN as any }
  );

  // Create session record (for revocation)
  await createSession({
    adminId: admin._id,
    token,
    ip: meta?.ip,
    userAgent: meta?.userAgent,
  });

  // Reset lock counters + record successful login
  admin.failedLoginAttempts = 0;
  admin.lockedUntil = undefined;
  admin.lastLoginAt = new Date();
  if (meta?.ip) admin.lastLoginIp = meta.ip;
  await admin.save({ validateBeforeSave: false });

  logger.info(
    {
      adminId: admin._id,
      email: admin.email,
      ip: meta?.ip,
    },
    "Admin login success"
  );

  return {
    token,
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    },
  };
}

/* ═══════════════════════════════════════════════════════
   Logout — revoke the current session
   ═══════════════════════════════════════════════════════
   Called from the logout controller. Takes the raw token
   (extracted from the HttpOnly cookie) and revokes it.
*/
export async function logout(token: string) {
  try {
    const tokenHash = hashToken(token);
    await revokeSession(tokenHash, undefined, "User logout");
    logger.info(
      { tokenHashPrefix: tokenHash.slice(0, 12) },
      "Session revoked"
    );
  } catch (err) {
    logger.error({ err }, "Logout failed");
    // Don't throw — client will still clear the cookie
  }
}

/* ═══════════════════════════════════════════════════════
   Get current admin profile
   ═══════════════════════════════════════════════════════ */
export async function getMe(adminId: string) {
  const admin = await Admin.findById(adminId).select("-password");
  if (!admin) throw new AppError("Admin not found", 404);
  return admin;
}