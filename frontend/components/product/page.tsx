import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { api } from "@/lib/api";
import { fetchProducts } from "@/lib/products-api";
import type { Category } from "@/types";

import { ProductsHero } from "@/components/product/ProductsHero";
import { ProductFilters } from "@/components/product/ProductFilters";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductGridSkeleton } from "@/components/product/ProductSkeleton";
import { EmptyProducts } from "@/components/product/EmptyProducts";

export const dynamic = "force-dynamic";

/* ——————————————————————————————————————————————
   Palette — Maison edition
—————————————————————————————————————————————— */
const T = {
  bg: "#EFE7D4",
  ink: "#1C1612",
  inkSoft: "#5C4F42",
  gold: "#B8935A",
  goldBright: "#D4B478",
  goldLeaf: "#E8D4A0",
  wine: "#5A1A1F",
  bone: "#F7F1E3",
};

/* ——————————————————————————————————————————————
   SVG noise — organic paper grain
—————————————————————————————————————————————— */
function Grain() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.09] mix-blend-multiply"
    >
      <filter id="grain-page">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain-page)" />
    </svg>
  );
}

interface SearchParams {
  page?: string;
  search?: string;
  category?: string;
  sort?: string;
}

type Props = {
  searchParams: SearchParams;
};

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  buildUrl: (page: number) => string;
}

function Pagination({ currentPage, totalPages, buildUrl }: PaginationProps) {
  return (
    <nav className="flex items-center justify-center gap-4 md:gap-8" aria-label="Pagination">
      {currentPage > 1 && (
        <Link
          href={buildUrl(currentPage - 1)}
          className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-sm transition-all duration-300"
          style={{
            border: `1px solid ${T.gold}40`,
            color: T.ink,
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontSize: "10px",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            fontWeight: 500,
          }}
        >
          <svg width="12" height="8" viewBox="0 0 14 10" fill="none" className="group-hover:-translate-x-1 transition-transform duration-300">
            <path d="M13 5 H1 M5 1 L1 5 L5 9" stroke="currentColor" strokeWidth="1" />
          </svg>
          Previous
        </Link>
      )}
      
      <span 
        className="px-4 py-2 text-[10px] tracking-[0.3em] uppercase flex items-center gap-2"
        style={{ color: T.inkSoft, fontFamily: "var(--font-fraunces), Georgia, serif" }}
      >
        Page {currentPage} 
        <span style={{ color: T.gold, fontSize: "8px" }}>❖</span> 
        {totalPages}
      </span>

      {currentPage < totalPages && (
        <Link
          href={buildUrl(currentPage + 1)}
          className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-sm transition-all duration-300"
          style={{
            border: `1px solid ${T.gold}40`,
            color: T.ink,
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontSize: "10px",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            fontWeight: 500,
          }}
        >
          Next
          <svg width="12" height="8" viewBox="0 0 14 10" fill="none" className="group-hover:translate-x-1 transition-transform duration-300">
            <path d="M1 5 H13 M9 1 L13 5 L9 9" stroke="currentColor" strokeWidth="1" />
          </svg>
        </Link>
      )}
    </nav>
  );
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const search = searchParams.search;
  const title = search ? `Search: ${search}` : "All Products";
  return {
    title: `${title} | Maison`,
    description: search
      ? `Curated pieces matching "${search}" — available with Cash on Delivery across Bangladesh.`
      : "Browse our carefully selected collections of quality pieces, available with Cash on Delivery across Bangladesh.",
  };
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

  const [productsRes, categories] = await Promise.all([
    fetchProducts({ page, limit: 12, search, category, sort }),
    api.getCategories().catch(() => []) as Promise<Category[]>,
  ]);

  const products = productsRes.items;
  const pagination = productsRes.pagination;
  const activeCategory = categories.find((c) => c._id === category);

  const buildPageUrl = (targetPage: number) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (sort !== "newest") params.set("sort", sort);
    if (targetPage > 1) params.set("page", String(targetPage));
    const qs = params.toString();
    return `/products${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="min-h-screen relative" style={{ background: T.bg, color: T.ink }}>
      <Grain />
      
      {/* Top gold rule */}
      <div 
        className="relative h-px w-full" 
        style={{ background: `linear-gradient(90deg, transparent, ${T.gold}40 20%, ${T.gold}40 80%, transparent)` }} 
      />

      {/* Hero */}
      <ProductsHero
        total={pagination.total}
        search={search}
        categoryName={activeCategory?.name}
      />

      {/* Filters */}
      <Suspense fallback={null}>
        <ProductFilters
          categories={categories}
          currentSearch={search}
          currentCategory={category}
          currentSort={sort}
          total={pagination.total}
        />
      </Suspense>

      {/* Results */}
      <section className="container-x py-12 md:py-16">
        <Suspense fallback={<ProductGridSkeleton />}>
          {products.length === 0 ? (
            <EmptyProducts search={search} category={activeCategory?.name} />
          ) : (
            <>
              <ProductGrid products={products} />

              {pagination.pages > 1 && (
                <div className="mt-16 md:mt-20">
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.pages}
                    buildUrl={buildPageUrl}
                  />
                </div>
              )}
            </>
          )}
        </Suspense>
      </section>

      {/* Bottom gold rule */}
      <div 
        className="relative h-px w-full mt-8" 
        style={{ background: `linear-gradient(90deg, transparent, ${T.gold}40 20%, ${T.gold}40 80%, transparent)` }} 
      />
    </div>
  );
}