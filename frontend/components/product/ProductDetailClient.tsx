"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Star } from "lucide-react";

import { ProductGallery } from "./ProductGallery";
import { QuantitySelector } from "./QuantitySelector";
import { ProductActions } from "./ProductActions";
import { DeliveryInfo } from "./DeliveryInfo";
import { TrustPanel } from "./TrustPanel";
import { SpecTable } from "./SpecTable";
import { ReviewsSection } from "./ReviewsSection";
import { StickyBuyBar } from "./StickyBuyBar";
import { ProductQnA } from "./ProductQnA";

import { StockUrgency } from "@/components/engagement/StockUrgency";
import { WishlistButton } from "@/components/engagement/WishlistButton";
import { RecentlyViewed } from "@/components/engagement/RecentlyViewed";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { formatBDT, getProductPrice, getDiscountPercent } from "@/lib/utils";
import { fadeUp, staggerContainer, EASE } from "@/lib/motion";
import type { Product } from "@/types";

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

interface ProductDetailClientProps {
  product: Product;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const galleryRef = useRef<HTMLDivElement>(null);
  const [quantity, setQuantity] = useState(1);
  const { track } = useRecentlyViewed();

  const price = getProductPrice(product);
  const original = product.sellingPrice;
  const discount = getDiscountPercent(product);
  const stock = product.stock?.available ?? 0;
  const outOfStock = stock <= 0;

  const primaryImage =
    product.images?.[0] || "https://placehold.co/600x600?text=Product";

  const categoryName =
    typeof product.category === "object" && product.category
      ? (product.category as any).name
      : undefined;

  const categoryId =
    typeof product.category === "object" && product.category
      ? (product.category as any)._id
      : typeof product.category === "string"
      ? product.category
      : undefined;

  useEffect(() => {
    if (!product) return;
    track({
      _id: product._id,
      name: product.name,
      slug: product.slug,
      image: primaryImage,
      price,
      viewedAt: Date.now(),
    });
  }, [product, track, primaryImage, price]);

  return (
    <div className="relative min-h-screen" style={{ background: T.bg, color: T.ink }}>
      {/* Top gold rule */}
      <div
        className="relative h-px w-full"
        style={{ background: `linear-gradient(90deg, transparent, ${T.gold}40 20%, ${T.gold}40 80%, transparent)` }}
      />

      {/* ── Breadcrumb ── */}
      <nav className="container-x pt-6 pb-4">
        <ol className="flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase flex-wrap">
          <li>
            <Link
              href="/"
              className="transition-colors duration-300 hover:text-[color:var(--gold)]"
              style={{ color: T.inkSoft, fontFamily: "var(--font-fraunces), Georgia, serif" }}
            >
              Home
            </Link>
          </li>
          <ChevronRight className="w-3 h-3" style={{ color: T.gold, opacity: 0.6 }} />
          <li>
            <Link
              href="/products"
              className="transition-colors duration-300 hover:text-[color:var(--gold)]"
              style={{ color: T.inkSoft, fontFamily: "var(--font-fraunces), Georgia, serif" }}
            >
              Collection
            </Link>
          </li>
          {categoryName && (
            <>
              <ChevronRight className="w-3 h-3" style={{ color: T.gold, opacity: 0.6 }} />
              <li>
                {categoryId ? (
                  <Link
                    href={`/products?category=${categoryId}`}
                    className="transition-colors duration-300 hover:text-[color:var(--gold)]"
                    style={{ color: T.ink, fontFamily: "var(--font-fraunces), Georgia, serif", fontWeight: 500 }}
                  >
                    {categoryName}
                  </Link>
                ) : (
                  <span className="truncate max-w-[200px]" style={{ color: T.ink, fontFamily: "var(--font-fraunces), Georgia, serif", fontWeight: 500 }}>
                    {categoryName}
                  </span>
                )}
              </li>
            </>
          )}
        </ol>
      </nav>

      {/* ═══════════════════════════════════════════════════
          Main split — Gallery + Info
         ═══════════════════════════════════════════════════ */}
      <section className="container-x pb-16 md:pb-24" ref={galleryRef}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* ════════ GALLERY ════════ */}
          <ProductGallery
            images={product.images || []}
            productName={product.name}
            discount={discount}
            isFeatured={product.isFeatured}
            outOfStock={outOfStock}
          />

