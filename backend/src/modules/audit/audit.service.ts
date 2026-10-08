import { AuditLog } from "./audit_log.model";
import { Request } from "express";
import { AuthedRequest } from "../../middleware/auth.middleware";
import { logger } from "../../utils/logger";

interface AuditParams {
  req: Request | AuthedRequest;
  action: string;
  resource: string;
  resourceId?: string;
  before?: unknown;
  after?: unknown;
  status?: "success" | "failure";
  error?: string;
}

export async function audit(params: AuditParams) {
  try {
    const admin = (params.req as AuthedRequest).admin;

    await AuditLog.create({
      admin: admin?._id,
      adminEmail: admin?.email,
      action: params.action,
      resource: params.resource,
      resourceId: params.resourceId,
      before: params.before,
      after: params.after,
      ip: params.req.ip,
      userAgent: params.req.headers["user-agent"],
      method: params.req.method,
      path: params.req.originalUrl,
      status: params.status || "success",
      error: params.error,
    });
  } catch (err) {
    // Never crash the request because audit logging failed
    logger.error({ err }, "Audit log write failed");
  }
}

export async function listAuditLogs(opts: {
  admin?: string;
  resource?: string;
  resourceId?: string;
  action?: string;
  limit?: number;
  page?: number;
}) {
  const filter: Record<string, unknown> = {};
  if (opts.admin) filter.admin = opts.admin;
  if (opts.resource) filter.resource = opts.resource;
  if (opts.resourceId) filter.resourceId = opts.resourceId;
  if (opts.action) filter.action = opts.action;

  const limit = Math.min(opts.limit || 50, 200);
  const page = opts.page || 1;
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    AuditLog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    AuditLog.countDocuments(filter),
  ]);

  return {
    items,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
}