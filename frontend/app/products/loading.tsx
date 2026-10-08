"use client";

import { motion } from "framer-motion";

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
  boneDeep: "#E8DFCB",
};

/* ——————————————————————————————————————————————
   Shimmer block — warm gold sweep via framer-motion
—————————————————————————————————————————————— */
function ShimmerBlock({
  className = "",
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        background: T.boneDeep,
        border: `0.5px solid ${T.gold}20`,
      }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${T.goldLeaf}80 50%, transparent 100%)`,
        }}
        initial={{ x: "-100%" }}
        animate={{ x: "200%" }}
        transition={{
          duration: 2.4,
          repeat: Infinity,
          ease: "linear",
          delay,
          repeatDelay: 0.6,
        }}
      />
    </div>
  );
}

/* ——————————————————————————————————————————————
   Product card skeleton
—————————————————————————————————————————————— */
function CardSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <div
      className="relative overflow-hidden rounded-sm"
      style={{
        background: T.bone,
        border: `1px solid ${T.gold}25`,
        boxShadow: `0 1px 0 ${T.gold}15, 0 12px 24px -12px rgba(28,22,18,0.12)`,
      }}
    >
      {/* Inner gold hairline */}
      <div
        className="absolute inset-1.5 pointer-events-none z-20 rounded-sm"
        style={{ border: `0.5px solid ${T.gold}`, opacity: 0.18 }}
        aria-hidden
      />

      {/* Corner ornaments */}
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
            <path
              d="M0 0 L10 0 L10 10"
              stroke={T.gold}
              strokeWidth="0.7"
              opacity="0.5"
            />
            <circle cx="0.8" cy="0.8" r="0.6" fill={T.gold} opacity="0.6" />
          </svg>
        </div>
      ))}

      {/* Image area */}
      <div className="relative aspect-square">
        <ShimmerBlock className="absolute inset-0" delay={delay} />

        {/* Wax seal placeholder */}
        <div
          className="absolute top-2.5 right-2.5 z-20 h-9 w-9 rounded-full"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${T.goldBright}50, ${T.gold}30 70%, #8A6B3A30 100%)`,
            border: `0.5px solid ${T.gold}40`,
          }}
          aria-hidden
        />
      </div>

      {/* Body */}
      <div className="p-3 flex items-start justify-between gap-2">
        {/* Left: name + tag */}
        <div className="flex-1 min-w-0 space-y-2">
          <ShimmerBlock className="h-3.5 w-4/5" delay={delay + 0.1} />
          <ShimmerBlock className="h-3.5 w-3/5" delay={delay + 0.2} />
          <ShimmerBlock className="h-2.5 w-1/3 mt-1.5" delay={delay + 0.3} />
        </div>

        {/* Right: price */}
        <div className="shrink-0 space-y-1.5 text-right">
          <ShimmerBlock className="h-4 w-14 ml-auto" delay={delay + 0.15} />
          <ShimmerBlock className="h-2.5 w-10 ml-auto" delay={delay + 0.25} />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════ */
