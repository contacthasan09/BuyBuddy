"use client";

import { useState, useMemo, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Package } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { EASE } from "@/lib/motion";
import type { Product, Category } from "@/types";

/* ——————————————————————————————————————————————
   Palette
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
   SVG noise
—————————————————————————————————————————————— */
function Grain() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.09] mix-blend-multiply"
    >
      <filter id="grain-p">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain-p)" />
    </svg>
  );
}

/* ——————————————————————————————————————————————
   Floating gold dust
—————————————————————————————————————————————— */
function Dust() {
  const motes = useMemo(
    () =>
      Array.from({ length: 8 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 1 + Math.random() * 1.6,
        dur: 14 + Math.random() * 16,
        delay: Math.random() * -18,
      })),
    []
  );
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {motes.map((m) => (
        <motion.span
          key={m.id}
          className="absolute rounded-full"
          style={{
            left: `${m.left}%`,
            top: `${m.top}%`,
            width: m.size,
            height: m.size,
            background: `radial-gradient(circle, ${T.goldBright} 0%, ${T.gold} 60%, transparent 100%)`,
            boxShadow: `0 0 ${m.size * 3}px ${T.goldBright}`,
          }}
          animate={{
            y: [0, -28, 0],
            x: [0, 5, -4, 0],
            opacity: [0, 0.6, 0.2, 0],
          }}
          transition={{
            duration: m.dur,
            delay: m.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ——————————————————————————————————————————————
   Ornamental fleuron
—————————————————————————————————————————————— */
function Fleuron({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 14" className={className} fill="none" aria-hidden>
      <path d="M0 7 H50" stroke={T.gold} strokeOpacity="0.5" strokeWidth="0.6" />
      <path d="M70 7 H120" stroke={T.gold} strokeOpacity="0.5" strokeWidth="0.6" />
      <g transform="translate(60 7)">
        <path
          d="M0 -4 C2 -4 3 -2 3 0 C3 2 2 4 0 4 C-2 4 -3 2 -3 0 C-3 -2 -2 -4 0 -4 Z"
          fill={T.gold}
          fillOpacity="0.85"
        />
        <circle r="1" fill={T.bone} />
        <path d="M-8 0 L-5 0 M5 0 L8 0" stroke={T.gold} strokeOpacity="0.7" strokeWidth="0.6" />
      </g>
    </svg>
  );
}

/* ——————————————————————————————————————————————
   Precious category chip
—————————————————————————————————————————————— */
function CategoryChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.96 }}
      className="relative shrink-0 px-4 py-2 rounded-sm transition-all duration-300"
      style={{
        background: active ? T.ink : "transparent",
        border: `1px solid ${active ? T.gold : T.gold}40`,
        color: active ? T.goldLeaf : T.ink,
      }}
    >
      {active && (
        <motion.div
          layoutId="chip-glow"
          className="absolute inset-0 rounded-sm"
          style={{
            background: `linear-gradient(135deg, ${T.gold}20, transparent)`,
          }}
          transition={{ duration: 0.4, ease: EASE.expo }}
        />
      )}
      <span
        className="relative text-[10px] tracking-[0.25em] uppercase"
        style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
      >
        {label}
      </span>
    </motion.button>
  );
}

/* ——————————————————————————————————————————————
   Main section
—————————————————————————————————————————————— */
interface AllProductsSectionProps {
  products: Product[];
  categories: Category[];
}

export function AllProductsSection({
  products,
  categories,
}: AllProductsSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>("");
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  const filtered = useMemo(() => {
    if (!activeCategory) return products;

    return products.filter((p) => {
      const productCatId =
        typeof p.category === "object" && p.category
          ? (p.category as any)._id
          : (p.category as string | undefined);
      return productCatId === activeCategory;
    });
  }, [products, activeCategory]);

  return (
    <section ref={ref} className="relative overflow-hidden" style={{ background: T.bg }}>
      <Grain />
      <Dust />

      {/* radial washes */}
      <motion.div
        aria-hidden
        style={{ y: bgY }}
        className="pointer-events-none absolute -top-40 right-[-10%] h-[480px] w-[480px] rounded-full blur-3xl"
      >
        <div
          className="h-full w-full rounded-full"
          style={{ background: `radial-gradient(closest-side, ${T.goldBright}25, transparent 70%)` }}
        />
      </motion.div>
      <motion.div
        aria-hidden
        style={{ y: bgY }}
        className="pointer-events-none absolute -bottom-40 left-[-10%] h-[420px] w-[420px] rounded-full blur-3xl"
      >
        <div
          className="h-full w-full rounded-full"
          style={{ background: `radial-gradient(closest-side, ${T.wine}18, transparent 70%)` }}
        />
      </motion.div>

      {/* top rule */}
      <div
        className="relative h-px w-full"
        style={{ background: `linear-gradient(90deg, transparent, ${T.gold}40 20%, ${T.gold}40 80%, transparent)` }}
      />

      <div className="container-x relative py-10 md:py-14">
        {/* header */}
        <div className="mb-8">
          <ScrollReveal direction="up">
            <div className="flex items-center justify-center gap-3 mb-5">
              <span className="h-px w-10" style={{ background: T.gold, opacity: 0.5 }} />
              <span
                className="text-[9px] tracking-[0.4em] uppercase"
                style={{ color: T.gold, fontFamily: "var(--font-fraunces), Georgia, serif" }}
              >
                Our Collection · {products.length} piece{products.length !== 1 ? "s" : ""}
              </span>
              <span className="h-px w-10" style={{ background: T.gold, opacity: 0.5 }} />
            </div>
          </ScrollReveal>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <ScrollReveal direction="up" delay={0.05}>
              <h2
                className="relative inline-block text-[36px] sm:text-[48px] md:text-[60px] leading-[0.92] tracking-[-0.02em]"
                style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontWeight: 400, color: T.ink }}
              >
                <span className="italic font-light">Shop</span>
                <span className="mx-2" style={{ color: T.gold }}>
                  ❖
                </span>
                <span className="relative">
                  everything
                  <motion.span
                    aria-hidden
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `linear-gradient(110deg, transparent 30%, ${T.goldBright} 50%, transparent 70%)`,
                      backgroundSize: "200% 100%",
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                    animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: "linear", repeatDelay: 1.5 }}
                  >
                    everything
                  </motion.span>
                </span>
                <span style={{ color: T.gold }}>.</span>
              </h2>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.1}>
              <Link
                href="/products"
                className="group inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase transition-colors duration-300"
                style={{
                  color: T.ink,
                  fontFamily: "var(--font-fraunces), Georgia, serif",
                }}
              >
                <span className="border-b border-current pb-0.5 group-hover:border-[color:var(--gold)] group-hover:text-[color:var(--gold)] transition-colors duration-300">
                  View full catalog
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
            </ScrollReveal>
          </div>
        </div>

        {/* category chips */}
        {categories.length > 0 && (
          <ScrollReveal direction="up" delay={0.15}>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 mb-8 pb-2">
              <CategoryChip
                label="All"
                active={activeCategory === ""}
                onClick={() => setActiveCategory("")}
              />
              {categories.map((cat) => (
                <CategoryChip
                  key={cat._id}
                  label={cat.name}
                  active={activeCategory === cat._id}
                  onClick={() => setActiveCategory(cat._id)}
                />
              ))}
            </div>
          </ScrollReveal>
        )}

        {/* fleuron */}
        <div className="flex justify-center mb-7">
          <Fleuron className="w-28 h-3" />
        </div>

        {/* products grid */}
        {filtered.length === 0 ? (
          <ScrollReveal direction="scale">
            <div
              className="text-center py-16 rounded-sm"
              style={{
                background: T.bone,
                border: `1px solid ${T.gold}30`,
                boxShadow: `0 1px 0 ${T.gold}20, 0 20px 40px -20px rgba(28,22,18,0.3)`,
              }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{
                  background: T.bg,
                  border: `1px solid ${T.gold}40`,
                }}
              >
                <Package className="w-6 h-6" strokeWidth={1.5} style={{ color: T.gold }} />
              </div>
              <p
                className="text-[11px] tracking-[0.2em] uppercase"
                style={{ color: T.inkSoft, fontFamily: "var(--font-fraunces), Georgia, serif" }}
              >
                No pieces in this collection
              </p>
            </div>
          </ScrollReveal>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-8 md:gap-x-4"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((product, i) => (
                <motion.div
                  key={product._id}
                  layout
                  initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
                  transition={{
                    duration: 0.7,
                    ease: EASE.expo,
                    delay: i * 0.04,
                  }}
                >
                  <ProductCard product={product} index={i} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* footer */}
        <div className="mt-12">
          <div className="flex justify-center mb-4">
            <Fleuron className="w-24 h-2.5" />
          </div>
          <div
            className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left"
            style={{ color: T.inkSoft, fontFamily: "var(--font-fraunces), Georgia, serif" }}
          >
            <span className="text-[9px] tracking-[0.3em] uppercase">Complimentary shipping</span>
            <span className="text-[9px] tracking-[0.3em] uppercase" style={{ color: T.gold }}>
              ❖ Curated selection ❖
            </span>
            <span className="text-[9px] tracking-[0.3em] uppercase">Authenticated</span>
          </div>
        </div>
      </div>

      {/* bottom rule */}
      <div
        className="relative h-px w-full mt-2"
        style={{ background: `linear-gradient(90deg, transparent, ${T.gold}40 20%, ${T.gold}40 80%, transparent)` }}
      />
    </section>
  );
}