import { Router } from "express";
import * as ctrl from "./order.controller";
import { validate } from "../../middleware/validate.middleware";
import {
  createOrderSchema,
  trackQuerySchema,
  updateOrderStatusSchema,
  listOrdersQuerySchema,
} from "./order.validation";
import { requireAdmin } from "../../middleware/auth.middleware";
import { orderLimiter } from "../../middleware/rateLimit.middleware";

// Public
export const publicOrderRouter = Router();
publicOrderRouter.post("/", orderLimiter, validate({ body: createOrderSchema }), ctrl.create);
publicOrderRouter.get("/track", validate({ query: trackQuerySchema }), ctrl.track);

// Admin
export const adminOrderRouter = Router();
adminOrderRouter.use(requireAdmin);
adminOrderRouter.get("/", validate({ query: listOrdersQuerySchema }), ctrl.adminList);
adminOrderRouter.get("/:id", ctrl.adminGet);
adminOrderRouter.patch("/:id/status", validate({ body: updateOrderStatusSchema }), ctrl.adminUpdateStatus);