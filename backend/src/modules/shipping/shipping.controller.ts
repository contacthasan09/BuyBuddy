import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ok, created } from "../../utils/response";
import * as service from "./shipping.service";
import { z } from "zod";
import { AuthedRequest } from "../../middleware/auth.middleware";
import { audit } from "../audit/audit.service";

export const adminCreateShipment = asyncHandler(
  async (req: AuthedRequest, res: Response) => {
    const body = z.object({ orderId: z.string().min(1) }).parse(req.body);

    const result = await service.createShipmentForOrder(body.orderId);

    await audit({
      req,
      action: "shipment.create",
      resource: "shipment",
      resourceId: body.orderId,
      after: {
        consignmentId: (result as any)?.shipment?.consignmentId,
        trackingCode: (result as any)?.shipment?.trackingCode,
      },
    });

    return created(res, result, "Shipment created");
  }
);

export const adminRefreshStatus = asyncHandler(
  async (req: AuthedRequest, res: Response) => {
    const orderId = String(req.params.orderId);
    const result = await service.refreshShipmentStatus(orderId);

    await audit({
      req,
      action: "shipment.refresh_status",
      resource: "shipment",
      resourceId: orderId,
      after: { status: (result as any)?.status },
    });

    return ok(res, result, "Status refreshed");
  }
);

export const adminGetBalance = asyncHandler(
  async (_req: Request, res: Response) => {
    const balance = await service.getCourierBalance();
    return ok(res, { balance });
  }
);

export const adminCreateReturn = asyncHandler(
  async (req: AuthedRequest, res: Response) => {
    const body = z
      .object({ orderId: z.string(), reason: z.string().optional() })
      .parse(req.body);

    const result = await service.createReturn(body.orderId, body.reason);

    await audit({
      req,
      action: "shipment.create_return",
      resource: "shipment",
      resourceId: body.orderId,
      after: { reason: body.reason },
    });

    return ok(res, result, "Return request sent to courier");
  }
);