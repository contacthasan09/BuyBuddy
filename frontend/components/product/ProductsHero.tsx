"use client";

import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { useRef, useState, useEffect } from "react";

/* ——————————————————————————————————————————————
   Palette — Maison "Haute" Cinematic edition
—————————————————————————————————————————————— */
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

const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop",
];

interface ProductsHeroProps {
  total: number;
  search?: string;
  categoryName?: string;
  images?: string[];
}

/* ——————————————————————————————————————————————
   SVG noise — ultra-fine organic paper grain
—————————————————————————————————————————————— */
function Grain() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.05] mix-blend-multiply"
    >
      <filter id="grain-hero-haute">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain-hero-haute)" />
    </svg>
  );
}

/* ——————————————————————————————————————————————
   3D Tilt Card Wrapper (Subtle & Premium)
—————————————————————————————————————————————— */
function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [1.2, -1.2]), { stiffness: 150, damping: 25 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-1.2, 1.2]), { stiffness: 150, damping: 25 });

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
      className="relative w-full h-full min-h-[280px] md:min-h-0 overflow-hidden bg-[#E8DFCB]"
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
          {/* Ken Burns slow zoom effect */}
          <motion.img
            src={images[currentIndex]}
            alt="Featured collection"
            className="w-full h-full object-cover"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 6, ease: "linear" }}
          />
          
          {/* Cinematic vignette */}
          <div 
            className="absolute inset-0 pointer-events-none" 
            style={{ background: `radial-gradient(circle at center, transparent 40%, rgba(18,14,10,0.25) 100%)` }} 
          />
          
          {/* Image-specific grain for seamless blending */}
          <svg className="pointer-events-none absolute inset-0 w-full h-full opacity-[0.08] mix-blend-overlay">
             <filter id="img-grain">
               <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
               <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0" />
             </filter>
             <rect width="100%" height="100%" filter="url(#img-grain)" />
          </svg>
        </motion.div>
      </AnimatePresence>

      {/* Cinematic progress bar */}
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

      {/* Elegant pagination dots */}
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

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════ */
export function ProductsHero({ total, search, categoryName, images }: ProductsHeroProps) {
  let title = "All products";
  if (search) title = `Results for "${search}"`;
  if (categoryName) title = categoryName;

  const eyebrowLabel = categoryName ? "Category" : search ? "Search" : "Browse";
  const sliderImages = images && images.length > 0 ? images : DEFAULT_IMAGES;

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: `radial-gradient(ellipse at 50% 0%, ${T.bone} 0%, ${T.bg} 60%, ${T.bg} 100%)`,
        borderBottom: `1px solid ${T.gold}25`,
      }}
    >
      <Grain />

      {/* ── Volumetric Ambient Lighting ─────────── */}
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

      {/* ── Cinematic Vignette ──────────────────── */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background: `radial-gradient(120% 90% at 50% 30%, transparent 35%, ${T.bg}90 100%)`,
        }}
      />

      {/* ── Content ─────────────────────────────── */}
      <div className="relative container-x pt-14 pb-12 md:pt-20 md:pb-16" style={{ zIndex: 10 }}>
        <motion.div
          variants={staggerContainer(0.09)}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          <TiltCard>
            <motion.div
              variants={fadeUp}
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
                <motion.div variants={fadeUp} className="flex items-center gap-3 mb-5">
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
                    {eyebrowLabel}
                    <span className="mx-2.5" style={{ color: T.gold, opacity: 0.4 }}>/</span>
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

                {/* Headline */}
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
                  Carefully curated pieces, quality assured. Complimentary delivery across all 64 districts of Bangladesh. Order in 30 seconds — settle securely upon arrival.
                </motion.p>

                {/* Stat ribbon */}
                <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-x-5 gap-y-3">
                  <StatPill label="COD" value="Nationwide" index={0} />
                  <Divider />
                  <StatPill label="Returns" value="7 Days" index={1} />
                  <Divider />
                  <StatPill label="Shipping" value="1–3 Days" index={2} />
                </motion.div>
              </div>

              {/* ── Image Side ── */}
              <div className="col-span-5 md:col-span-2 relative order-1 md:order-2">
                <CinematicImageSlider images={sliderImages} />
                
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
  );
}

/* ═══════════════════════════════════════════════════════
   SHINE — ultra-realistic specular gold foil reflection
   ═══════════════════════════════════════════════════════ */
function ShineSpan() {
  return (
    <motion.span
      aria-hidden
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `linear-gradient(110deg, transparent 25%, rgba(255,255,255,0.1) 40%, ${T.goldBright} 50%, rgba(255,255,255,0.1) 60%, transparent 75%)`,
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

/* ═══════════════════════════════════════════════════════
   STAT PILL — frosted glass engraved badge
   ═══════════════════════════════════════════════════════ */
function StatPill({ label, value, index }: { label: string; value: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.6, ease: EASE_EXPO, delay: 0.5 + index * 0.08 }}
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
        style={{ color: T.gold, fontFamily: "var(--font-fraunces), Georgia, serif" }}
      >
        {label}
      </span>
      <span
        className="text-[12px] font-medium"
        style={{ color: T.ink, fontFamily: "var(--font-fraunces), Georgia, serif" }}
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
      style={{ background: `linear-gradient(180deg, transparent, ${T.gold}50, transparent)` }}
    />
  );
}