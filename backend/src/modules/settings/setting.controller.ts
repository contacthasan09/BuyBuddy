import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ok } from "../../utils/response";
import * as service from "./setting.service";
import { AuthedRequest } from "../../middleware/auth.middleware";
import { audit } from "../audit/audit.service";

export const publicGet = asyncHandler(async (_req: Request, res: Response) => {
  const data = await service.getPublicSettings();
  return ok(res, data);
});

export const adminGetAll = asyncHandler(
  async (_req: Request, res: Response) => {
    const data = await service.getAllSettings();
    return ok(res, data);
  }
);

export const adminBulkUpdate = asyncHandler(
  async (req: AuthedRequest, res: Response) => {
    // Snapshot before
    const before = await service.getAllSettings();

    const data = await service.bulkUpsert(req.body);

    // Compute only the changed keys for a clean audit record
    const changedKeys: Record<string, { before: any; after: any }> = {};
    for (const key of Object.keys(req.body)) {
      if (JSON.stringify(before[key]) !== JSON.stringify(req.body[key])) {
        changedKeys[key] = {
          before: before[key],
          after: req.body[key],
        };
      }
    }

    await audit({
      req,
      action: "settings.update",
      resource: "settings",
      before: before as any,
      after: changedKeys as any,
    });

    return ok(res, data, "Settings updated");
  }
);