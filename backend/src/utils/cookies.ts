import { Response } from "express";
import { env } from "../config/env";

const COOKIE_NAME = "bd_admin_token";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

/* ═══════════════════════════════════════════════════════
   Cookie options
   ═══════════════════════════════════════════════════════
   Development: SameSite=None + Secure (localhost is treated
   as a secure context by Chrome, so Secure works over HTTP).
   Production: SameSite=None + Secure (HTTPS enforced).
*/
function cookieOptions() {
  const isProd = env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: true,          // always true — required for SameSite=None
    sameSite: "none" as const, // allows cross-origin (localhost:3000 ↔ localhost:5000)
    maxAge: COOKIE_MAX_AGE,
    path: "/",
    // Do NOT set `domain` — let it default to the exact host
  };
}

export function setAuthCookie(res: Response, token: string) {
  res.cookie(COOKIE_NAME, token, cookieOptions());
}

export function clearAuthCookie(res: Response) {
  res.clearCookie(COOKIE_NAME, cookieOptions());
}

export function getAuthCookieName() {
  return COOKIE_NAME;
}