"use client";

import Link from "next/link";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/store/cart";
import { formatBDT } from "@/lib/utils";
import { fadeUp, staggerContainer, EASE } from "@/lib/motion";
import { useState, useEffect, useRef } from "react";

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

const EASE_EXPO = [0.16, 1, 0.3, 1] as const;

/* ——————————————————————————————————————————————
   Cinematic Hero Images (Packaging/Curated themed)
—————————————————————————————————————————————— */
const CART_HERO_IMAGES = [
  "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800&auto=format&fit=crop",
];

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

/* ——————————————————————————————————————————————
   3D Tilt Card Wrapper
—————————————————————————————————————————————— */
function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [1.2, -1.2]), {
    stiffness: 150,
    damping: 25,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-1.2, 1.2]), {
    stiffness: 150,
    damping: 25,
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1200,
      }}
      className="relative"
    >
      {children}
    </motion.div>
  );
}

/* ——————————————————————————————————————————————
   Cinematic Image Slider
—————————————————————————————————————————————— */
function CinematicImageSlider({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length, isHovered]);

  return (
    <div
      className="relative w-full h-full min-h-[320px] md:min-h-0 overflow-hidden"
      style={{ background: "#E8DFCB" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <motion.img
            src={images[currentIndex]}
            alt="Maison packaging"
            className="w-full h-full object-cover"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 6, ease: "linear" }}
          />

          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at center, transparent 40%, rgba(18,14,10,0.35) 100%)`,
            }}
          />

          <svg className="pointer-events-none absolute inset-0 w-full h-full opacity-[0.1] mix-blend-overlay">
            <filter id="img-grain-cart">
              <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
              <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#img-grain-cart)" />
          </svg>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black/10">
        <motion.div
          key={currentIndex}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 5, ease: "linear" }}
          className="h-full"
          style={{ background: T.gold }}
        />
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className="w-1.5 h-1.5 rounded-full transition-all duration-500"
            style={{
              background: idx === currentIndex ? T.gold : "rgba(255,255,255,0.5)",
              transform: idx === currentIndex ? "scale(1.3)" : "scale(1)",
              boxShadow: idx === currentIndex ? `0 0 8px ${T.gold}80` : "none",
            }}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_EXPO }}
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

      {/* ═══════════════════════════════════════════════
          CINEMATIC HERO — Editorial Split Card
          ═══════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${T.bone} 0%, ${T.bg} 60%, ${T.bg} 100%)`,
          borderBottom: `1px solid ${T.gold}25`,
        }}
      >
        {/* Ambient lighting */}
        <motion.div
          aria-hidden
          className="absolute pointer-events-none"
          style={{
            top: "-35%",
            left: "50%",
            width: "min(720px, 90vw)",
            height: "min(720px, 90vw)",
            transform: "translateX(-50%)",
            background: `radial-gradient(circle, ${T.goldBright}18 0%, transparent 55%)`,
            filter: "blur(70px)",
            zIndex: 0,
          }}
          animate={{ opacity: [0.3, 0.55, 0.3], scale: [1, 1.05, 1] }}
          transition={{ duration: 15, ease: "easeInOut", repeat: Infinity }}
        />

        {/* Vignette */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 1,
            background: `radial-gradient(120% 90% at 50% 30%, transparent 35%, ${T.bg}90 100%)`,
          }}
        />

        {/* Content */}
        <div className="relative container-x pt-14 pb-12 md:pt-20 md:pb-16" style={{ zIndex: 10 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_EXPO }}
            className="max-w-4xl mx-auto"
          >
            <TiltCard>
              <motion.div
                className="relative grid md:grid-cols-5 rounded-sm overflow-hidden"
                style={{
                  background: `linear-gradient(165deg, ${T.bone} 0%, ${T.bg} 100%)`,
                  border: `1px solid ${T.gold}35`,
                  boxShadow: `
                    0 1px 0 ${T.goldLeaf}40,
                    0 16px 40px -16px rgba(18, 14, 10, 0.14),
                    0 30px 70px -30px rgba(18, 14, 10, 0.08)
                  `,
                }}
              >
                {/* Unified Inner gold hairline */}
                <div
                  aria-hidden
                  className="absolute inset-2.5 pointer-events-none rounded-sm z-20"
                  style={{ border: `0.5px solid ${T.gold}`, opacity: 0.22 }}
                />

                {/* Unified Corner ornaments */}
                {[
                  { top: 8, left: 8, rotate: 0 },
                  { top: 8, right: 8, rotate: 90 },
                  { bottom: 8, right: 8, rotate: 180 },
                  { bottom: 8, left: 8, rotate: 270 },
                ].map((pos, idx) => (
                  <div
                    key={idx}
                    className="absolute w-3 h-3 pointer-events-none z-20"
                    style={{
                      top: pos.top,
                      right: pos.right,
                      bottom: pos.bottom,
                      left: pos.left,
                      transform: `rotate(${pos.rotate}deg)`,
                    }}
                    aria-hidden
                  >
                    <svg viewBox="0 0 16 16" fill="none">
                      <path d="M0 0 L16 0 L16 16" stroke={T.gold} strokeWidth="0.8" opacity="0.6" />
                      <circle cx="1.5" cy="1.5" r="1" fill={T.goldBright} opacity="0.8" />
                    </svg>
                  </div>
                ))}

                {/* Top edge cinematic light sweep */}
                <div
                  aria-hidden
                  className="absolute top-0 left-0 right-0 h-px pointer-events-none z-20"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${T.goldBright}80, transparent)`,
                  }}
                />

                {/* ── Text Side ── */}
                <div
                  className="col-span-5 md:col-span-3 p-6 md:p-10 lg:p-12 flex flex-col justify-center order-2 md:order-1 relative z-10"
                  style={{ transform: "translateZ(20px)" }}
                >
                  {/* Eyebrow */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1, ease: EASE_EXPO }}
                    className="flex items-center gap-3 mb-5"
                  >
                    <div
                      className="flex items-center justify-center w-6 h-6 rounded-full"
                      style={{
                        background: `linear-gradient(135deg, ${T.goldBright}30, ${T.gold}20)`,
                        border: `1px solid ${T.gold}40`,
                      }}
                    >
                      <span className="text-[10px]" style={{ color: T.gold }}>❖</span>
                    </div>
                    <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${T.gold}40, transparent)` }} />
                    <p
                      className="text-[9px] tracking-[0.35em] uppercase font-medium"
                      style={{ color: T.inkSoft, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                    >
                      Checkout
                    </p>
                  </motion.div>

                  {/* Headline */}
                  <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: EASE_EXPO }}
                    className="mb-5 relative leading-[0.95] tracking-[-0.025em]"
                    style={{
                      color: T.ink,
                      fontFamily: "var(--font-fraunces), Georgia, serif",
                      fontSize: "clamp(30px, 4vw, 52px)",
                      fontWeight: 400,
                    }}
                  >
                    Your{" "}
                    <span className="italic font-light relative inline-block">
                      cart.
                    </span>
                  </motion.h1>

                  {/* Subtitle */}
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3, ease: EASE_EXPO }}
                    className="max-w-lg"
                    style={{
                      color: T.inkSoft,
                      fontFamily: "var(--font-fraunces), Georgia, serif",
                      fontSize: "clamp(13px, 1vw, 15px)",
                      lineHeight: 1.65,
                      letterSpacing: "0.01em",
                    }}
                  >
                    {items.length} item{items.length !== 1 ? "s" : ""} · {formatBDT(subtotal)} subtotal
                  </motion.p>
                </div>

                {/* ── Image Side ── */}
                <div className="col-span-5 md:col-span-2 relative order-1 md:order-2">
                  <CinematicImageSlider images={CART_HERO_IMAGES} />

                  {/* Vertical divider for desktop */}
                  <div
                    className="hidden md:block absolute top-0 bottom-0 left-0 w-px z-10"
                    style={{ background: `linear-gradient(180deg, transparent, ${T.gold}40, transparent)` }}
                  />
                </div>
              </motion.div>
            </TiltCard>
          </motion.div>
        </div>

        {/* Bottom cinematic fade */}
        <div
          aria-hidden
          className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
          style={{
            background: `linear-gradient(180deg, transparent 0%, ${T.bg} 100%)`,
            zIndex: 5,
          }}
        />
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
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: EASE_EXPO }}
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: EASE_EXPO }}
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