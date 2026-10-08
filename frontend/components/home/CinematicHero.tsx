"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  AnimatePresence,
} from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { EASE } from "@/lib/motion";

/* ——————————————————————————————————————————————
   Palette — Maison edition (Dark Cinematic)
—————————————————————————————————————————————— */
const T = {
  bg: "#EFE7D4",
  ink: "#1C1612",
  inkDeep: "#0A0806",
  inkSoft: "#5C4F42",
  gold: "#B8935A",
  goldBright: "#D4B478",
  goldLeaf: "#E8D4A0",
  wine: "#5A1A1F",
  bone: "#F7F1E3",
};

/* ═══════════════════════════════════════════════════════
   ROTATING HEADLINE DATA — Elevated copy
   ═══════════════════════════════════════════════════════ */
const HEADLINES = [
  { line1: "Exceptional pieces,", line2: "curated." },
  { line1: "Seamless acquisitions,", line2: "delivered." },
  { line1: "The Autumn", line2: "allocation." },
] as const;

const ROTATE_MS = 4800;

/* ——————————————————————————————————————————————
   SVG noise — organic paper grain
—————————————————————————————————————————————— */
function Grain() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.08] mix-blend-soft-light z-20"
    >
      <filter id="grain-hero-cinematic">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.8 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain-hero-cinematic)" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════
   MAGNETIC BUTTON
   ═══════════════════════════════════════════════════════ */
