import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ok, created } from "../../utils/response";
import * as service from "./category.service";

export const publicList = asyncHandler(async (_req: Request, res: Response) => {
  const cats = await service.listCategories();
  return ok(res, cats);
});

export const adminList = asyncHandler(async (_req: Request, res: Response) => {
  const cats = await service.listAllCategories();
  return ok(res, cats);
});

export const adminGet = asyncHandler(async (req: Request, res: Response) => {
  const cat = await service.getCategory(String(req.params.id));
  return ok(res, cat);
});

export const adminCreate = asyncHandler(async (req: Request, res: Response) => {
  const cat = await service.createCategory(req.body);
  return created(res, cat, "Category created");
});

export const adminUpdate = asyncHandler(async (req: Request, res: Response) => {
  const cat = await service.updateCategory(String(req.params.id), req.body);
  return ok(res, cat, "Category updated");
});

export const adminDelete = asyncHandler(async (req: Request, res: Response) => {
  await service.deleteCategory(String(req.params.id));
  return ok(res, null, "Category deleted");
});