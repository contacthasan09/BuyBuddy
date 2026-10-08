import crypto from "crypto";
import { Session } from "./session.model";
import mongoose from "mongoose";

/** SHA-256 hash of the token — safe to store in DB */
export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function createSession(params: {
  adminId: mongoose.Types.ObjectId;
  token: string;
  ip?: string;
  userAgent?: string;
  expiresInMs?: number;
}) {
  const tokenHash = hashToken(params.token);
  const expiresAt = new Date(
    Date.now() + (params.expiresInMs || 7 * 24 * 60 * 60 * 1000)
  );

  return Session.create({
    admin: params.adminId,
    tokenHash,
    ip: params.ip,
    userAgent: params.userAgent,
    lastUsedAt: new Date(),
    expiresAt,
  });
}

export async function isSessionValid(token: string): Promise<boolean> {
  const tokenHash = hashToken(token);
  const session = await Session.findOne({ tokenHash });

  if (!session) return false;
  if (session.revokedAt) return false;
  if (session.expiresAt < new Date()) return false;

  // Update last used timestamp (fire and forget)
  Session.updateOne({ _id: session._id }, { lastUsedAt: new Date() }).catch(
    () => {}
  );

  return true;
}

export async function revokeSession(
  tokenHash: string,
  revokedBy?: mongoose.Types.ObjectId,
  reason?: string
) {
  return Session.updateOne(
    { tokenHash },
    { revokedAt: new Date(), revokedBy, revokedReason: reason }
  );
}

export async function revokeSessionById(
  sessionId: string,
  revokedBy?: mongoose.Types.ObjectId,
  reason = "Revoked by admin"
) {
  return Session.updateOne(
    { _id: sessionId },
    { revokedAt: new Date(), revokedBy, revokedReason: reason }
  );
}

export async function revokeAllSessionsForAdmin(
  adminId: string | mongoose.Types.ObjectId,
  revokedBy?: mongoose.Types.ObjectId,
  reason = "All sessions revoked"
) {
  return Session.updateMany(
    {
      admin: adminId,
      revokedAt: { $exists: false },
    },
    { revokedAt: new Date(), revokedBy, revokedReason: reason }
  );
}

export async function listActiveSessions(adminId: string) {
  return Session.find({
    admin: adminId,
    revokedAt: { $exists: false },
    expiresAt: { $gt: new Date() },
  })
    .sort({ lastUsedAt: -1 })
    .lean();
}