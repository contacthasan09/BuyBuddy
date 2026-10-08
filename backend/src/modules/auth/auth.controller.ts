import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ok } from "../../utils/response";
import * as authService from "./auth.service";
import * as twofactor from "./twofactor.service";
import { AuthedRequest } from "../../middleware/auth.middleware";
import {
  setAuthCookie,
  clearAuthCookie,
  getAuthCookieName,
} from "../../utils/cookies";
import {
  listActiveSessions,
  revokeSessionById,
  revokeAllSessionsForAdmin,
} from "./session.service";

/* ═══════════════════════════════════════════════════════
   AUTH — Login / Logout / Me
   ═══════════════════════════════════════════════════════ */

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password, {
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });

  // If 2FA required — return temp token, don't set cookie yet
  if ((result as any).requires2FA) {
    return ok(res, result, "2FA required");
  }

  // Normal login — set HttpOnly cookie
  setAuthCookie(res, (result as any).token);

  return ok(res, result, "Login successful");
});

export const verify2FA = asyncHandler(async (req: Request, res: Response) => {
  const { tempToken, code } = req.body;

  const result = await authService.completeTwoFactorLogin(tempToken, code, {
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });

  setAuthCookie(res, result.token);

  return ok(res, result, "Login successful");
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const cookieName = getAuthCookieName();
  const token = req.cookies?.[cookieName];

  if (token) {
    await authService.logout(token);
  }

  clearAuthCookie(res);
  return ok(res, null, "Logged out");
});

export const me = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const admin = await authService.getMe(req.admin!._id.toString());
  return ok(res, admin);
});

/* ═══════════════════════════════════════════════════════
   SESSIONS
   ═══════════════════════════════════════════════════════ */

export const listSessions = asyncHandler(
  async (req: AuthedRequest, res: Response) => {
    const sessions = await listActiveSessions(req.admin!._id.toString());
    return ok(res, sessions);
  }
);

export const revokeSession = asyncHandler(
  async (req: AuthedRequest, res: Response) => {
    await revokeSessionById(
      String(req.params.sessionId),
      req.admin!._id as any,
      "Revoked by admin"
    );
    return ok(res, null, "Session revoked");
  }
);

export const revokeAllSessions = asyncHandler(
  async (req: AuthedRequest, res: Response) => {
    await revokeAllSessionsForAdmin(
      req.admin!._id,
      req.admin!._id as any,
      "Force logout from all devices"
    );
    return ok(res, null, "All sessions revoked");
  }
);

/* ═══════════════════════════════════════════════════════
   2FA
   ═══════════════════════════════════════════════════════ */

export const setup2FA = asyncHandler(
  async (req: AuthedRequest, res: Response) => {
    const result = await twofactor.setupTwoFactor(req.admin!._id.toString());
    return ok(res, result, "2FA setup initiated");
  }
);

export const enable2FA = asyncHandler(
  async (req: AuthedRequest, res: Response) => {
    const { secret, token } = req.body;
    if (!secret || !token) {
      return ok(res, null, "Secret and token are required");
    }
    const result = await twofactor.enableTwoFactor(
      req.admin!._id.toString(),
      secret,
      token
    );
    return ok(res, result, "2FA enabled");
  }
);

export const disable2FA = asyncHandler(
  async (req: AuthedRequest, res: Response) => {
    const { password, token } = req.body;
    if (!password || !token) {
      return ok(res, null, "Password and token are required");
    }
    await twofactor.disableTwoFactor(
      req.admin!._id.toString(),
      password,
      token
    );
    return ok(res, null, "2FA disabled");
  }
);