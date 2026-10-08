import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ok } from "../../utils/response";
import * as service from "./inventory.service";
import { z } from "zod";
import { AuthedRequest } from "../../middleware/auth.middleware";
import { audit } from "../audit/audit.service";

export const adminList = asyncHandler(async (_req: Request, res: Response) => {
  const items = await service.listInventory();
  return ok(res, items);
});

export const adminGetByProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const inv = await service.getInventoryByProduct(
      String(req.params.productId)
    );
    return ok(res, inv);
  }
);

export const adminListTransactions = asyncHandler(
  async (req: Request, res: Response) => {
    const { productId } = req.query as { productId?: string };
    const txns = await service.listTransactions(productId);
    return ok(res, txns);
  }
);

const addStockSchema = z.object({
  productId: z.string().regex(/^[a-f\d]{24}$/i),
  quantity: z.number().int().positive(),
  note: z.string().optional(),
});

export const adminAddStock = asyncHandler(
  async (req: AuthedRequest, res: Response) => {
    const parsed = addStockSchema.parse(req.body);

    // Snapshot inventory before change
    let beforeSnapshot: { physical: number; available: number } | undefined;
    try {
      const before = await service.getInventoryByProduct(parsed.productId);
      beforeSnapshot = {
        physical: before.physical,
        available: before.available,
      };
    } catch {
      // inventory may not exist yet
    }

    const inv = await service.addStock(
      parsed.productId,
      parsed.quantity,
      parsed.note
    );

    await audit({
      req,
      action: "inventory.add_stock",
      resource: "inventory",
      resourceId: parsed.productId,
      before: beforeSnapshot,
      after: {
        physical: inv.physical,
        available: inv.available,
        added: parsed.quantity,
        note: parsed.note,
      },
    });

    return ok(res, inv, "Stock added");
  }
);