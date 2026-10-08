"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/store/cart";
import { formatBDT } from "@/lib/utils";
import { fadeUp, staggerContainer, EASE } from "@/lib/motion";

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
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07] mix-blend-multiply"
    >
      <filter id="grain-cart">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain-cart)" />
    </svg>
  );
}

export default function CartPage() {
  const items = useCart((s) => s.items);
  const updateQuantity = useCart((s) => s.updateQuantity);
  const removeItem = useCart((s) => s.removeItem);
  const subtotal = useCart((s) => s.subtotal());

  // ── Empty state ──
  if (items.length === 0) {
    return (
      <div className="relative min-h-[70vh] flex items-center justify-center" style={{ background: T.bg }}>
        <Grain />
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, ease: EASE.expo }}
          className="relative text-center max-w-md px-6 z-10"
        >
          <div 
            className="w-20 h-20 rounded-sm flex items-center justify-center mx-auto mb-8"
            style={{ background: T.bone, border: `1px solid ${T.gold}30` }}
          >
            <ShoppingBag className="w-8 h-8" strokeWidth={1.5} style={{ color: T.gold }} />
          </div>
          <h1
            className="mb-4 leading-[0.95] tracking-[-0.02em]"
            style={{
              fontFamily: "var(--font-fraunces), Georgia, serif",
              fontSize: "clamp(32px, 5vw, 48px)",
              fontWeight: 400,
              color: T.ink,
            }}
          >
            Your cart is{" "}
            <span className="italic font-light" style={{ color: T.wine }}>
              empty.
            </span>
          </h1>
          <p 
            className="mb-10 text-[14px] leading-relaxed"
            style={{ color: T.inkSoft, fontFamily: "var(--font-fraunces), Georgia, serif" }}
          >
            Browse our curated collections and add your desired pieces.
          </p>
          <Link
            href="/products"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-sm transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-8px_rgba(184,147,90,0.6)]"
            style={{
              background: `linear-gradient(135deg, ${T.goldBright}, ${T.gold})`,
              color: T.ink,
              fontFamily: "var(--font-fraunces), Georgia, serif",
              fontSize: "11px",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              fontWeight: 600,
              boxShadow: `0 8px 24px -8px rgba(184,147,90,0.4)`,
            }}
          >
            Explore Collection
            <motion.svg
              width="14"
              height="10"
              viewBox="0 0 14 10"
              fill="none"
              className="group-hover:translate-x-1 transition-transform duration-300"
              aria-hidden
            >
              <path d="M1 5 H13 M9 1 L13 5 L9 9" stroke="currentColor" strokeWidth="1.5" />
            </motion.svg>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen" style={{ background: T.bg, color: T.ink }}>
      <Grain />

      {/* ── Header ── */}
      <section className="relative border-b" style={{ borderColor: `${T.gold}30` }}>
        <div className="container-x py-16 md:py-24">
          <motion.div
            variants={staggerContainer(0.08)}
            initial="hidden"
            animate="visible"
            className="max-w-4xl"
          >
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-5">
              <span className="h-px w-8" style={{ background: T.gold, opacity: 0.5 }} />
              <p
                className="text-[9px] tracking-[0.4em] uppercase"
                style={{ color: T.gold, fontFamily: "var(--font-fraunces), Georgia, serif" }}
              >
                Checkout
              </p>
            </motion.div>
            
            <motion.h1
              variants={fadeUp}
              className="leading-[0.95] tracking-[-0.02em]"
              style={{
                fontFamily: "var(--font-fraunces), Georgia, serif",
                fontSize: "clamp(36px, 5vw, 64px)",
                fontWeight: 400,
                color: T.ink,
              }}
            >
              Your <span className="italic font-light" style={{ color: T.wine }}>cart.</span>
            </motion.h1>
            
            <motion.p
              variants={fadeUp}
              className="mt-4 text-[13px] tracking-[0.15em] uppercase"
              style={{ color: T.inkSoft, fontFamily: "var(--font-fraunces), Georgia, serif" }}
            >
              {items.length} item{items.length !== 1 ? "s" : ""} · {formatBDT(subtotal)} subtotal
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="container-x py-12 md:py-16 relative z-10">
        <div className="grid lg:grid-cols-[1fr_380px] gap-10 lg:gap-14">
          {/* Items list */}
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <motion.div
                  key={item.productId}
                  layout
                  initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, x: -20, filter: "blur(4px)" }}
                  transition={{ duration: 0.4, ease: EASE.expo }}
                  className="relative flex flex-col sm:flex-row gap-5 p-5 rounded-sm"
                  style={{
                    background: T.bone,
                    border: `1px solid ${T.gold}25`,
                  }}
                >
                  {/* Inner gold hairline */}
                  <div
                    className="absolute inset-2 pointer-events-none rounded-sm"
                    style={{ border: `0.5px solid ${T.gold}`, opacity: 0.15 }}
                    aria-hidden
                  />

                  <Link
                    href={`/product/${item.slug}`}
                    className="w-full sm:w-24 h-24 rounded-sm overflow-hidden flex-shrink-0 relative"
                    style={{ border: `1px solid ${T.gold}30` }}
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                    )}
                  </Link>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <Link
                        href={`/product/${item.slug}`}
                        className="block text-[15px] leading-snug line-clamp-2 transition-colors duration-300 hover:text-[color:var(--gold)]"
                        style={{ color: T.ink, fontFamily: "var(--font-fraunces), Georgia, serif", fontWeight: 500 }}
                      >
                        {item.name}
                      </Link>

                      <p
                        className="text-[14px] font-medium tabular-nums mt-1.5"
                        style={{ color: T.ink, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                      >
                        {formatBDT(item.price)}
                      </p>
                    </div>

                    {/* Qty controls */}
                    <div className="flex items-center justify-between mt-4 sm:mt-0">
                      <div 
                        className="inline-flex items-center rounded-sm overflow-hidden"
                        style={{ border: `1px solid ${T.gold}40`, background: T.bg }}
                      >
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-9 h-9 flex items-center justify-center transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                          style={{ borderRight: `1px solid ${T.gold}25` }}
                          onMouseEnter={(e) => { if(item.quantity > 1) e.currentTarget.style.background = `${T.gold}10`; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                          aria-label="Decrease"
                        >
                          <Minus className="w-3.5 h-3.5" strokeWidth={1.5} style={{ color: T.ink }} />
                        </button>
                        <span
                          className="w-9 text-center text-[13px] font-medium tabular-nums"
                          style={{ color: T.ink, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                        >
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="w-9 h-9 flex items-center justify-center transition-all duration-300"
                          style={{ borderLeft: `1px solid ${T.gold}25` }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = `${T.gold}10`; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                          aria-label="Increase"
                        >
                          <Plus className="w-3.5 h-3.5" strokeWidth={1.5} style={{ color: T.ink }} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        className="w-9 h-9 rounded-sm flex items-center justify-center transition-all duration-300"
                        style={{ border: `1px solid ${T.gold}30` }}
                        onMouseEnter={(e) => { 
                          e.currentTarget.style.background = `${T.wine}10`; 
                          e.currentTarget.style.borderColor = `${T.wine}40`; 
                        }}
                        onMouseLeave={(e) => { 
                          e.currentTarget.style.background = "transparent"; 
                          e.currentTarget.style.borderColor = `${T.gold}30`; 
                        }}
                        aria-label="Remove"
                      >
                        <Trash2 className="w-4 h-4" strokeWidth={1.5} style={{ color: T.inkSoft }} />
                      </button>
                    </div>
                  </div>

                  <div
                    className="hidden sm:flex flex-col justify-center text-right flex-shrink-0 pl-4"
                    style={{ borderLeft: `1px dashed ${T.gold}25` }}
                  >
                    <p
                      className="text-[10px] tracking-[0.25em] uppercase mb-1"
                      style={{ color: T.inkSoft, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                    >
                      Total
                    </p>
                    <p
                      className="text-[16px] font-medium tabular-nums"
                      style={{ color: T.ink, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                    >
                      {formatBDT(item.price * item.quantity)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <aside className="lg:sticky lg:top-24 h-fit">
            <motion.div
              initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.6, delay: 0.1, ease: EASE.expo }}
              className="relative p-7 rounded-sm"
              style={{
                background: T.bone,
                border: `1px solid ${T.gold}30`,
                boxShadow: `0 1px 0 ${T.gold}20, 0 16px 32px -16px rgba(28,22,18,0.15)`,
              }}
            >
              {/* Inner gold hairline */}
              <div
                className="absolute inset-2 pointer-events-none rounded-sm"
                style={{ border: `0.5px solid ${T.gold}`, opacity: 0.2 }}
                aria-hidden
              />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="h-px w-6" style={{ background: T.gold, opacity: 0.5 }} />
                  <h2
                    className="text-[9px] tracking-[0.4em] uppercase"
                    style={{ color: T.gold, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                  >
                    Order Summary
                  </h2>
                </div>

                <div className="space-y-4 pb-5 mb-5" style={{ borderBottom: `1px dashed ${T.gold}30` }}>
                  <div className="flex justify-between items-baseline">
                    <span
                      className="text-[12px] tracking-[0.15em] uppercase"
                      style={{ color: T.inkSoft, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                    >
                      Subtotal
                    </span>
                    <span
                      className="text-[14px] font-medium tabular-nums"
                      style={{ color: T.ink, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                    >
                      {formatBDT(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span
                      className="text-[12px] tracking-[0.15em] uppercase"
                      style={{ color: T.inkSoft, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                    >
                      Delivery
                    </span>
                    <span
                      className="text-[12px] tabular-nums"
                      style={{ color: T.inkSoft, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                    >
                      Calculated at checkout
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-baseline pb-6 mb-6" style={{ borderBottom: `1px solid ${T.gold}20` }}>
                  <span
                    className="text-[13px] font-medium"
                    style={{ color: T.ink, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                  >
                    Estimated total
                  </span>
                  <span
                    className="text-[20px] font-medium tabular-nums"
                    style={{ color: T.ink, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                  >
                    {formatBDT(subtotal)}
                  </span>
                </div>

                <Link
                  href="/checkout"
                  className="group w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-sm transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-8px_rgba(184,147,90,0.6)]"
                  style={{
                    background: `linear-gradient(135deg, ${T.goldBright}, ${T.gold})`,
                    color: T.ink,
                    fontFamily: "var(--font-fraunces), Georgia, serif",
                    fontSize: "11px",
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                    boxShadow: `0 8px 24px -8px rgba(184,147,90,0.4)`,
                  }}
                >
                  Proceed to Checkout
                  <motion.svg
                    width="14"
                    height="10"
                    viewBox="0 0 14 10"
                    fill="none"
                    className="group-hover:translate-x-1 transition-transform duration-300"
                    aria-hidden
                  >
                    <path d="M1 5 H13 M9 1 L13 5 L9 9" stroke="currentColor" strokeWidth="1.5" />
                  </motion.svg>
                </Link>

                <Link
                  href="/products"
                  className="group w-full mt-3 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-sm transition-all duration-300"
                  style={{
                    color: T.inkSoft,
                    fontFamily: "var(--font-fraunces), Georgia, serif",
                    fontSize: "10px",
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    border: `1px solid transparent`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${T.gold}40`;
                    e.currentTarget.style.color = T.ink;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "transparent";
                    e.currentTarget.style.color = T.inkSoft;
                  }}
                >
                  Continue Shopping
                </Link>
              </div>
            </motion.div>
          </aside>
        </div>
      </section>
    </div>
  );
}