function MagneticButton({
  children,
  href,
  variant = "primary",
}: {
  children: React.ReactNode;
  href: string;
  variant?: "primary" | "secondary";
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 250, damping: 20 });
  const springY = useSpring(y, { stiffness: 250, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distX = e.clientX - centerX;
    const distY = e.clientY - centerY;
    const dist = Math.sqrt(distX * distX + distY * distY);
    const radius = 140;

    if (dist < radius) {
      const strength = (radius - dist) / radius;
      x.set(distX * strength * 0.3);
      y.set(distY * strength * 0.3);
    } else {
      x.set(0);
      y.set(0);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const isPrimary = variant === "primary";

  return (
    <motion.a
      ref={ref}
      href={href}
      style={{
        x: springX,
        y: springY,
        ...(isPrimary
          ? {
              background: `linear-gradient(135deg, ${T.goldBright}, ${T.gold})`,
              color: T.ink,
              boxShadow: `0 8px 24px -8px ${T.gold}40`,
            }
          : {
              background: "transparent",
              color: T.goldLeaf,
              border: `1px solid ${T.gold}50`,
            }),
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.97 }}
      className="relative inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-sm font-medium text-[11px] tracking-[0.25em] uppercase transition-all duration-500"
    >
      {children}
    </motion.a>
  );
}

/* ═══════════════════════════════════════════════════════
   ANIMATED ORB — Warm gold & wine washes
   ═══════════════════════════════════════════════════════ */
function Orb({
  size,
  color,
  delay = 0,
  duration = 20,
  path = "wide",
}: {
  size: number;
  color: string;
  delay?: number;
  duration?: number;
  path?: "wide" | "tight" | "figure";
}) {
  const paths = {
    wide: {
      x: [0, 80, -50, 40, 0],
      y: [0, -40, 50, -30, 0],
      scale: [1, 1.15, 0.95, 1.1, 1],
    },
    tight: {
      x: [0, 40, -30, 20, 0],
      y: [0, 50, -30, 35, 0],
      scale: [1, 0.9, 1.1, 0.95, 1],
    },
    figure: {
      x: [0, 60, 0, -60, 0],
      y: [0, -50, 50, -50, 0],
      scale: [1, 1.1, 0.95, 1.05, 1],
    },
  };

  const p = paths[path];

  return (
    <motion.div
      animate={{ x: p.x, y: p.y, scale: p.scale }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        background: color,
        filter: "blur(100px)",
        opacity: 0.6,
      }}
    />
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════ */
export function CinematicHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [headlineIndex, setHeadlineIndex] = useState(0);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const layer1X = useTransform(springX, [-0.5, 0.5], [-25, 25]);
  const layer1Y = useTransform(springY, [-0.5, 0.5], [-20, 20]);
  const layer2X = useTransform(springX, [-0.5, 0.5], [-45, 45]);
  const layer2Y = useTransform(springY, [-0.5, 0.5], [-30, 30]);
  const layer3X = useTransform(springX, [-0.5, 0.5], [-15, 15]);
  const layer3Y = useTransform(springY, [-0.5, 0.5], [-10, 10]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    };

    const handleLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);

    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, [mouseX, mouseY]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const timer = setInterval(() => {
      setHeadlineIndex((i) => (i + 1) % HEADLINES.length);
    }, ROTATE_MS);

    return () => clearInterval(timer);
  }, []);

  const { scrollY } = useScroll();
  const scrollOpacity = useTransform(scrollY, [0, 250], [1, 0]);
  const scrollY2 = useTransform(scrollY, [0, 250], [0, 50]);

  const headline = HEADLINES[headlineIndex];

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-[100vh] md:min-h-[95vh] overflow-hidden flex items-center justify-center"
      style={{ background: T.inkDeep }}
    >
      {/* Base atmospheric gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(70% 80% at 50% 0%, ${T.wine}15, transparent 65%), radial-gradient(80% 100% at 50% 100%, ${T.inkDeep}, transparent 60%), ${T.inkDeep}`,
        }}
      />

      {/* Layer 1 — big orbs (slowest parallax) */}
      <motion.div style={{ x: layer1X, y: layer1Y }} className="absolute inset-0 pointer-events-none">
        <Orb
          size={600}
          color={`radial-gradient(circle, ${T.goldBright}35, transparent 70%)`}
          delay={0}
          duration={28}
          path="wide"
        />
        <div className="absolute right-[10%] top-[20%]">
          <Orb
            size={450}
            color={`radial-gradient(circle, ${T.wine}25, transparent 70%)`}
            delay={4}
            duration={32}
            path="tight"
          />
        </div>
      </motion.div>

      {/* Layer 2 — medium orbs (medium parallax) */}
      <motion.div style={{ x: layer2X, y: layer2Y }} className="absolute inset-0 pointer-events-none">
        <div className="absolute left-[15%] bottom-[15%]">
          <Orb
            size={350}
            color={`radial-gradient(circle, ${T.gold}20, transparent 70%)`}
            delay={2}
            duration={24}
            path="figure"
          />
        </div>
      </motion.div>

      {/* Layer 3 — small orbs (fastest parallax) */}
      <motion.div style={{ x: layer3X, y: layer3Y }} className="absolute inset-0 pointer-events-none">
        <div className="absolute left-[65%] top-[65%]">
          <Orb
            size={250}
            color={`radial-gradient(circle, ${T.goldBright}25, transparent 70%)`}
            delay={3}
            duration={20}
            path="tight"
          />
        </div>
      </motion.div>

      {/* Organic grain overlay */}
      <Grain />

      {/* Vignette to focus the center */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: `radial-gradient(circle at 50% 50%, transparent 40%, ${T.inkDeep} 100%)`,
        }}
      />

      {/* ═══════════════════════════════════════════════
          Content
          ═══════════════════════════════════════════════ */}
      <div className="relative z-20 container-x py-20 md:py-24 text-center px-6">
        {/* Eyebrow badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-3 px-5 py-2.5 rounded-sm mb-10"
          style={{
            background: `${T.ink}80`,
            border: `1px solid ${T.gold}30`,
            backdropFilter: "blur(12px)",
          }}
        >
          <span style={{ color: T.gold, fontSize: "10px" }}>❖</span>
          <span
            className="text-[10px] tracking-[0.35em] uppercase"
            style={{ color: T.goldLeaf, fontFamily: "var(--font-fraunces), Georgia, serif" }}
          >
            The Autumn Allocation
          </span>
          <span style={{ color: T.gold, fontSize: "10px" }}>❖</span>
        </motion.div>

        {/* Headline */}
        <h1
          className="mb-8 max-w-5xl mx-auto"
          style={{
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontSize: "clamp(48px, 9vw, 110px)",
            fontWeight: 400,
            lineHeight: "0.92",
            letterSpacing: "-0.03em",
            color: T.bone,
          }}
        >
          <span className="block overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.span
                key={`line1-${headlineIndex}`}
                initial={{ y: "100%", opacity: 0, filter: "blur(10px)" }}
                animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
                exit={{ y: "-100%", opacity: 0, filter: "blur(10px)" }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="block"
              >
                {headline.line1}
              </motion.span>
            </AnimatePresence>
          </span>
          <span className="block overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.span
                key={`line2-${headlineIndex}`}
                initial={{ y: "100%", opacity: 0, filter: "blur(10px)" }}
                animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
                exit={{ y: "-100%", opacity: 0, filter: "blur(10px)" }}
                transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="block italic font-light"
                style={{ color: T.goldBright }}
              >
                {headline.line2}
              </motion.span>
            </AnimatePresence>
          </span>
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl mx-auto mb-12 leading-relaxed"
          style={{
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontSize: "clamp(15px, 1.3vw, 19px)",
            color: `${T.bone}B3`, // Semi-transparent bone
          }}
        >
          Discover our carefully selected collections. Complimentary nationwide
          delivery and seamless cash on arrival.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row gap-4 items-center justify-center"
        >
          <MagneticButton href="/products" variant="primary">
            <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
            Explore Collection
          </MagneticButton>

          <MagneticButton href="/track" variant="secondary">
            Track Allocation
            <motion.svg
              width="14"
              height="10"
              viewBox="0 0 14 10"
              fill="none"
              className="ml-1"
              aria-hidden
            >
              <path d="M1 5 H13 M9 1 L13 5 L9 9" stroke="currentColor" strokeWidth="1" />
            </motion.svg>
          </MagneticButton>
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════════
          Scroll indicator
          ═══════════════════════════════════════════════ */}
      <motion.div
        style={{ opacity: scrollOpacity, y: scrollY2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 pointer-events-none z-20"
      >
        <span
          className="text-[9px] tracking-[0.4em] uppercase"
          style={{ color: `${T.goldLeaf}80`, fontFamily: "var(--font-fraunces), Georgia, serif" }}
        >
          Discover
        </span>
        <div className="w-px h-14 relative overflow-hidden" style={{ background: `${T.gold}30` }}>
          <motion.div
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-x-0 h-5"
            style={{ background: `linear-gradient(180deg, transparent, ${T.goldBright})` }}
          />
        </div>
      </motion.div>
    </div>
  );
}