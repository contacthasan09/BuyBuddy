import { Router } from "express";
import * as ctrl from "./setting.controller";
import { requireAdmin } from "../../middleware/auth.middleware";

export const publicSettingRouter = Router();
publicSettingRouter.get("/", ctrl.publicGet);

export const adminSettingRouter = Router();
adminSettingRouter.use(requireAdmin);
adminSettingRouter.get("/", ctrl.adminGetAll);
adminSettingRouter.patch("/", ctrl.adminBulkUpdate);