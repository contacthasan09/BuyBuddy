import { Router } from "express";
import * as ctrl from "./audit.controller";
import { requireAdmin } from "../../middleware/auth.middleware";

const router = Router();
router.use(requireAdmin);
router.get("/", ctrl.list);

export default router;