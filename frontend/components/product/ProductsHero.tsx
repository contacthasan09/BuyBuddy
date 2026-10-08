"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { useRef } from "react";

const T = {
  bg: "#F0E8D5",
  ink: "#120E0A",
  inkSoft: "#6B5D4F",
  gold: "#C59D5F",
  goldBright: "#E8C87A",
  goldLeaf: "#F2DCA4",
  wine: "#3D1216",
  bone: "#FAF5EB",
};

const EASE_EXPO = [0.16, 1, 0.3, 1] as const;
const EASE_SOFT = [0.22, 0.61, 0.36, 1] as const;

interface ProductsHeroProps {
  total: number;
  search?: string;
  categoryName?: string;
}

function Grain() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.05] mix-blend-multiply"
    >
      <filter id="grain-hero-haute">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.85"
          numOctaves="3"
          stitchTiles="stitch"
        />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0"
        />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain-hero-haute)" />
    </svg>
  );
}

function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [1.6, -1.6]), {
    stiffness: 150,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-1.6, 1.6]), {
    stiffness: 150,
    damping: 20,
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
        perspective: 1000,
      }}
      className="relative"
    >
      {children}
    </motion.div>
  );
}

export function ProductsHero({
  total,
  search,
  categoryName,
}: ProductsHeroProps) {
  let title = "All products";
  if (search) title = `Results for "${search}"`;
  if (categoryName) title = categoryName;

  const eyebrowLabel = categoryName
    ? "Category"
    : search
      ? "Search"
      : "Browse";

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: `radial-gradient(ellipse at 50% 0%, ${T.bone} 0%, ${T.bg} 60%, ${T.bg} 100%)`,
        borderBottom: `1px solid ${T.gold}25`,
      }}
    >
      <Grain />

      {/* Light leaks — single, subtler */}
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

      {/* Content — tightened padding + reduced card width */}
      <div
        className="relative container-x pt-14 pb-12 md:pt-20 md:pb-16"
        style={{ zIndex: 10 }}
      >
        <motion.div
          variants={staggerContainer(0.09)}
          initial="hidden"
          animate="visible"
          className="max-w-2xl mx-auto"
        >
          <TiltCard>
            <motion.div
              variants={fadeUp}
              className="relative rounded-sm p-6 md:p-9 overflow-hidden"
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
              {/* Inner gold hairline */}
              <div
                aria-hidden
                className="absolute inset-2.5 pointer-events-none rounded-sm"
                style={{ border: `0.5px solid ${T.gold}`, opacity: 0.22 }}
              />

              {/* Corner ornaments — smaller */}
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
                  <svg viewBox="0 0 16 16" fill="none">
                    <path
                      d="M0 0 L16 0 L16 16"
                      stroke={T.gold}
                      strokeWidth="0.8"
                      opacity="0.6"
                    />
                    <circle
                      cx="1.5"
                      cy="1.5"
                      r="1"
                      fill={T.goldBright}
                      opacity="0.8"
                    />
                  </svg>
                </div>
              ))}

              {/* Top edge highlight */}
              <div
                aria-hidden
                className="absolute top-0 left-0 right-0 h-px pointer-events-none"
                style={{
                  background: `linear-gradient(90deg, transparent, ${T.goldBright}80, transparent)`,
                }}
              />

              <div
                className="relative"
                style={{ transform: "translateZ(20px)" }}
              >
                {/* Eyebrow */}
                <motion.div
                  variants={fadeUp}
                  className="flex items-center gap-3 mb-5"
                >
                  <div
                    className="flex items-center justify-center w-6 h-6 rounded-full"
                    style={{
                      background: `linear-gradient(135deg, ${T.goldBright}30, ${T.gold}20)`,
                      border: `1px solid ${T.gold}40`,
                    }}
                  >
                    <span className="text-[10px]" style={{ color: T.gold }}>
                      ❖
                    </span>
                  </div>
                  <div
                    className="h-px flex-1"
                    style={{
                      background: `linear-gradient(90deg, ${T.gold}40, transparent)`,
                    }}
                  />
                  <p
                    className="text-[9px] tracking-[0.35em] uppercase font-medium"
                    style={{
                      color: T.inkSoft,
                      fontFamily: "var(--font-fraunces), Georgia, serif",
                    }}
                  >
                    {eyebrowLabel}
                    <span
                      className="mx-2.5"
                      style={{ color: T.gold, opacity: 0.4 }}
                    >
                      /
                    </span>
                    <motion.span
                      key={total}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: EASE_EXPO }}
                      style={{ color: T.ink }}
                    >
                      {total} {total === 1 ? "piece" : "pieces"}
                    </motion.span>
                  </p>
                </motion.div>

                {/* Headline — smaller clamp */}
                <motion.h1
                  variants={fadeUp}
                  className="mb-5 relative leading-[0.95] tracking-[-0.025em]"
                  style={{
                    color: T.ink,
                    fontFamily: "var(--font-fraunces), Georgia, serif",
                    fontSize: "clamp(30px, 4vw, 52px)",
                    fontWeight: 400,
                  }}
                >
                  {title === "All products" ? (
                    <>
                      Our{" "}
                      <span className="italic font-light relative inline-block">
                        collection
                        <ShineSpan />
                      </span>
                      <span style={{ color: T.gold }}>.</span>
                    </>
                  ) : search ? (
                    <>
                      Results for{" "}
                      <span className="italic font-light relative inline-block">
                        &ldquo;{search}&rdquo;
                        <ShineSpan />
                      </span>
                      <span style={{ color: T.gold }}>.</span>
                    </>
                  ) : (
                    <>
                      {title}
                      <span className="italic font-light relative inline-block">
                        .
                        <ShineSpan />
                      </span>
                    </>
                  )}
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  variants={fadeUp}
                  className="max-w-lg mb-6"
                  style={{
                    color: T.inkSoft,
                    fontFamily: "var(--font-fraunces), Georgia, serif",
                    fontSize: "clamp(13px, 1vw, 15px)",
                    lineHeight: 1.65,
                    letterSpacing: "0.01em",
                  }}
                >
                  Carefully curated pieces, quality assured. Complimentary
                  delivery across all 64 districts of Bangladesh. Order in 30
                  seconds — settle securely upon arrival.
                </motion.p>

                {/* Stat ribbon — tighter */}
                <motion.div
                  variants={fadeUp}
                  className="flex flex-wrap items-center gap-x-5 gap-y-3"
                >
                  <StatPill label="COD" value="Nationwide" index={0} />
                  <Divider />
                  <StatPill label="Returns" value="7 Days" index={1} />
                  <Divider />
                  <StatPill label="Shipping" value="1–3 Days" index={2} />
                </motion.div>
              </div>
            </motion.div>
          </TiltCard>
        </motion.div>
      </div>

      {/* Bottom fade — shorter */}
      <div
        aria-hidden
        className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
        style={{
          background: `linear-gradient(180deg, transparent 0%, ${T.bg} 100%)`,
          zIndex: 5,
        }}
      />
    </section>
  );
}

