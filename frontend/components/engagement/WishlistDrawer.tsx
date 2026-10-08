"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X, Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useWishlist } from "@/store/wishlist";
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
      <filter id="grain-drawer-w">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.7 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain-drawer-w)" />
    </svg>
  );
}

interface WishlistDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function WishlistDrawer({ open, onClose }: WishlistDrawerProps) {
  const items = useWishlist((s) => s.items);
  const removeItem = useWishlist((s) => s.removeItem);
  const addToCart = useCart((s) => s.addItem);
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  const handleMoveToCart = (item: (typeof items)[0]) => {
    addToCart(
      {
        productId: item.productId,
        name: item.name,
        slug: item.slug,
        image: item.image,
        price: item.price,
        originalPrice: item.originalPrice,
        stockAvailable: 99,
      },
      1
    );
    removeItem(item.productId);
    toast(`${item.name} moved to cart`, "success");
  };

  if (!mounted) return null;

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
            className="fixed inset-0 z-[200] flex justify-end"
            style={{ background: `${T.inkDeep}E6` }}
            aria-hidden
          >
            <Grain />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background: `radial-gradient(circle at 80% 50%, transparent 30%, ${T.inkDeep} 100%)`,
              }}
            />
          </motion.div>

          {/* Drawer Panel */}
          <motion.aside
            initial={{ x: "100%", opacity: 0.9 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0.9 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 bottom-0 z-[201] w-full sm:w-[400px] flex flex-col overflow-hidden"
            style={{
              background: T.bone,
              borderLeft: `1px solid ${T.gold}40`,
              boxShadow: `-20px 0 60px -20px rgba(28,22,18,0.5)`,
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Wishlist"
          >
            {/* Inner gold hairline (left edge) */}
            <div
              className="absolute inset-y-2 left-2 w-px pointer-events-none"
              style={{ background: `linear-gradient(180deg, transparent, ${T.gold}40, transparent)` }}
              aria-hidden
            />

            {/* Header */}
            <header className="flex items-center justify-between px-6 py-5 flex-shrink-0 relative z-10">
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-sm flex items-center justify-center"
                  style={{ background: T.bg, border: `1px solid ${T.gold}30` }}
                >
                  <Heart className="w-4 h-4" strokeWidth={1.5} style={{ color: T.wine, fill: `${T.wine}20` }} />
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
                    Curated <span className="italic font-light" style={{ color: T.wine }}>collection.</span>
                  </h2>
                  <p
                    className="text-[10px] tracking-[0.25em] uppercase mt-1"
                    style={{ color: T.inkSoft, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                  >
                    {items.length} {items.length === 1 ? "piece" : "pieces"} saved
                  </p>
                </div>
              </div>

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
            </header>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 pb-8 relative z-10">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div
                    className="w-16 h-16 rounded-sm flex items-center justify-center mb-6"
                    style={{ background: T.bg, border: `1px solid ${T.gold}30` }}
                  >
                    <Heart className="w-6 h-6" strokeWidth={1.5} style={{ color: T.gold }} />
                  </div>
                  <h3
                    className="mb-3 leading-[0.95] tracking-[-0.02em]"
                    style={{ color: T.ink, fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "22px", fontWeight: 400 }}
                  >
                    Awaiting <span className="italic font-light" style={{ color: T.wine }}>selections.</span>
                  </h3>
                  <p
                    className="text-[13px] leading-relaxed max-w-xs mb-8"
                    style={{ color: T.inkSoft, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                  >
                    Tap the heart on any piece to preserve it in your private collection.
                  </p>
                  <motion.button
                    onClick={onClose}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-sm transition-all duration-300"
                    style={{
                      background: T.ink,
                      border: `1px solid ${T.gold}60`,
                      color: T.goldLeaf,
                      fontFamily: "var(--font-fraunces), Georgia, serif",
                      fontSize: "10px",
                      letterSpacing: "0.25em",
                      textTransform: "uppercase",
                      fontWeight: 500,
                    }}
                  >
                    Browse the collection
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence initial={false} mode="popLayout">
                    {items.map((item) => (
                      <motion.div
                        key={item.productId}
                        layout
                        initial={{ opacity: 0, x: 20, filter: "blur(4px)" }}
                        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, x: -20, filter: "blur(4px)", height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.4, ease: EASE.expo }}
                        className="relative p-3 rounded-sm flex gap-3"
                        style={{
                          background: T.bg,
                          border: `1px solid ${T.gold}25`,
                        }}
                      >
                        {/* Image */}
                        <Link
                          href={`/product/${item.slug}`}
                          onClick={onClose}
                          className="w-20 h-20 rounded-sm overflow-hidden flex-shrink-0 relative"
                          style={{ border: `1px solid ${T.gold}30` }}
                        >
                          <div
                            className="absolute inset-0.5 pointer-events-none rounded-sm"
                            style={{ border: `0.5px solid ${T.gold}`, opacity: 0.3 }}
                            aria-hidden
                          />
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                            loading="lazy"
                          />
                        </Link>

                        {/* Content */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <Link
                              href={`/product/${item.slug}`}
                              onClick={onClose}
                              className="block text-[13px] leading-snug line-clamp-2 transition-colors duration-300 hover:text-[color:var(--gold)]"
                              style={{ color: T.ink, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                            >
                              {item.name}
                            </Link>
                            <p
                              className="text-[14px] font-medium tabular-nums mt-1"
                              style={{ color: T.ink, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                            >
                              {formatBDT(item.price)}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 mt-3">
                            <motion.button
                              type="button"
                              onClick={() => handleMoveToCart(item)}
                              whileHover={{ y: -1 }}
                              whileTap={{ scale: 0.96 }}
                              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-sm transition-all duration-300"
                              style={{
                                background: T.ink,
                                border: `1px solid ${T.gold}50`,
                                color: T.goldLeaf,
                                fontFamily: "var(--font-fraunces), Georgia, serif",
                                fontSize: "9px",
                                letterSpacing: "0.2em",
                                textTransform: "uppercase",
                                fontWeight: 500,
                              }}
                            >
                              <ShoppingBag className="w-3 h-3" strokeWidth={1.5} />
                              Add to cart
                            </motion.button>
                            <motion.button
                              type="button"
                              onClick={() => removeItem(item.productId)}
                              whileHover={{ scale: 1.05, background: `${T.wine}15` }}
                              whileTap={{ scale: 0.9 }}
                              className="w-8 h-8 rounded-sm flex items-center justify-center transition-colors"
                              style={{ border: `1px solid ${T.gold}30` }}
                              aria-label="Remove"
                            >
                              <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} style={{ color: T.inkSoft }} />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}