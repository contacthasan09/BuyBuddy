import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "../utils/AppError";
import { Admin, IAdmin } from "../modules/auth/admin.model";
import { logger } from "../utils/logger";
import { getAuthCookieName } from "../utils/cookies";
import { isSessionValid } from "../modules/auth/session.service";

export interface AuthedRequest extends Request {
  admin?: IAdmin;
}

interface JwtPayload {
  sub: string;
  email: string;
  iat: number;
  exp: number;
}

export async function requireAdmin(
  req: AuthedRequest,
  _res: Response,
  next: NextFunction
) {
  try {
    // ── Try cookie first, then Authorization header ────
    let token: string | undefined;

    const cookieName = getAuthCookieName();
    if (req.cookies?.[cookieName]) {
      token = req.cookies[cookieName];
    } else {
      const header = req.headers.authorization;
      if (header?.startsWith("Bearer ")) {
        token = header.slice(7);
      }
    }

    if (!token) {
      throw new AppError("Missing authentication", 401);
    }

    // ── Verify JWT signature ───────────────────────────
    let payload: JwtPayload;
    try {
      payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    } catch (err: any) {
      logger.warn(
        { ip: req.ip, path: req.path, reason: err?.message },
        "Admin auth failed"
      );
      throw new AppError("Invalid or expired token", 401);
    }

    // ── Verify session is still active (not revoked) ──
    const valid = await isSessionValid(token);
    if (!valid) {
      throw new AppError("Session revoked or expired", 401);
    }

    // ── Load admin ─────────────────────────────────────
    const admin = await Admin.findById(payload.sub).select("-password");
    if (!admin) throw new AppError("Admin not found", 401);

    if (!(admin as any).isActive) {
      throw new AppError("Account disabled", 403);
    }

    req.admin = admin;

    logger.debug(
      {
        adminId: admin._id,
        method: req.method,
        path: req.path,
      },
      "Admin request"
    );

    next();
  } catch (err) {
    next(err);
  }
}