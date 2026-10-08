import { api } from "./api";
import type { Product, PaginatedResult } from "@/types";

export interface ProductsQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sort?: "newest" | "price_asc" | "price_desc" | "name_asc";
  featured?: boolean;
}

export interface ProductsResult extends PaginatedResult<Product> {}

/**
 * Fetch products from the backend with normalized defaults.
 * Never throws — returns an empty result on failure so the page renders.
 */
export async function fetchProducts(
  query: ProductsQuery = {}
): Promise<ProductsResult> {
  const {
    page = 1,
    limit = 12,
    search = "",
    category = "",
    sort = "newest",
    featured,
  } = query;

  try {
    const res = await api.getProducts({
      page,
      limit,
      search: search || undefined,
      category: category || undefined,
      sort,
      featured,
    });

    return {
      items: res?.items || [],
      pagination: res?.pagination || {
        page: 1,
        limit,
        total: 0,
        pages: 0,
      },
    };
  } catch (err) {
    console.error("[fetchProducts] failed:", err);
    return {
      items: [],
      pagination: { page: 1, limit, total: 0, pages: 0 },
    };
  }
}