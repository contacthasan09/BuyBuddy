import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ok } from "../../utils/response";
import * as service from "./customer.service";
import { z } from "zod";

export const lookup = asyncHandler(async (req: Request, res: Response) => {
  const { phone } = z.object({ phone: z.string().min(11) }).parse(req.body);
  const result = await service.lookupByPhone(phone);
  return ok(res, result); // null if not found — frontend just skips autofill
});

export const adminList = asyncHandler(async (_req: Request, res: Response) => {
  const items = await service.listCustomers();
  return ok(res, items);
});

export const adminGet = asyncHandler(async (req: Request, res: Response) => {
  const c = await service.getCustomerById(String(req.params.id));
  return ok(res, c);
});

export const adminUpdate = asyncHandler(async (req: Request, res: Response) => {
  const c = await service.updateCustomer(String(req.params.id), req.body);
  return ok(res, c, "Customer updated");
});