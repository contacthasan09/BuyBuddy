import { Suspense } from "react";
import type { Metadata } from "next";
import { api } from "@/lib/api";
import { fetchProducts } from "@/lib/products-api";
import type { Category } from "@/types";

import { ProductsHero } from "@/components/product/ProductsHero";
import { ProductFilters } from "@/components/product/ProductFilters";
import { ProductGrid } from "@/components/product/ProductGrid";
import { EmptyProducts } from "@/components/product/EmptyProducts";
import { Pagination } from "@/components/product/Pagination";

export const dynamic = "force-dynamic";

interface SearchParams {
  page?: string;
  search?: string;
  category?: string;
  sort?: string;
}

type Props = {
  searchParams: SearchParams;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const search = searchParams.search;
  const title = search ? `Search: ${search}` : "All Products";
  return {
    title,
    description: search
      ? `Products matching "${search}" — Cash on Delivery across Bangladesh.`
      : "Browse quality products with Cash on Delivery across Bangladesh.",
  };
}

function normalizeCategories(input: unknown): Category[] {
  if (!input) return [];

  if (Array.isArray(input)) {
    return input
      .filter((c) => c && typeof c === "object" && "_id" in c && "name" in c)
      .map((c: any) => ({
        _id: String(c._id),
        name: String(c.name),
        slug: String(c.slug || c.name.toLowerCase().replace(/\s+/g, "-")),
        description: c.description ? String(c.description) : undefined,
        image: c.image ? String(c.image) : undefined,
      }));
  }

  const wrapped = (input as any).items;
  if (Array.isArray(wrapped)) return normalizeCategories(wrapped);

  const data = (input as any).data;
  if (Array.isArray(data)) return normalizeCategories(data);

  return [];
}

export default async function ProductsPage({ searchParams }: Props) {
  const page = Math.max(1, Number(searchParams.page) || 1);
  const search = (searchParams.search || "").trim();
  const category = (searchParams.category || "").trim();
  const sortRaw = searchParams.sort || "newest";
  const sort = (
    ["newest", "price_asc", "price_desc", "name_asc"].includes(sortRaw)
      ? sortRaw
      : "newest"
  ) as "newest" | "price_asc" | "price_desc" | "name_asc";

  const [productsRes, rawCategories] = await Promise.all([
    fetchProducts({ page, limit: 12, search, category, sort }),
    api.getCategories().catch(() => []),
  ]);

  const products = productsRes.items;
  const pagination = productsRes.pagination;
  const categories = normalizeCategories(rawCategories);

  const activeCategory = categories.find((c) => c._id === category);

  return (
    <div className="bg-white">
      <ProductsHero
        total={pagination.total}
        search={search}
        categoryName={activeCategory?.name}
      />

      <Suspense fallback={<div className="h-24" />}>
        <ProductFilters
          categories={categories}
          currentSearch={search}
          currentCategory={category}
          currentSort={sort}
          total={pagination.total}
        />
      </Suspense>

      <section className="container-x py-12 md:py-16">
        {products.length === 0 ? (
          <EmptyProducts
            search={search}
            category={activeCategory?.name}
          />
        ) : (
          <>
            <ProductGrid products={products} />

            {pagination.pages > 1 && (
              <div className="mt-16">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.pages}
                />
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}