          {/* ════════ INFO PANEL ════════ */}
          <motion.div
            variants={staggerContainer(0.08)}
            initial="hidden"
            animate="visible"
            className="flex flex-col"
          >
            {/* Category */}
            {categoryName && (
              <motion.p
                variants={fadeUp}
                className="mb-4"
                style={{
                  color: T.gold,
                  fontFamily: "var(--font-fraunces), Georgia, serif",
                  fontSize: "10px",
                  letterSpacing: "0.35em",
                  textTransform: "uppercase",
                  fontWeight: 500,
                }}
              >
                {categoryName}
              </motion.p>
            )}

            {/* Product name */}
            <motion.h1
              variants={fadeUp}
              className="mb-5 leading-[0.95] tracking-[-0.02em]"
              style={{
                color: T.ink,
                fontFamily: "var(--font-fraunces), Georgia, serif",
                fontSize: "clamp(32px, 4vw, 48px)",
                fontWeight: 400,
              }}
            >
              {product.name}
            </motion.h1>

            {/* Rating row */}
            <motion.div variants={fadeUp} className="flex items-center gap-2 mb-6">
              {(product as any).rating && (product as any).rating.total > 0 ? (
                <>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5"
                        style={{
                          fill: i <= Math.round((product as any).rating.average) ? T.goldBright : "transparent",
                          color: i <= Math.round((product as any).rating.average) ? T.gold : `${T.inkSoft}40`,
                        }}
                        strokeWidth={1.5}
                      />
                    ))}
                  </div>
                  <span
                    className="text-[11px]"
                    style={{ color: T.inkSoft, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                  >
                    {(product as any).rating.average} · {(product as any).rating.total} review
                    {(product as any).rating.total !== 1 ? "s" : ""}
                  </span>
                </>
              ) : (
                <span
                  className="text-[11px] italic"
                  style={{ color: T.inkSoft, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                >
                  Awaiting first reviews
                </span>
              )}
            </motion.div>

            {/* Price row */}
            <motion.div variants={fadeUp} className="flex items-baseline gap-4 mb-6 flex-wrap">
              <span
                className="tabular-nums"
                style={{
                  color: T.ink,
                  fontFamily: "var(--font-fraunces), Georgia, serif",
                  fontSize: "clamp(28px, 3vw, 36px)",
                  fontWeight: 500,
                }}
              >
                {formatBDT(price)}
              </span>
              {discount > 0 && (
                <>
                  <span
                    className="text-[14px] line-through tabular-nums"
                    style={{ color: T.inkSoft, opacity: 0.6 }}
                  >
                    {formatBDT(original)}
                  </span>
                  <span
                    className="px-3 py-1 rounded-sm text-[10px] tracking-[0.2em] uppercase font-semibold"
                    style={{
                      background: `${T.wine}10`,
                      color: T.wine,
                      border: `1px solid ${T.wine}30`,
                      fontFamily: "var(--font-fraunces), Georgia, serif",
                    }}
                  >
                    Save {formatBDT(original - price)}
                  </span>
                </>
              )}
            </motion.div>

            {/* Short description */}
            {product.shortDescription && (
              <motion.p
                variants={fadeUp}
                className="leading-relaxed mb-8"
                style={{
                  color: T.inkSoft,
                  fontFamily: "var(--font-fraunces), Georgia, serif",
                  fontSize: "15px",
                  lineHeight: "1.7",
                }}
              >
                {product.shortDescription}
              </motion.p>
            )}

            {/* Stock status */}
            <motion.div variants={fadeUp} className="mb-6 flex items-center gap-3 flex-wrap">
              {stock > 0 && stock > 15 && (
                <span
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-sm"
                  style={{
                    background: T.bone,
                    border: `1px solid ${T.gold}40`,
                    color: T.ink,
                    fontFamily: "var(--font-fraunces), Georgia, serif",
                    fontSize: "10px",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--gold)] animate-pulse" />
                  In stock
                </span>
              )}
              <StockUrgency stock={stock} />
              {stock === 0 && (
                <span
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-sm"
                  style={{
                    background: T.bone,
                    border: `1px solid ${T.wine}40`,
                    color: T.wine,
                    fontFamily: "var(--font-fraunces), Georgia, serif",
                    fontSize: "10px",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--wine)]" />
                  Sold out
                </span>
              )}
            </motion.div>

            {/* Quantity selector */}
            {!outOfStock && (
              <motion.div variants={fadeUp} className="mb-8">
                <QuantitySelector
                  value={quantity}
                  max={stock}
                  onChange={setQuantity}
                />
              </motion.div>
            )}

            {/* Actions */}
            {!outOfStock && (
              <motion.div variants={fadeUp} className="mb-8 space-y-3">
                <ProductActions
                  product={product}
                  quantity={quantity}
                  imageRef={galleryRef}
                />
                <WishlistButton
                  product={{
                    _id: product._id,
                    name: product.name,
                    slug: product.slug,
                    image: primaryImage,
                    price,
                    originalPrice: original,
                  }}
                  variant="full"
                  className="w-full justify-center"
                />
              </motion.div>
            )}

            {/* Delivery info */}
            <motion.div variants={fadeUp} className="mb-8">
              <DeliveryInfo />
            </motion.div>

            {/* Trust panel */}
            <TrustPanel />
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          Description + Specifications
         ═══════════════════════════════════════════════════ */}
      <section
        className="border-t"
        style={{
          background: T.bone,
          borderColor: `${T.gold}30`,
        }}
      >
        <div className="container-x py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10 lg:gap-16">
            <ScrollReveal direction="left">
              <div className="flex items-center gap-3 mb-4">
                <span className="h-px w-8" style={{ background: T.gold, opacity: 0.5 }} />
                <p
                  className="text-[9px] tracking-[0.4em] uppercase"
                  style={{ color: T.gold, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                >
                  Details
                </p>
              </div>
              <h2
                className="leading-[0.95] tracking-[-0.02em]"
                style={{
                  color: T.ink,
                  fontFamily: "var(--font-fraunces), Georgia, serif",
                  fontSize: "clamp(28px, 3vw, 40px)",
                  fontWeight: 400,
                }}
              >
                About this <span className="italic font-light" style={{ color: T.wine }}>piece.</span>
              </h2>
            </ScrollReveal>

            <div className="space-y-8">
              <ScrollReveal direction="up">
                <p
                  className="leading-relaxed whitespace-pre-wrap"
                  style={{
                    color: T.inkSoft,
                    fontFamily: "var(--font-fraunces), Georgia, serif",
                    fontSize: "15px",
                    lineHeight: "1.8",
                  }}
                >
                  {product.description}
                </p>
              </ScrollReveal>

              {product.specifications && product.specifications.length > 0 && (
                <ScrollReveal direction="up" delay={0.1}>
                  <SpecTable specs={product.specifications} />
                </ScrollReveal>
              )}

              {product.tags && product.tags.length > 0 && (
                <ScrollReveal direction="up" delay={0.15}>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 rounded-sm text-[10px] tracking-[0.2em] uppercase transition-colors duration-300 cursor-default"
                        style={{
                          color: T.inkSoft,
                          fontFamily: "var(--font-fraunces), Georgia, serif",
                          background: "transparent",
                          border: `1px solid ${T.gold}30`,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = T.gold;
                          e.currentTarget.style.color = T.ink;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = `${T.gold}30`;
                          e.currentTarget.style.color = T.inkSoft;
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </ScrollReveal>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          Reviews
         ═══════════════════════════════════════════════════ */}
      <section className="container-x py-16 md:py-20">
        <ReviewsSection productId={product._id} productName={product.name} />
      </section>

      {/* ═══════════════════════════════════════════════════
          Q&A
         ═══════════════════════════════════════════════════ */}
      <section
        className="container-x py-16 md:py-20 border-t"
        style={{ borderColor: `${T.gold}30` }}
      >
        <ProductQnA productId={product._id} />
      </section>

      {/* ═══════════════════════════════════════════════════
          Recently viewed
         ═══════════════════════════════════════════════════ */}
      <RecentlyViewed excludeProductId={product._id} />

      {/* ═══════════════════════════════════════════════════
          Sticky mobile buy bar
         ═══════════════════════════════════════════════════ */}
      {!outOfStock && <StickyBuyBar product={product} quantity={quantity} />}

      {/* Bottom gold rule */}
      <div
        className="relative h-px w-full mt-8"
        style={{ background: `linear-gradient(90deg, transparent, ${T.gold}40 20%, ${T.gold}40 80%, transparent)` }}
      />
    </div>
  );
}