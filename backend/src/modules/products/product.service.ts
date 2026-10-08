import mongoose from "mongoose";
import { Product } from "./product.model";
import { AppError } from "../../utils/AppError";
import { Inventory } from "../inventory/inventory.model";
import { Review } from "../reviews/review.model";

/* ═══════════════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════════════ */
interface ListOptions {
  page: number;
  limit: number;
  search?: string;
  category?: string;
  status?: string;
  featured?: boolean;
  sort: "newest" | "price_asc" | "price_desc" | "name_asc";
}

export interface StockInfo {
  physical: number;
  reserved: number;
  available: number;
}

export interface RatingInfo {
  average: number;
  total: number;
}

export interface ProductListItem {
  _id: mongoose.Types.ObjectId | string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription?: string;
  images: string[];
  category?: mongoose.Types.ObjectId | { _id: string; name: string; slug: string } | string;
  costPrice: number;
  sellingPrice: number;
  discountPrice?: number;
  tags: string[];
  status: string;
  isFeatured: boolean;
  specifications?: { key: string; value: string }[];
  stock: StockInfo;
  rating: RatingInfo;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ProductListResult {
  items: ProductListItem[];
  pagination: Pagination;
}

const EMPTY_STOCK: StockInfo = { physical: 0, reserved: 0, available: 0 };
const EMPTY_RATING: RatingInfo = { average: 0, total: 0 };

/* ═══════════════════════════════════════════════════════
   Helper — build rating map for a set of product IDs
   ═══════════════════════════════════════════════════════ */
async function buildRatingMap(
  productIds: (mongoose.Types.ObjectId | string)[]
): Promise<Map<string, RatingInfo>> {
  if (productIds.length === 0) return new Map();

  const agg = await Review.aggregate([
    {
      $match: {
        product: {
          $in: productIds.map((id) =>
            typeof id === "string" ? new mongoose.Types.ObjectId(id) : id
          ),
        },
        isApproved: true,
      },
    },
    {
      $group: {
        _id: "$product",
        avg: { $avg: "$rating" },
        total: { $sum: 1 },
      },
    },
  ]);

  const map = new Map<string, RatingInfo>();
  for (const row of agg) {
    map.set(String(row._id), {
      average: Number((row.avg || 0).toFixed(1)),
      total: row.total || 0,
    });
  }
  return map;
}

/* ═══════════════════════════════════════════════════════
   List products with pagination, filters, stock & rating
   ═══════════════════════════════════════════════════════ */
export async function listProducts(
  opts: ListOptions
): Promise<ProductListResult> {
  const filter: Record<string, unknown> = {};
  if (opts.status) filter.status = opts.status;
  if (opts.category) filter.category = opts.category;
  if (opts.featured !== undefined) filter.isFeatured = opts.featured;
  if (opts.search) filter.$text = { $search: opts.search };

  const sortMap = {
    newest: { createdAt: -1 },
    price_asc: { sellingPrice: 1 },
    price_desc: { sellingPrice: -1 },
    name_asc: { name: 1 },
  } as const;

  const skip = (opts.page - 1) * opts.limit;

  const [items, total] = await Promise.all([
    Product.find(filter)
      .populate("category", "name slug")
      .sort(sortMap[opts.sort])
      .skip(skip)
      .limit(opts.limit)
      .lean(),
    Product.countDocuments(filter),
  ]);

  // ── Fetch inventory in one query ──
  const productIds = items.map((p) => p._id);
  const inventories = await Inventory.find({
    product: { $in: productIds },
  }).lean();

  const stockMap = new Map<string, StockInfo>(
    inventories.map((i) => [
      String(i.product),
      {
        physical: i.physical,
        reserved: i.reserved,
        available: i.available,
      },
    ])
  );

  // ── Fetch rating summaries in one query ──
  const ratingMap = await buildRatingMap(productIds);

  // ── Combine ──
  const enriched: ProductListItem[] = items.map((p) => ({
    ...(p as any),
    stock: stockMap.get(String(p._id)) || EMPTY_STOCK,
    rating: ratingMap.get(String(p._id)) || EMPTY_RATING,
  }));

  return {
    items: enriched,
    pagination: {
      page: opts.page,
      limit: opts.limit,
      total,
      pages: Math.ceil(total / opts.limit),
    },
  };
}

/* ═══════════════════════════════════════════════════════
   Get single product by slug — with stock & rating
   ═══════════════════════════════════════════════════════ */
export async function getProductBySlug(
  slug: string
): Promise<ProductListItem> {
  const product = await Product.findOne({ slug })
    .populate("category", "name slug")
    .lean();
  if (!product) throw new AppError("Product not found", 404);

  const [inventory, ratingMap] = await Promise.all([
    Inventory.findOne({ product: product._id }).lean(),
    buildRatingMap([product._id]),
  ]);

  return {
    ...(product as any),
    stock: inventory
      ? {
          physical: inventory.physical,
          reserved: inventory.reserved,
          available: inventory.available,
        }
      : EMPTY_STOCK,
    rating: ratingMap.get(String(product._id)) || EMPTY_RATING,
  };
}

/* ═══════════════════════════════════════════════════════
   Get single product by ID — with stock & rating
   ═══════════════════════════════════════════════════════ */
export async function getProductById(
  id: string
): Promise<ProductListItem> {
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError("Invalid product ID", 400);
  }

  const product = await Product.findById(id)
    .populate("category", "name slug")
    .lean();
  if (!product) throw new AppError("Product not found", 404);

  const [inventory, ratingMap] = await Promise.all([
    Inventory.findOne({ product: product._id }).lean(),
    buildRatingMap([product._id]),
  ]);

  return {
    ...(product as any),
    stock: inventory
      ? {
          physical: inventory.physical,
          reserved: inventory.reserved,
          available: inventory.available,
        }
      : EMPTY_STOCK,
    rating: ratingMap.get(String(product._id)) || EMPTY_RATING,
  };
}

/* ═══════════════════════════════════════════════════════
   Create product — also creates inventory record
   ═══════════════════════════════════════════════════════ */
export async function createProduct(data: Record<string, unknown>) {
  const product = await Product.create(data);

  // Create inventory with 0 stock
  await Inventory.create({
    product: product._id,
    physical: 0,
    reserved: 0,
    available: 0,
    lowStockThreshold: 5,
  });

  return product;
}

/* ═══════════════════════════════════════════════════════
   Update product
   ═══════════════════════════════════════════════════════ */
export async function updateProduct(
  id: string,
  data: Record<string, unknown>
) {
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError("Invalid product ID", 400);
  }

  const product = await Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!product) throw new AppError("Product not found", 404);
  return product;
}

/* ═══════════════════════════════════════════════════════
   Delete product — also removes inventory record
   ═══════════════════════════════════════════════════════ */
export async function deleteProduct(id: string) {
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError("Invalid product ID", 400);
  }

  const product = await Product.findByIdAndDelete(id);
  if (!product) throw new AppError("Product not found", 404);

  // Clean up inventory
  await Inventory.deleteOne({ product: id });

  return product;
}