import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ok, created } from "../../utils/response";
import * as service from "./review.service";

/* ═══════════════════════════════════════════════════════
   PUBLIC
   ═══════════════════════════════════════════════════════ */

export const listForProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const productId = String(req.params.productId);
    const result = await service.listReviewsForProduct(
      productId,
      req.query as any
    );
    return ok(res, result);
  }
);

export const summary = asyncHandler(async (req: Request, res: Response) => {
  const productId = String(req.params.productId);
  const result = await service.getRatingSummary(productId);
  return ok(res, result);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const review = await service.createReview(req.body);
  return created(res, review, "Review submitted. Thank you!");
});

export const markHelpful = asyncHandler(
  async (req: Request, res: Response) => {
    const review = await service.markHelpful(String(req.params.id));
    return ok(res, review, "Marked as helpful");
  }
);

/* ═══════════════════════════════════════════════════════
   ADMIN
   ═══════════════════════════════════════════════════════ */

export const adminList = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await service.adminListReviews(req.query as any);
    return ok(res, result);
  }
);

export const adminUpdate = asyncHandler(
  async (req: Request, res: Response) => {
    const review = await service.adminUpdateReview(
      String(req.params.id),
      req.body
    );
    return ok(res, review, "Review updated");
  }
);

export const adminDelete = asyncHandler(
  async (req: Request, res: Response) => {
    await service.adminDeleteReview(String(req.params.id));
    return ok(res, null, "Review deleted");
  }
);