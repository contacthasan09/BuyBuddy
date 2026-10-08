import { Router } from "express";
import * as ctrl from "./category.controller";
import { validate } from "../../middleware/validate.middleware";
import { createCategorySchema, updateCategorySchema } from "./category.validation";
import { requireAdmin } from "../../middleware/auth.middleware";

export const publicCategoryRouter = Router();
publicCategoryRouter.get("/", ctrl.publicList);

export const adminCategoryRouter = Router();
adminCategoryRouter.use(requireAdmin);
adminCategoryRouter.get("/", ctrl.adminList);
adminCategoryRouter.get("/:id", ctrl.adminGet);
adminCategoryRouter.post("/", validate({ body: createCategorySchema }), ctrl.adminCreate);
adminCategoryRouter.patch("/:id", validate({ body: updateCategorySchema }), ctrl.adminUpdate);
adminCategoryRouter.delete("/:id", ctrl.adminDelete);