export default function ProductsLoading() {
  return (
    <div className="relative min-h-screen" style={{ background: T.bg }}>
      {/* Subtle organic grain overlay */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.06] mix-blend-multiply"
      >
        <filter id="grain-loading">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            stitchTiles="stitch"
          />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-loading)" />
      </svg>

      {/* ═══════════════════════════════════════════════
          Hero skeleton — editorial card
          ═══════════════════════════════════════════════ */}
      <section
        className="relative border-b"
        style={{ borderColor: `${T.gold}30` }}
      >
        <div className="container-x py-16 md:py-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <div
              className="relative rounded-sm p-8 md:p-12 lg:p-14 overflow-hidden"
              style={{
                background: T.bone,
                border: `1px solid ${T.gold}40`,
                boxShadow: `0 1px 0 ${T.gold}20, 0 30px 80px -30px rgba(28,22,18,0.25)`,
              }}
            >
              {/* Inner gold hairline */}
              <div
                className="absolute inset-3 pointer-events-none rounded-sm"
                style={{ border: `0.5px solid ${T.gold}`, opacity: 0.2 }}
                aria-hidden
              />

              {/* Corner ornaments */}
              {[
                { top: 8, left: 8, rotate: 0 },
                { top: 8, right: 8, rotate: 90 },
                { bottom: 8, right: 8, rotate: 180 },
                { bottom: 8, left: 8, rotate: 270 },
              ].map((pos, idx) => (
                <div
                  key={idx}
                  className="absolute w-3 h-3 pointer-events-none"
                  style={{
                    top: pos.top,
                    right: pos.right,
                    bottom: pos.bottom,
                    left: pos.left,
                    transform: `rotate(${pos.rotate}deg)`,
                  }}
                  aria-hidden
                >
                  <svg viewBox="0 0 12 12" fill="none">
                    <path
                      d="M0 0 L12 0 L12 12"
                      stroke={T.gold}
                      strokeWidth="0.7"
                      opacity="0.5"
                    />
                    <circle
                      cx="1"
                      cy="1"
                      r="0.7"
                      fill={T.gold}
                      opacity="0.6"
                    />
                  </svg>
                </div>
              ))}

              {/* Top edge highlight */}
              <div
                className="absolute top-0 left-0 right-0 h-px pointer-events-none"
                style={{
                  background: `linear-gradient(90deg, transparent, ${T.gold}50, transparent)`,
                }}
                aria-hidden
              />

              <div className="relative space-y-5">
                {/* Eyebrow placeholder */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: `${T.gold}40` }}
                  />
                  <ShimmerBlock className="h-2.5 w-24" delay={0.1} />
                </div>

                {/* Headline placeholder */}
                <div className="space-y-3">
                  <ShimmerBlock
                    className="h-10 md:h-14 w-4/5"
                    delay={0.2}
                  />
                  <ShimmerBlock
                    className="h-10 md:h-14 w-2/5"
                    delay={0.25}
                  />
                </div>

                {/* Subtitle placeholder */}
                <div className="space-y-2 max-w-xl">
                  <ShimmerBlock className="h-3 w-full" delay={0.3} />
                  <ShimmerBlock className="h-3 w-4/5" delay={0.35} />
                </div>

                {/* Stat pills placeholder */}
                <div className="flex items-center gap-4 pt-2">
                  <ShimmerBlock className="h-8 w-28" delay={0.4} />
                  <div
                    className="h-4 w-px"
                    style={{ background: `${T.gold}30` }}
                  />
                  <ShimmerBlock className="h-8 w-24" delay={0.45} />
                  <div
                    className="h-4 w-px"
                    style={{ background: `${T.gold}30` }}
                  />
                  <ShimmerBlock className="h-8 w-24" delay={0.5} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          Filter bar skeleton
          ═══════════════════════════════════════════════ */}
      <section
        className="relative border-b"
        style={{
          borderColor: `${T.gold}30`,
          background: `${T.bone}D0`,
        }}
      >
        <div className="container-x py-5 relative z-10">
          {/* Search + Sort row */}
          <div className="flex flex-col md:flex-row gap-3 mb-4">
            <ShimmerBlock
              className="flex-1 h-12 rounded-sm"
              delay={0.1}
            />
            <ShimmerBlock
              className="w-full md:w-48 h-12 rounded-sm"
              delay={0.15}
            />
          </div>

          {/* Category chips row */}
          <div className="flex items-center gap-2 -mx-4 px-4 md:mx-0 md:px-0">
            {Array.from({ length: 6 }).map((_, i) => (
              <ShimmerBlock
                key={i}
                className="h-8 w-20 md:w-24 rounded-sm flex-shrink-0"
                delay={0.2 + i * 0.05}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          Grid skeleton
          ═══════════════════════════════════════════════ */}
      <section className="container-x py-12 md:py-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-8 md:gap-x-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.5, delay: i * 0.04 }}
            >
              <CardSkeleton delay={i * 0.08} />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}