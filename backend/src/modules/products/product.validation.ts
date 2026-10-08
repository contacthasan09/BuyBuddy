import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(2).max(200),
  slug: z.string().min(2).max(200).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  sku: z.string().min(2).max(50),
  description: z.string().min(10),
  shortDescription: z.string().max(300).optional(),
  images: z.array(z.string().url()).default([]),
  category: z.string().regex(/^[a-f\d]{24}$/i).optional(),
  costPrice: z.number().nonnegative(),
  sellingPrice: z.number().nonnegative(),
  discountPrice: z.number().nonnegative().optional(),
  tags: z.array(z.string()).default([]),
  status: z.enum(["draft", "active", "archived"]).default("active"),
  isFeatured: z.boolean().default(false),
  specifications: z
    .array(z.object({ key: z.string(), value: z.string() }))
    .default([]),
});

export const updateProductSchema = createProductSchema.partial();

export const listProductsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().optional(),
  category: z.string().optional(),
  status: z.enum(["draft", "active", "archived"]).optional(),
  featured: z.coerce.boolean().optional(),
  sort: z.enum(["newest", "price_asc", "price_desc", "name_asc"]).default("newest"),
});