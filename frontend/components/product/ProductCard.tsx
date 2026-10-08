"use client";

import { useState, useRef, type PointerEvent as ReactPointerEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ShoppingBag, Check, Heart, Star } from "lucide-react";
import { useCart } from "@/store/cart";
import { useToast } from "@/components/providers/ToastProvider";
import { formatBDT, getProductPrice, getDiscountPercent } from "@/lib/utils";
import { EASE } from "@/lib/motion";
import { flyToCart } from "@/lib/fly-to-cart";
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

interface ProductCardProps {
  product: Product;
  index?: number;
  featured?: boolean;
}

export function ProductCard({
  product,
  index = 0,
  featured = false,
}: ProductCardProps) {
  const { toast } = useToast();
  const addItem = useCart((s) => s.addItem);

  const [quickAdding, setQuickAdding] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const ref = useRef<HTMLAnchorElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), { stiffness: 180, damping: 18 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), { stiffness: 180, damping: 18 });

  const price = getProductPrice(product);
  const original = product.sellingPrice;
  const discount = getDiscountPercent(product);
  const stock = product.stock?.available ?? 0;
  const outOfStock = stock <= 0;

  const images =
    product.images && product.images.length > 0
      ? product.images
      : ["https://placehold.co/600x600?text=Product"];

  const primaryImage = images[0];
  const secondaryImage = images[1] || images[0];
  const hasSecondary = images.length > 1;

  function onMove(e: ReactPointerEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mouseX.set((e.clientX - r.left) / r.width - 0.5);
    mouseY.set((e.clientY - r.top) / r.height - 0.5);
  }
  function onLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock || quickAdding) return;

    const card = (e.currentTarget as HTMLElement).closest("[data-product-card]");
    const imageEl = card?.querySelector<HTMLElement>("[data-product-image]");
    if (imageEl) {
      flyToCart({ from: imageEl });
    }

    setQuickAdding(true);
    try {
      addItem(
        {
          productId: product._id,
          name: product.name,
          slug: product.slug,
          image: primaryImage,
          price,
          originalPrice: original,
          stockAvailable: stock,
        },
        1
      );
      toast(`Added ${product.name} to cart`, "success");
    } catch {
      toast("Failed to add to cart", "error");
    } finally {
      setTimeout(() => setQuickAdding(false), 1200);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlisted((v) => !v);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: index * 0.06, ease: EASE.expo }}
      className="group relative"
      style={{ perspective: 1000 }}
    >
      <Link
        ref={ref}
        href={`/product/${product.slug}`}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="block"
        style={{ transformStyle: "preserve-3d" }}
      >
        <motion.article
          data-product-card
          className="relative"
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
        >
          {/* outer gold frame on hover */}
          <div
            className="absolute -inset-[2px] rounded-sm pointer-events-none"
            style={{
              background: `linear-gradient(135deg, ${T.gold}50, ${T.goldBright}30, ${T.gold}50)`,
              opacity: 0,
              transition: "opacity 0.4s ease",
            }}
            aria-hidden
          />

          {/* card frame */}
          <div
            className="relative overflow-hidden rounded-sm"
            style={{
              background: T.bone,
              boxShadow: `0 1px 0 ${T.gold}20, 0 20px 40px -20px rgba(28,22,18,0.45), 0 6px 12px -6px rgba(28,22,18,0.25)`,
              aspectRatio: featured ? "4/5" : "1/1",
            }}
          >
            {/* inner gold hairline */}
            <div
              className="absolute inset-1.5 pointer-events-none z-20 rounded-sm"
              style={{ border: `0.5px solid ${T.gold}`, opacity: 0.3 }}
              aria-hidden
            />

            {/* corner ornaments */}
            {[
              { top: 5, left: 5, rotate: 0 },
              { top: 5, right: 5, rotate: 90 },
              { bottom: 5, right: 5, rotate: 180 },
              { bottom: 5, left: 5, rotate: 270 },
            ].map(({ rotate, ...pos }, idx) => (
              <div
                key={idx}
                className="absolute z-20 w-2.5 h-2.5 pointer-events-none"
                style={{ ...pos, transform: `rotate(${rotate}deg)` }}
                aria-hidden
              >
                <svg viewBox="0 0 10 10" fill="none">
                  <path d="M0 0 L10 0 L10 10" stroke={T.gold} strokeWidth="0.7" opacity="0.6" />
                  <circle cx="0.8" cy="0.8" r="0.6" fill={T.gold} opacity="0.8" />
                </svg>
              </div>
            ))}

            {/* Images (Optimized with Next.js Image) */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                data-product-image
                className="absolute inset-0 w-full h-full"
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image
                  src={primaryImage}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                  priority={index < 4}
                />
              </motion.div>
              
              {hasSecondary && (
                <motion.div
                  className="absolute inset-0 w-full h-full"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.6, ease: EASE.expo }}
                >
                  <Image
                    src={secondaryImage}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover"
                    loading="lazy"
                  />
                </motion.div>
              )}
            </div>

            {/* vignette */}
            <div
              className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-600"
              style={{
                background: `radial-gradient(120% 80% at 50% 100%, ${T.ink}E6 0%, transparent 60%)`,
              }}
              aria-hidden
            />

            {/* Discount wax seal */}
            {discount > 0 && (
              <motion.div
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.05, ease: [0.34, 1.56, 0.64, 1] }}
                className="absolute top-2.5 right-2.5 z-20 h-9 w-9 rounded-full flex items-center justify-center"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${T.goldBright}, ${T.gold} 70%, #8A6B3A 100%)`,
                  boxShadow: `0 3px 10px -2px rgba(184,147,90,0.6), inset 0 1px 0 ${T.goldLeaf}80`,
                }}
              >
                <div
                  className="h-[34px] w-[34px] rounded-full flex items-center justify-center"
                  style={{ border: `1px dashed ${T.ink}50` }}
                >
                  <span
                    className="text-[9px] font-bold"
                    style={{ color: T.ink, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                  >
                    −{discount}
                  </span>
                </div>
              </motion.div>
            )}

            {/* Rating */}
            {product.rating && product.rating.total > 0 && (
              <div
                className="absolute bottom-2.5 left-2.5 z-20 inline-flex items-center gap-1 px-2 py-1 rounded-sm"
                style={{
                  background: `${T.bone}E6`,
                  backdropFilter: "blur(8px)",
                  border: `0.5px solid ${T.gold}40`,
                }}
              >
                <Star className="w-3 h-3" style={{ color: T.gold, fill: T.goldBright }} strokeWidth={0} />
                <span
                  className="text-[10px] font-medium"
                  style={{ color: T.ink, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                >
                  {product.rating.average}
                </span>
              </div>
            )}

            {/* Wishlist */}
            <motion.button
              type="button"
              onClick={handleWishlist}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100"
              style={{
                background: wishlisted ? `${T.wine}E6` : `${T.bone}E6`,
                backdropFilter: "blur(8px)",
                border: `0.5px solid ${wishlisted ? T.wine : T.gold}60`,
              }}
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart
                className="w-3.5 h-3.5 transition-colors duration-300"
                strokeWidth={1.8}
                style={{
                  color: wishlisted ? T.goldLeaf : T.inkSoft,
                  fill: wishlisted ? T.wine : "transparent",
                }}
              />
            </motion.button>

            {/* Sold out */}
            {outOfStock && (
              <div
                className="absolute inset-0 z-30 flex items-center justify-center"
                style={{ background: `${T.bone}E6`, backdropFilter: "blur(4px)" }}
              >
                <span
                  className="px-4 py-2 rounded-sm"
                  style={{
                    border: `1px solid ${T.gold}50`,
                    color: T.inkSoft,
                    fontFamily: "var(--font-fraunces), Georgia, serif",
                    fontSize: "10px",
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                  }}
                >
                  Sold out
                </span>
              </div>
            )}

            {/* Quick add */}
            {!outOfStock && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileHover={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: EASE.expo }}
                className="absolute bottom-2.5 left-2.5 right-2.5 z-20"
                style={{ transform: "translateZ(20px)" }}
              >
                <motion.button
                  type="button"
                  onClick={handleQuickAdd}
                  disabled={quickAdding}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-sm transition-colors duration-300"
                  style={{
                    background: quickAdding ? `${T.gold}20` : `${T.bone}F0`,
                    backdropFilter: "blur(12px)",
                    border: `0.5px solid ${T.gold}60`,
                  }}
                  aria-label="Quick add to cart"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {quickAdding ? (
                      <motion.span
                        key="check"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" style={{ color: T.wine }} strokeWidth={2.5} />
                        <span
                          className="text-[10px] font-semibold tracking-[0.15em] uppercase"
                          style={{ color: T.wine, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                        >
                          Added
                        </span>
                      </motion.span>
                    ) : (
                      <motion.span
                        key="bag"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-1.5"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" style={{ color: T.ink }} strokeWidth={1.8} />
                        <span
                          className="text-[10px] font-semibold tracking-[0.15em] uppercase"
                          style={{ color: T.ink, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                        >
                          Add to cart
                        </span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </motion.div>
            )}
          </div>

          {/* ── Body ── */}
          <div className="mt-3 flex items-start justify-between gap-2" style={{ transform: "translateZ(15px)" }}>
            <div className="min-w-0 flex-1">
              <h3
                className="line-clamp-2 leading-snug"
                style={{
                  color: T.ink,
                  fontFamily: "var(--font-fraunces), Georgia, serif",
                  fontSize: "14px",
                }}
              >
                {product.name}
              </h3>
              {stock > 0 && stock <= 10 && (
                <p
                  className="mt-1.5 flex items-center gap-1.5"
                  style={{ color: T.inkSoft, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                >
                  <span className="h-px w-3" style={{ background: T.gold, opacity: 0.6 }} />
                  <span className="text-[9px] tracking-[0.25em] uppercase">
                    Only {stock} left
                  </span>
                </p>
              )}
            </div>
            <div className="text-right shrink-0">
              <div
                className="text-[14px] font-medium tabular-nums"
                style={{ color: T.ink, fontFamily: "var(--font-fraunces), Georgia, serif" }}
              >
                {formatBDT(price)}
              </div>
              {discount > 0 && (
                <div className="text-[10px] line-through tabular-nums" style={{ color: T.inkSoft, opacity: 0.5 }}>
                  {formatBDT(original)}
                </div>
              )}
            </div>
          </div>
        </motion.article>
      </Link>
    </motion.div>
  );
}