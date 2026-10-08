import { Router } from "express";
import * as ctrl from "./review.controller";
import { validate } from "../../middleware/validate.middleware";
import {
  createReviewSchema,
  listReviewsQuerySchema,
  adminListReviewsQuerySchema,
} from "./review.validation";
import { requireAdmin } from "../../middleware/auth.middleware";
import { publicLimiter, orderLimiter } from "../../middleware/rateLimit.middleware";

/* ═══════════════════════════════════════════════════════
   Public routes
   ═══════════════════════════════════════════════════════ */
export const publicReviewRouter = Router();

// GET /api/reviews/product/:productId
publicReviewRouter.get(
  "/product/:productId",
  publicLimiter,
  validate({ query: listReviewsQuerySchema }),
  ctrl.listForProduct
);

// GET /api/reviews/product/:productId/summary
publicReviewRouter.get(
  "/product/:productId/summary",
  publicLimiter,
  ctrl.summary
);

// POST /api/reviews — create
publicReviewRouter.post(
  "/",
  orderLimiter,
  validate({ body: createReviewSchema }),
  ctrl.create
);

// POST /api/reviews/:id/helpful
publicReviewRouter.post(
  "/:id/helpful",
  publicLimiter,
  ctrl.markHelpful
);

/* ═══════════════════════════════════════════════════════
   Admin routes
   ═══════════════════════════════════════════════════════ */
export const adminReviewRouter = Router();
adminReviewRouter.use(requireAdmin);

adminReviewRouter.get(
  "/",
  validate({ query: adminListReviewsQuerySchema }),
  ctrl.adminList
);
adminReviewRouter.patch("/:id", ctrl.adminUpdate);
adminReviewRouter.delete("/:id", ctrl.adminDelete);