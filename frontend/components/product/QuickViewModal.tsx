"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X, ShoppingBag } from "lucide-react";
import { useCart } from "@/store/cart";
import { useCartDrawer } from "@/store/cart-drawer";
import { useToast } from "@/components/providers/ToastProvider";
import { formatBDT, getProductPrice, getDiscountPercent } from "@/lib/utils";
import { flyToCart } from "@/lib/fly-to-cart";
import { EASE } from "@/lib/motion";
import type { Product } from "@/types";

/* ——————————————————————————————————————————————
   Palette — Maison edition
—————————————————————————————————————————————— */
const T = {
  bg: "#EFE7D4",
  ink: "#1C1612",
  inkDeep: "#0E0A07",
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
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07] mix-blend-soft-light"
    >
      <filter id="grain-modal">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.7 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain-modal)" />
    </svg>
  );
}

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const addItem = useCart((s) => s.addItem);
  const openDrawer = useCartDrawer((s) => s.open);
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!product) return;
    setQuantity(1);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [product, onClose]);

  if (!product) return null;

  const price = getProductPrice(product);
  const original = product.sellingPrice;
  const discount = getDiscountPercent(product);
  const stock = product.stock?.available ?? 0;
  const primaryImage =
    product.images?.[0] || "https://placehold.co/600x600?text=Product";

  const handleAdd = () => {
    const cartBtn = document.querySelector<HTMLElement>("[data-cart-icon]");
    if (cartBtn) {
      flyToCart({ from: cartBtn });
    }
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
      quantity
    );
    toast(`Added ${quantity} × ${product.name}`, "success");
    onClose();
    setTimeout(() => openDrawer(), 250);
  };

  return (
    <AnimatePresence>
      {product && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8"
            style={{ background: `${T.inkDeep}E6` }}
            aria-hidden
          >
            <Grain />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background: `radial-gradient(circle at center, transparent 40%, ${T.inkDeep} 100%)`,
              }}
            />
          </motion.div>

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 16, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.97, y: 16, filter: "blur(8px)" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-4xl z-[201] overflow-hidden rounded-sm shadow-2xl flex flex-col md:flex-row"
            style={{
              background: T.bone,
              border: `1px solid ${T.gold}40`,
              boxShadow: `0 1px 0 ${T.gold}20, 0 40px 80px -20px rgba(28,22,18,0.5)`,
              maxHeight: "90vh",
            }}
            role="dialog"
            aria-modal="true"
          >
            {/* Inner gold hairline */}
            <div
              className="absolute inset-1.5 pointer-events-none z-20 rounded-sm"
              style={{ border: `0.5px solid ${T.gold}`, opacity: 0.2 }}
              aria-hidden
            />

            {/* Corner ornaments */}
            {[
              { top: 6, left: 6, rotate: 0 },
              { top: 6, right: 6, rotate: 90 },
              { bottom: 6, right: 6, rotate: 180 },
              { bottom: 6, left: 6, rotate: 270 },
            ].map((pos, idx) => {
              const { rotate, ...position } = pos;

              return (
                <div
                  key={idx}
                  className="absolute z-20 w-3 h-3 pointer-events-none"
                  style={{ ...position, transform: `rotate(${rotate}deg)` }}
                  aria-hidden
                >
                  <svg viewBox="0 0 12 12" fill="none">
                    <path d="M0 0 L12 0 L12 12" stroke={T.gold} strokeWidth="0.8" opacity="0.6" />
                    <circle cx="1" cy="1" r="0.8" fill={T.gold} opacity="0.8" />
                  </svg>
                </div>
              );
            })}

            {/* Close Button */}
            <motion.button
              type="button"
              onClick={onClose}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="absolute top-4 right-4 z-30 w-9 h-9 rounded-sm flex items-center justify-center transition-all duration-300"
              style={{
                border: `1px solid ${T.gold}30`,
                background: `${T.bone}F0`,
                backdropFilter: "blur(8px)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = T.gold;
                e.currentTarget.style.background = `${T.gold}15`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = `${T.gold}30`;
                e.currentTarget.style.background = `${T.bone}F0`;
              }}
              aria-label="Close modal"
            >
              <X className="w-4 h-4" strokeWidth={1.5} style={{ color: T.inkSoft }} />
            </motion.button>

            {/* Image Section */}
            <div className="relative w-full md:w-1/2 aspect-square md:aspect-auto">
              <div className="absolute inset-0 overflow-hidden">
                <motion.img
                  src={primaryImage}
                  alt={product.name}
                  initial={{ scale: 1.05 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8, ease: EASE.expo }}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Vignette */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(120% 80% at 50% 100%, ${T.ink}40 0%, transparent 60%)`,
                }}
                aria-hidden
              />

              {/* Discount Wax Seal */}
              {discount > 0 && (
                <motion.div
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.6, delay: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                  className="absolute top-4 left-4 z-20 h-11 w-11 rounded-full flex items-center justify-center"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${T.goldBright}, ${T.gold} 70%, #8A6B3A 100%)`,
                    boxShadow: `0 4px 12px -2px rgba(184,147,90,0.5), inset 0 1px 0 ${T.goldLeaf}80`,
                  }}
                >
                  <div
                    className="h-[42px] w-[42px] rounded-full flex items-center justify-center"
                    style={{ border: `1px dashed ${T.ink}50` }}
                  >
                    <span
                      className="text-[11px] font-bold"
                      style={{ color: T.ink, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                    >
                      −{discount}
                    </span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Info Section */}
            <div className="flex-1 flex flex-col p-6 md:p-8 lg:p-10 overflow-y-auto">
              <div className="flex-1">
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="mb-3"
                  style={{
                    color: T.gold,
                    fontFamily: "var(--font-fraunces), Georgia, serif",
                    fontSize: "10px",
                    letterSpacing: "0.35em",
                    textTransform: "uppercase",
                    fontWeight: 500,
                  }}
                >
                  Quick View
                </motion.p>

                <motion.h2
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.4 }}
                  className="mb-4 leading-[0.95] tracking-[-0.02em]"
                  style={{
                    color: T.ink,
                    fontFamily: "var(--font-fraunces), Georgia, serif",
                    fontSize: "clamp(24px, 3vw, 32px)",
                    fontWeight: 400,
                  }}
                >
                  {product.name}
                </motion.h2>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="flex items-baseline gap-3 mb-5"
                >
                  <span
                    className="tabular-nums"
                    style={{
                      color: T.ink,
                      fontFamily: "var(--font-fraunces), Georgia, serif",
                      fontSize: "24px",
                      fontWeight: 500,
                    }}
                  >
                    {formatBDT(price)}
                  </span>
                  {discount > 0 && (
                    <span
                      className="text-[14px] line-through tabular-nums"
                      style={{ color: T.inkSoft, opacity: 0.6 }}
                    >
                      {formatBDT(original)}
                    </span>
                  )}
                </motion.div>

                {product.shortDescription && (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.4 }}
                    className="leading-relaxed mb-6"
                    style={{
                      color: T.inkSoft,
                      fontFamily: "var(--font-fraunces), Georgia, serif",
                      fontSize: "14px",
                      lineHeight: "1.7",
                    }}
                  >
                    {product.shortDescription}
                  </motion.p>
                )}

                {/* Stock Status */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                  className="mb-6"
                >
                  {stock > 0 ? (
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
                      In stock {stock <= 10 && `· Only ${stock} left`}
                    </span>
                  ) : (
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
                      Out of stock
                    </span>
                  )}
                </motion.div>
              </div>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.4 }}
                className="space-y-3 pt-4"
                style={{ borderTop: `1px dashed ${T.gold}30` }}
              >
                {stock > 0 && (
                  <motion.button
                    type="button"
                    onClick={handleAdd}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-sm transition-all duration-300"
                    style={{
                      background: T.ink,
                      border: `1px solid ${T.gold}60`,
                      color: T.goldLeaf,
                      fontFamily: "var(--font-fraunces), Georgia, serif",
                      fontSize: "11px",
                      letterSpacing: "0.25em",
                      textTransform: "uppercase",
                      fontWeight: 500,
                    }}
                  >
                    <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
                    Add to cart
                  </motion.button>
                )}

                <Link
                  href={`/product/${product.slug}`}
                  onClick={onClose}
                  className="group flex items-center justify-center gap-2 py-2 transition-colors duration-300"
                  style={{
                    color: T.inkSoft,
                    fontFamily: "var(--font-fraunces), Georgia, serif",
                    fontSize: "10px",
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                  }}
                >
                  <span className="relative">
                    View full details
                    <span
                      className="absolute bottom-0 left-0 w-0 group-hover:w-full h-px transition-all duration-500 ease-out"
                      style={{ background: T.gold }}
                    />
                  </span>
                  <svg
                    width="12"
                    height="8"
                    viewBox="0 0 14 10"
                    fill="none"
                    className="group-hover:translate-x-1 transition-transform duration-300"
                    aria-hidden
                  >
                    <path d="M1 5 H13 M9 1 L13 5 L9 9" stroke="currentColor" strokeWidth="1" />
                  </svg>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}