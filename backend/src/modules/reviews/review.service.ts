import mongoose from "mongoose";
import { Review } from "./review.model";
import { Order } from "../orders/order.model";
import { AppError } from "../../utils/AppError";
import { normalizeBDPhone } from "../../utils/phone";

interface ListOptions {
  page: number;
  limit: number;
  rating?: number;
  sort: "newest" | "helpful" | "rating_high" | "rating_low";
}

/* ═══════════════════════════════════════════════════════
   List reviews for a product + compute rating summary
   ═══════════════════════════════════════════════════════ */
export async function listReviewsForProduct(
  productId: string,
  opts: ListOptions
) {
  if (!mongoose.isValidObjectId(productId)) {
    throw new AppError("Invalid product ID", 400);
  }

  const productObjectId = new mongoose.Types.ObjectId(productId);

  const filter: Record<string, unknown> = {
    product: productObjectId,
    isApproved: true,
  };
  if (opts.rating) filter.rating = opts.rating;

  const sortMap = {
    newest: { createdAt: -1 },
    helpful: { helpfulCount: -1, createdAt: -1 },
    rating_high: { rating: -1, createdAt: -1 },
    rating_low: { rating: 1, createdAt: -1 },
  } as const;

  const skip = (opts.page - 1) * opts.limit;

  const [items, total, summaryAgg] = await Promise.all([
    Review.find(filter)
      .sort(sortMap[opts.sort])
      .skip(skip)
      .limit(opts.limit)
      .lean(),
    Review.countDocuments(filter),
    Review.aggregate([
      { $match: { product: productObjectId, isApproved: true } },
      {
        $group: {
          _id: null,
          avg: { $avg: "$rating" },
          total: { $sum: 1 },
          count5: { $sum: { $cond: [{ $eq: ["$rating", 5] }, 1, 0] } },
          count4: { $sum: { $cond: [{ $eq: ["$rating", 4] }, 1, 0] } },
          count3: { $sum: { $cond: [{ $eq: ["$rating", 3] }, 1, 0] } },
          count2: { $sum: { $cond: [{ $eq: ["$rating", 2] }, 1, 0] } },
          count1: { $sum: { $cond: [{ $eq: ["$rating", 1] }, 1, 0] } },
        },
      },
    ]),
  ]);

  const s = summaryAgg[0] || {
    avg: 0,
    total: 0,
    count5: 0,
    count4: 0,
    count3: 0,
    count2: 0,
    count1: 0,
  };

  return {
    items,
    pagination: {
      page: opts.page,
      limit: opts.limit,
      total,
      pages: Math.ceil(total / opts.limit),
    },
    summary: {
      average: Number((s.avg || 0).toFixed(1)),
      total: s.total || 0,
      distribution: {
        5: s.count5 || 0,
        4: s.count4 || 0,
        3: s.count3 || 0,
        2: s.count2 || 0,
        1: s.count1 || 0,
      },
    },
  };
}

/* ═══════════════════════════════════════════════════════
   Lightweight summary (for product cards)
   ═══════════════════════════════════════════════════════ */
export async function getRatingSummary(productId: string) {
  if (!mongoose.isValidObjectId(productId)) {
    return { average: 0, total: 0 };
  }

  const summary = await Review.aggregate([
    {
      $match: {
        product: new mongoose.Types.ObjectId(productId),
        isApproved: true,
      },
    },
    {
      $group: {
        _id: null,
        avg: { $avg: "$rating" },
        total: { $sum: 1 },
      },
    },
  ]);

  if (summary.length === 0) return { average: 0, total: 0 };

  return {
    average: Number((summary[0].avg || 0).toFixed(1)),
    total: summary[0].total || 0,
  };
}

/* ═══════════════════════════════════════════════════════
   Create review + auto-detect verified purchase
   ═══════════════════════════════════════════════════════ */
export async function createReview(input: {
  productId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  rating: number;
  title?: string;
  comment: string;
  images: string[];
}) {
  const phone = normalizeBDPhone(input.customerPhone);

  // Reject duplicate
  const existing = await Review.findOne({
    product: input.productId,
    customerPhone: phone,
  });
  if (existing) {
    throw new AppError(
      "You have already reviewed this product. Thank you!",
      409
    );
  }

  // Check for verified purchase — does this phone have a DELIVERED order
  // that includes this product?
  const deliveredOrder = await Order.findOne({
    customerPhone: phone,
    status: "DELIVERED",
    "items.product": input.productId,
  })
    .select("_id")
    .lean();

  const review = await Review.create({
    product: input.productId,
    customerPhone: phone,
    customerName: input.customerName.trim(),
    customerEmail: input.customerEmail || undefined,
    rating: input.rating,
    title: input.title?.trim() || undefined,
    comment: input.comment.trim(),
    images: input.images || [],
    isVerifiedPurchase: !!deliveredOrder,
    orderRef: deliveredOrder?._id,
    isApproved: true,
  });

  return review;
}

/* ═══════════════════════════════════════════════════════
   Mark review as helpful
   ═══════════════════════════════════════════════════════ */
export async function markHelpful(reviewId: string) {
  if (!mongoose.isValidObjectId(reviewId)) {
    throw new AppError("Invalid review ID", 400);
  }

  const review = await Review.findByIdAndUpdate(
    reviewId,
    { $inc: { helpfulCount: 1 } },
    { new: true }
  ).lean();

  if (!review) throw new AppError("Review not found", 404);
  return review;
}

/* ═══════════════════════════════════════════════════════
   Admin — list all reviews with filters
   ═══════════════════════════════════════════════════════ */
export async function adminListReviews(opts: {
  page: number;
  limit: number;
  isApproved?: boolean;
  productId?: string;
}) {
  const filter: Record<string, unknown> = {};
  if (opts.isApproved !== undefined) filter.isApproved = opts.isApproved;
  if (opts.productId) filter.product = opts.productId;

  const skip = (opts.page - 1) * opts.limit;

  const [items, total] = await Promise.all([
    Review.find(filter)
      .populate("product", "name slug images")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(opts.limit)
      .lean(),
    Review.countDocuments(filter),
  ]);

  return {
    items,
    pagination: {
      page: opts.page,
      limit: opts.limit,
      total,
      pages: Math.ceil(total / opts.limit),
    },
  };
}

/* ═══════════════════════════════════════════════════════
   Admin — approve or reject a review
   ═══════════════════════════════════════════════════════ */
export async function adminUpdateReview(
  id: string,
  updates: { isApproved?: boolean }
) {
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError("Invalid review ID", 400);
  }

  const review = await Review.findByIdAndUpdate(id, updates, { new: true });
  if (!review) throw new AppError("Review not found", 404);
  return review;
}

/* ═══════════════════════════════════════════════════════
   Admin — delete review
   ═══════════════════════════════════════════════════════ */
export async function adminDeleteReview(id: string) {
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError("Invalid review ID", 400);
  }

  const review = await Review.findByIdAndDelete(id);
  if (!review) throw new AppError("Review not found", 404);
  return review;
}