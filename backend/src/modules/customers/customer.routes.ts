import { Router } from "express";
import * as ctrl from "./customer.controller";
import { requireAdmin } from "../../middleware/auth.middleware";

// Public — phone lookup for autofill
export const publicCustomerRouter = Router();
publicCustomerRouter.post("/lookup", ctrl.lookup);

// Admin
export const adminCustomerRouter = Router();
adminCustomerRouter.use(requireAdmin);
adminCustomerRouter.get("/", ctrl.adminList);
adminCustomerRouter.get("/:id", ctrl.adminGet);
adminCustomerRouter.patch("/:id", ctrl.adminUpdate);