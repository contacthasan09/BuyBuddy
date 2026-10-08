import { Router } from "express";
import * as ctrl from "./product.controller";
import { validate } from "../../middleware/validate.middleware";
import {
  createProductSchema,
  updateProductSchema,
  listProductsQuerySchema,
} from "./product.validation";
import { requireAdmin } from "../../middleware/auth.middleware";

// Public router
export const publicProductRouter = Router();
publicProductRouter.get("/", validate({ query: listProductsQuerySchema }), ctrl.list);
publicProductRouter.get("/:slug", ctrl.detail);

// Admin router
export const adminProductRouter = Router();
adminProductRouter.use(requireAdmin);
adminProductRouter.get("/", validate({ query: listProductsQuerySchema }), ctrl.adminList);
adminProductRouter.get("/:id", ctrl.adminGetById);
adminProductRouter.post("/", validate({ body: createProductSchema }), ctrl.adminCreate);
adminProductRouter.patch("/:id", validate({ body: updateProductSchema }), ctrl.adminUpdate);
adminProductRouter.delete("/:id", ctrl.adminDelete);