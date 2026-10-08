import { z } from "zod";

export const createReviewSchema = z.object({
  productId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid product ID"),
  customerName: z.string().min(2).max(80),
  customerPhone: z.string().min(11).max(15),
  customerEmail: z.string().email().optional().or(z.literal("")),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(120).optional(),
  comment: z.string().min(4).max(2000),
  images: z.array(z.string().url()).max(5).default([]),
});

export const listReviewsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  sort: z
    .enum(["newest", "helpful", "rating_high", "rating_low"])
    .default("newest"),
});

export const adminListReviewsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  isApproved: z.coerce.boolean().optional(),
  productId: z.string().regex(/^[a-f\d]{24}$/i).optional(),
});