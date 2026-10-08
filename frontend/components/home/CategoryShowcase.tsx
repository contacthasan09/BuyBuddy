"use client";

import { useRef, useMemo, type PointerEvent as ReactPointerEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import type { Category } from "@/types";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { EASE } from "@/lib/motion";

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
      <filter id="grain-c">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain-c)" />
    </svg>
  );
}

/* ——————————————————————————————————————————————
   Floating gold dust
—————————————————————————————————————————————— */
function Dust() {
  const motes = useMemo(
    () =>
      Array.from({ length: 10 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 1 + Math.random() * 1.8,
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
            y: [0, -30, 0],
            x: [0, 6, -5, 0],
            opacity: [0, 0.7, 0.2, 0],
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
   3D tilt category card
—————————————————————————————————————————————— */
function CategoryCard({ c, i }: { c: Category; i: number }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), { stiffness: 180, damping: 18 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), { stiffness: 180, damping: 18 });

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

  return (
    <motion.article
      initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.85, delay: i * 0.07, ease: EASE.expo }}
      className="group relative"
      style={{ perspective: 1000 }}
    >
      <Link
        ref={ref}
        href={`/products?category=${c.slug}`}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="block"
        style={{ transformStyle: "preserve-3d" }}
      >
        <motion.div
          className="relative"
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        >
          {/* outer gold frame */}
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
            className="relative aspect-square overflow-hidden rounded-sm"
            style={{
              background: T.bone,
              boxShadow: `0 1px 0 ${T.gold}20, 0 20px 40px -20px rgba(28,22,18,0.45), 0 6px 12px -6px rgba(28,22,18,0.25)`,
            }}
          >
            {/* inner gold hairline */}
            <div
              className="absolute inset-1.5 pointer-events-none z-20 rounded-sm"
              style={{ border: `0.5px solid ${T.gold}`, opacity: 0.3 }}
              aria-hidden
            />

            {/* image */}
            <motion.div
              className="absolute inset-0"
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              {c.image ? (
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  sizes="180px"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${T.bone}, ${T.bg})` }} />
              )}
            </motion.div>

            {/* vignette */}
            <div
              className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-600"
              style={{
                background: `radial-gradient(120% 80% at 50% 100%, ${T.ink}E6 0%, transparent 60%)`,
              }}
              aria-hidden
            />

            {/* corner ornaments */}
            {[
              { top: 5, left: 5, rotate: 0 },
              { top: 5, right: 5, rotate: 90 },
              { bottom: 5, right: 5, rotate: 180 },
              { bottom: 5, left: 5, rotate: 270 },
            ].map((pos, idx) => (
              <div
                key={idx}
                className="absolute z-20 w-2.5 h-2.5 pointer-events-none"
                style={{
                  top: pos.top,
                  right: pos.right,
                  bottom: pos.bottom,
                  left: pos.left,
                  transform: `rotate(${pos.rotate}deg)`,
                }}
                aria-hidden
              >
                <svg viewBox="0 0 10 10" fill="none">
                  <path d="M0 0 L10 0 L10 10" stroke={T.gold} strokeWidth="0.7" opacity="0.6" />
                  <circle cx="0.8" cy="0.8" r="0.6" fill={T.gold} opacity="0.8" />
                </svg>
              </div>
            ))}

            {/* category name overlay */}
            <div
              className="absolute inset-x-0 bottom-0 z-20 p-3"
              style={{
                background: `linear-gradient(180deg, transparent 0%, ${T.ink}D9 100%)`,
              }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="text-[11px] leading-tight line-clamp-2"
                  style={{
                    color: T.bone,
                    fontFamily: "var(--font-fraunces), Georgia, serif",
                  }}
                >
                  {c.name}
                </span>
                <svg
                  width="10"
                  height="8"
                  viewBox="0 0 14 10"
                  fill="none"
                  className="shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  aria-hidden
                >
                  <path d="M1 5 H13 M9 1 L13 5 L9 9" stroke={T.goldBright} strokeWidth="1" />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.article>
  );
}

/* ——————————————————————————————————————————————
   Main section
—————————————————————————————————————————————— */
export function CategoryShowcase({ categories }: { categories: Category[] }) {
  const list = categories.filter((c) => c.isActive !== false).slice(0, 6);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  if (!list.length) return null;

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
          style={{ background: `radial-gradient(closest-side, ${T.goldBright}30, transparent 70%)` }}
        />
      </motion.div>
      <motion.div
        aria-hidden
        style={{ y: bgY }}
        className="pointer-events-none absolute -bottom-40 left-[-10%] h-[420px] w-[420px] rounded-full blur-3xl"
      >
        <div
          className="h-full w-full rounded-full"
          style={{ background: `radial-gradient(closest-side, ${T.wine}20, transparent 70%)` }}
        />
      </motion.div>

      {/* top rule */}
      <div
        className="relative h-px w-full"
        style={{ background: `linear-gradient(90deg, transparent, ${T.gold}45 20%, ${T.gold}45 80%, transparent)` }}
      />

      <div className="container-x relative py-10 md:py-14">
        {/* header */}
        <ScrollReveal direction="up">
          <div className="flex flex-col items-center gap-4 mb-7">
            <div className="flex items-center gap-3">
              <span className="h-px w-10" style={{ background: T.gold, opacity: 0.5 }} />
              <span
                className="text-[9px] tracking-[0.4em] uppercase"
                style={{ color: T.gold, fontFamily: "var(--font-fraunces), Georgia, serif" }}
              >
                Collections
              </span>
              <span className="h-px w-10" style={{ background: T.gold, opacity: 0.5 }} />
            </div>

            <h2
              className="relative inline-block text-[36px] sm:text-[48px] md:text-[60px] leading-[0.92] tracking-[-0.02em] text-center"
              style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontWeight: 400, color: T.ink }}
            >
              <span className="italic font-light">Explore</span>
              <span className="mx-2" style={{ color: T.gold }}>
                ❖
              </span>
              <span className="relative">
                Curated
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
                  Curated
                </motion.span>
              </span>
            </h2>

            <p
              className="max-w-sm text-center text-[11px] leading-relaxed"
              style={{ color: T.inkSoft, fontFamily: "var(--font-fraunces), Georgia, serif" }}
            >
              Discover our carefully selected categories
            </p>
          </div>
        </ScrollReveal>

        {/* fleuron */}
        <div className="flex justify-center mb-6">
          <Fleuron className="w-28 h-3" />
        </div>

        {/* grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-3 gap-y-8 md:gap-x-4">
          {list.map((c, i) => (
            <CategoryCard key={c._id} c={c} i={i} />
          ))}
        </div>

        {/* footer */}
        <div className="mt-10">
          <div className="flex justify-center mb-3">
            <Fleuron className="w-24 h-2.5" />
          </div>
          <div
            className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left"
            style={{ color: T.inkSoft, fontFamily: "var(--font-fraunces), Georgia, serif" }}
          >
            <span className="text-[9px] tracking-[0.3em] uppercase">Handpicked selections</span>
            <span className="text-[9px] tracking-[0.3em] uppercase" style={{ color: T.gold }}>
              ❖ Six collections ❖
            </span>
            <span className="text-[9px] tracking-[0.3em] uppercase">Shop now</span>
          </div>
        </div>
      </div>

      {/* bottom rule */}
      <div
        className="relative h-px w-full mt-2"
        style={{ background: `linear-gradient(90deg, transparent, ${T.gold}45 20%, ${T.gold}45 80%, transparent)` }}
      />
    </section>
  );
}