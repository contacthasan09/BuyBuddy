"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X, Scale, ShoppingBag } from "lucide-react";
import { useCompare } from "@/store/compare";
import { useCart } from "@/store/cart";
import { useToast } from "@/components/providers/ToastProvider";
import { formatBDT } from "@/lib/utils";
import { EASE } from "@/lib/motion";

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
      <filter id="grain-drawer">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.7 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain-drawer)" />
    </svg>
  );
}

interface CompareDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CompareDrawer({ open, onClose }: CompareDrawerProps) {
  const items = useCompare((s) => s.items);
  const removeItem = useCompare((s) => s.removeItem);
  const clear = useCompare((s) => s.clear);
  const addToCart = useCart((s) => s.addItem);
  const { toast } = useToast();

  // Collect all unique spec keys
  const allSpecKeys = Array.from(
    new Set(items.flatMap((item) => item.specifications.map((s) => s.key)))
  );

  // Find cheapest
  const cheapestId =
    items.length > 0
      ? items.reduce((min, i) => (i.price < min.price ? i : min), items[0])
          .productId
      : null;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handleAddToCart = (item: (typeof items)[0]) => {
    addToCart(
      {
        productId: item.productId,
        name: item.name,
        slug: item.slug,
        image: item.image,
        price: item.price,
        originalPrice: item.originalPrice,
        stockAvailable: item.stock,
      },
      1
    );
    toast(`${item.name} added to cart`, "success");
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[200] flex items-end justify-center md:items-center md:justify-center p-0 md:p-8"
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

          {/* Drawer Container */}
          <motion.div
            initial={{ y: "100%", opacity: 0.9 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0.9 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full md:max-w-5xl md:h-[85vh] h-[90vh] z-[201] flex flex-col overflow-hidden"
            style={{
              background: T.bone,
              borderTop: `1px solid ${T.gold}50`,
              boxShadow: `0 -20px 60px -20px rgba(28,22,18,0.5)`,
              borderRadius: "12px 12px 0 0",
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Compare products"
          >
            {/* Inner gold hairline (top only for drawer) */}
            <div
              className="absolute inset-x-2 top-2 h-px pointer-events-none"
              style={{ background: `linear-gradient(90deg, transparent, ${T.gold}40, transparent)` }}
              aria-hidden
            />

            {/* Header */}
            <header className="flex items-center justify-between px-6 py-5 flex-shrink-0 relative z-10">
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-sm flex items-center justify-center"
                  style={{ background: T.bg, border: `1px solid ${T.gold}30` }}
                >
                  <Scale className="w-4 h-4" strokeWidth={1.5} style={{ color: T.gold }} />
                </div>
                <div>
                  <h2
                    className="leading-[0.95] tracking-[-0.02em]"
                    style={{
                      color: T.ink,
                      fontFamily: "var(--font-fraunces), Georgia, serif",
                      fontSize: "20px",
                      fontWeight: 400,
                    }}
                  >
                    Compare <span className="italic font-light" style={{ color: T.wine }}>pieces.</span>
                  </h2>
                  <p
                    className="text-[10px] tracking-[0.25em] uppercase mt-1"
                    style={{ color: T.inkSoft, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                  >
                    {items.length} {items.length === 1 ? "item" : "items"} · {4 - items.length} slots remaining
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {items.length > 0 && (
                  <motion.button
                    type="button"
                    onClick={() => {
                      clear();
                      onClose();
                    }}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.96 }}
                    className="px-4 py-2 rounded-sm transition-all duration-300"
                    style={{
                      color: T.wine,
                      fontFamily: "var(--font-fraunces), Georgia, serif",
                      fontSize: "10px",
                      letterSpacing: "0.25em",
                      textTransform: "uppercase",
                      fontWeight: 500,
                      border: `1px solid transparent`,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${T.wine}40`)}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "transparent")}
                  >
                    Clear all
                  </motion.button>
                )}
                <motion.button
                  type="button"
                  onClick={onClose}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 rounded-sm flex items-center justify-center transition-all duration-300"
                  style={{
                    border: `1px solid ${T.gold}30`,
                    background: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = T.gold;
                    e.currentTarget.style.background = `${T.gold}10`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = `${T.gold}30`;
                    e.currentTarget.style.background = "transparent";
                  }}
                  aria-label="Close"
                >
                  <X className="w-4 h-4" strokeWidth={1.5} style={{ color: T.inkSoft }} />
                </motion.button>
              </div>
            </header>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 pb-8 relative z-10">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div
                    className="w-16 h-16 rounded-sm flex items-center justify-center mb-6"
                    style={{ background: T.bg, border: `1px solid ${T.gold}30` }}
                  >
                    <Scale className="w-6 h-6" strokeWidth={1.5} style={{ color: T.gold }} />
                  </div>
                  <h3
                    className="mb-3 leading-[0.95] tracking-[-0.02em]"
                    style={{ color: T.ink, fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "22px", fontWeight: 400 }}
                  >
                    Awaiting <span className="italic font-light" style={{ color: T.wine }}>selections.</span>
                  </h3>
                  <p
                    className="text-[13px] leading-relaxed max-w-sm"
                    style={{ color: T.inkSoft, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                  >
                    Add up to 4 pieces to compare specifications, provenance, and pricing side by side.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto -mx-6 px-6 pb-4">
                  <div
                    className="grid gap-4 md:gap-6"
                    style={{
                      gridTemplateColumns: `repeat(${items.length}, minmax(240px, 1fr))`,
                      minWidth: items.length > 2 ? items.length * 260 : "auto",
                    }}
                  >
                    {items.map((item) => (
                      <motion.div
                        key={item.productId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: EASE.expo }}
                        className="relative p-5 rounded-sm flex flex-col"
                        style={{
                          background: T.bg,
                          border: `1px solid ${item.productId === cheapestId ? T.gold : `${T.gold}25`}`,
                          boxShadow: item.productId === cheapestId 
                            ? `0 0 0 1px ${T.gold}40, 0 12px 24px -12px rgba(184,147,90,0.15)` 
                            : `0 1px 0 ${T.gold}15`,
                        }}
                      >
                        {/* Best Price Badge */}
                        {item.productId === cheapestId && (
                          <motion.div
                            initial={{ scale: 0, y: -10 }}
                            animate={{ scale: 1, y: 0 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
                            className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-sm flex items-center gap-1.5"
                            style={{
                              background: `linear-gradient(135deg, ${T.goldBright}, ${T.gold})`,
                              boxShadow: `0 4px 12px -4px ${T.gold}60`,
                            }}
                          >
                            <Scale className="w-3 h-3" strokeWidth={2} style={{ color: T.ink }} />
                            <span
                              className="text-[9px] tracking-[0.2em] uppercase font-bold"
                              style={{ color: T.ink, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                            >
                              Best Value
                            </span>
                          </motion.div>
                        )}

                        {/* Remove Button */}
                        <motion.button
                          type="button"
                          onClick={() => removeItem(item.productId)}
                          whileHover={{ scale: 1.1, background: `${T.wine}15` }}
                          whileTap={{ scale: 0.9 }}
                          className="absolute top-3 right-3 w-7 h-7 rounded-sm flex items-center justify-center transition-colors z-20"
                          style={{ border: `1px solid ${T.gold}30`, background: `${T.bone}F0` }}
                          aria-label="Remove"
                        >
                          <X className="w-3.5 h-3.5" strokeWidth={1.5} style={{ color: T.inkSoft }} />
                        </motion.button>

                        {/* Image */}
                        <Link href={`/product/${item.slug}`} onClick={onClose} className="block mb-4 relative">
                          <div
                            className="relative aspect-square overflow-hidden rounded-sm"
                            style={{ background: T.bone, border: `1px solid ${T.gold}20` }}
                          >
                            <div
                              className="absolute inset-1 pointer-events-none rounded-sm"
                              style={{ border: `0.5px solid ${T.gold}`, opacity: 0.2 }}
                              aria-hidden
                            />
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                              loading="lazy"
                            />
                          </div>
                        </Link>

                        {/* Meta */}
                        <Link href={`/product/${item.slug}`} onClick={onClose} className="block mb-4">
                          <h3
                            className="line-clamp-2 leading-snug mb-2 transition-colors duration-300 hover:text-[color:var(--gold)]"
                            style={{
                              color: T.ink,
                              fontFamily: "var(--font-fraunces), Georgia, serif",
                              fontSize: "14px",
                              fontWeight: 500,
                            }}
                          >
                            {item.name}
                          </h3>
                          <p
                            className="tabular-nums"
                            style={{
                              color: T.ink,
                              fontFamily: "var(--font-fraunces), Georgia, serif",
                              fontSize: "16px",
                              fontWeight: 500,
                            }}
                          >
                            {formatBDT(item.price)}
                          </p>
                        </Link>

                        {/* Specs */}
                        {allSpecKeys.length > 0 && (
                          <div className="space-y-3 pt-4 mb-6 flex-1" style={{ borderTop: `1px dashed ${T.gold}30` }}>
                            {allSpecKeys.map((key) => {
                              const spec = item.specifications.find((s) => s.key === key);
                              return (
                                <div key={key}>
                                  <p
                                    className="text-[9px] tracking-[0.25em] uppercase mb-0.5"
                                    style={{ color: T.inkSoft, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                                  >
                                    {key}
                                  </p>
                                  <p
                                    className="text-[13px] leading-snug"
                                    style={{ color: T.ink, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                                  >
                                    {spec?.value || "—"}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Add to Cart */}
                        <motion.button
                          type="button"
                          onClick={() => handleAddToCart(item)}
                          whileHover={{ y: -2, boxShadow: `0 8px 20px -8px ${T.gold}60` }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full flex items-center justify-center gap-2 py-3 rounded-sm transition-all duration-300 mt-auto"
                          style={{
                            background: T.ink,
                            border: `1px solid ${T.gold}50`,
                            color: T.goldLeaf,
                            fontFamily: "var(--font-fraunces), Georgia, serif",
                            fontSize: "10px",
                            letterSpacing: "0.2em",
                            textTransform: "uppercase",
                            fontWeight: 500,
                          }}
                        >
                          <ShoppingBag className="w-3.5 h-3.5" strokeWidth={1.5} />
                          Add to cart
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}