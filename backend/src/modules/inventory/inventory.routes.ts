import { Router } from "express";
import * as ctrl from "./inventory.controller";
import { requireAdmin } from "../../middleware/auth.middleware";

const router = Router();
router.use(requireAdmin);

router.get("/", ctrl.adminList);
router.get("/transactions", ctrl.adminListTransactions);
router.get("/:productId", ctrl.adminGetByProduct);
router.post("/add-stock", ctrl.adminAddStock);

export default router;