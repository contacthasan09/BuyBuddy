import { Router } from "express";
import * as ctrl from "./shipping.controller";
import { requireAdmin } from "../../middleware/auth.middleware";

const router = Router();
router.use(requireAdmin);

router.post("/create", ctrl.adminCreateShipment);
router.get("/balance", ctrl.adminGetBalance);
router.post("/returns", ctrl.adminCreateReturn);
router.get("/refresh/:orderId", ctrl.adminRefreshStatus);

export default router;