/* ─── Shine ─── */
function ShineSpan() {
  return (
    <motion.span
      aria-hidden
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `linear-gradient(
          110deg,
          transparent 25%,
          rgba(255,255,255,0.1) 40%,
          ${T.goldBright} 50%,
          rgba(255,255,255,0.1) 60%,
          transparent 75%
        )`,
        backgroundSize: "300% 100%",
        backgroundPosition: "150% 0",
        backgroundRepeat: "no-repeat",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
        mixBlendMode: "soft-light",
        filter: "drop-shadow(0 0 8px rgba(232, 200, 122, 0.3))",
      }}
      initial={{ backgroundPosition: "150% 0" }}
      animate={{ backgroundPosition: ["150% 0", "-50% 0"] }}
      transition={{
        duration: 3.5,
        ease: EASE_SOFT,
        repeat: Infinity,
        repeatDelay: 6,
        delay: 1.5,
      }}
    >
      {"\u00A0"}
    </motion.span>
  );
}

/* ─── Stat pill — smaller ─── */
function StatPill({
  label,
  value,
  index,
}: {
  label: string;
  value: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{
        duration: 0.6,
        ease: EASE_EXPO,
        delay: 0.5 + index * 0.08,
      }}
      className="flex items-center gap-2.5 px-3 py-2 rounded-sm"
      style={{
        background: `linear-gradient(135deg, ${T.bone}80, ${T.bg}80)`,
        border: `1px solid ${T.gold}30`,
        backdropFilter: "blur(8px)",
        boxShadow: `0 3px 10px -4px ${T.gold}15`,
      }}
    >
      <span
        className="text-[8px] uppercase tracking-[0.3em] font-semibold"
        style={{
          color: T.gold,
          fontFamily: "var(--font-fraunces), Georgia, serif",
        }}
      >
        {label}
      </span>
      <span
        className="text-[12px] font-medium"
        style={{
          color: T.ink,
          fontFamily: "var(--font-fraunces), Georgia, serif",
        }}
      >
        {value}
      </span>
    </motion.div>
  );
}

function Divider() {
  return (
    <motion.span
      aria-hidden
      initial={{ scaleY: 0, opacity: 0 }}
      animate={{ scaleY: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: EASE_EXPO, delay: 0.7 }}
      className="hidden sm:block h-4 w-px origin-center"
      style={{
        background: `linear-gradient(180deg, transparent, ${T.gold}50, transparent)`,
      }}
    />
  );
}