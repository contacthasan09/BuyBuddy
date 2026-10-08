// app/page.tsx
import { api } from "@/lib/api";
import { fetchProducts } from "@/lib/products-api";
import type { Product, Category } from "@/types";

import { HomeHero } from "@/components/home/HomeHero";
import { MarqueeStrip } from "@/components/home/MarqueeStrip";
import { FlashDeals } from "@/components/home/FlashDeals";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { AllProductsSection } from "@/components/product/AllProductsSection";
import { DropshipBenefits } from "@/components/home/DropshipBenefits";
import { TrustBadges } from "@/components/home/TrustBadges";
import { NewsletterCTA } from "@/components/home/NewsletterCTA";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let products: Product[] = [];
  let categories: Category[] = [];

  try {
    const [productsRes, catsRes] = await Promise.all([
      fetchProducts({ page: 1, limit: 24, sort: "newest" }),
      api.getCategories(),
    ]);

    products = productsRes?.items || [];
    categories = Array.isArray(catsRes) ? catsRes : [];
  } catch (err) {
    console.error("[HomePage] Failed to load data:", err);
  }

  return (
    <div className="bg-white">
      {/* 1. HERO */}
      <HomeHero />

      {/* 2. MARQUEE */}
      <MarqueeStrip />

      {/* 3. FLASH DEALS */}
      <FlashDeals products={products} />

      {/* 4. CATEGORY SHOWCASE */}
      <CategoryShowcase categories={categories} />

      {/* 5. ALL PRODUCTS */}
      <AllProductsSection products={products} categories={categories} />

      {/* 6. DROPSHIP BENEFITS */}
      <DropshipBenefits />

      {/* 7. TRUST BADGES */}
      <TrustBadges />

      {/* 8. NEWSLETTER CTA */}
      <NewsletterCTA />
    </div>
  );
}