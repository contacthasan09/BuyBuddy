import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ok } from "../../utils/response";
import * as service from "./audit.service";

export const list = asyncHandler(async (req: Request, res: Response) => {
  const result = await service.listAuditLogs(req.query as any);
  return ok(res, result);
});