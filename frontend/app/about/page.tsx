"use client";

import Link from "next/link";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { ArrowRight, Heart, Zap, Shield, Users } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { StaggerReveal } from "@/components/ui/StaggerReveal";
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
   Cinematic Hero Images (Artisan/Craft themed)
—————————————————————————————————————————————— */
const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&auto=format&fit=crop",
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
      <filter id="grain-about">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain-about)" />
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
      setCurrentIndex((prev: number) => (prev + 1) % images.length);
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
            alt="Maison craftsmanship"
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
            <filter id="img-grain-about">
              <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
              <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#img-grain-about)" />
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

const VALUES = [
  {
    icon: Heart,
    title: "Client First",
    text: "Every decision begins with what serves our clients best. No exceptions, no compromises.",
  },
  {
    icon: Zap,
    title: "Expedited & Reliable",
    text: "2–4 day tracked delivery, executed with precision across all 64 districts.",
  },
  {
    icon: Shield,
    title: "Authenticated Quality",
    text: "Every piece is rigorously inspected. If it does not meet our exacting standards, it does not reach you.",
  },
  {
    icon: Users,
    title: "Inherent Trust",
    text: "Seamless Cash on Delivery, 7-day return privileges, and dedicated human support.",
  },
];

const TIMELINE = [
  {
    year: "2024",
    title: "The Inception",
    text: "Born from a singular frustration: acquiring quality products online in Bangladesh should not be an ordeal.",
  },
  {
    year: "2025",
    title: "First Acquisitions",
    text: "Fulfilled our initial 100 orders, learning precisely what discerning clients value most.",
  },
  {
    year: "2026",
    title: "Refined Scale",
    text: "Now serving all 64 districts with automated tracking, seamless COD, and a community of 10,000+ satisfied patrons.",
  },
];

export default function AboutPage() {
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
                      Our Philosophy
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
                    Quality curated,{" "}
                    <span className="italic font-light relative inline-block">
                      delivered seamlessly.
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
                    We established Maison with a singular objective: to bring exceptional, authenticated products to every corner of Bangladesh.
                  </motion.p>
                </div>

                {/* ── Image Side ── */}
                <div className="col-span-5 md:col-span-2 relative order-1 md:order-2">
                  <CinematicImageSlider images={HERO_IMAGES} />

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

      {/* Mission */}
      <section className="container-x py-16 md:py-24 max-w-3xl relative z-10">
        <ScrollReveal direction="up">
          <p
            className="leading-relaxed text-lg mb-8"
            style={{
              fontFamily: "var(--font-fraunces), Georgia, serif",
              color: T.ink,
              lineHeight: 1.8,
            }}
          >
            Complimentary Cash on Delivery, ensuring you settle payment only upon arrival. Precision-tracked shipping, so you are always informed. And dedicated, real human support whenever you reach out. This is our foundational model.
          </p>

          <p
            className="leading-relaxed text-lg"
            style={{
              fontFamily: "var(--font-fraunces), Georgia, serif",
              color: T.inkSoft,
              lineHeight: 1.8,
            }}
          >
            Today, we dispatch to all 64 districts, serving a growing community of over 10,000 satisfied patrons. Tomorrow, we are engineering the infrastructure that empowers any Bangladeshi artisan to operate with the same speed, reliability, and elegance.
          </p>
        </ScrollReveal>
      </section>

      {/* Values */}
      <section
        className="relative border-y"
        style={{
          background: T.bone,
          borderColor: `${T.gold}25`,
        }}
      >
        <div className="container-x py-20 md:py-24 relative z-10">
          <ScrollReveal direction="up">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-8" style={{ background: T.gold, opacity: 0.5 }} />
              <p
                className="text-[9px] tracking-[0.4em] uppercase"
                style={{ color: T.gold, fontFamily: "var(--font-fraunces), Georgia, serif" }}
              >
                Our Principles
              </p>
            </div>
            <h2
              className="mb-14 max-w-2xl leading-[0.95] tracking-[-0.02em]"
              style={{
                fontFamily: "var(--font-fraunces), Georgia, serif",
                fontSize: "clamp(32px, 4.5vw, 52px)",
                fontWeight: 400,
                color: T.ink,
              }}
            >
              Four principles we{" "}
              <span className="italic font-light" style={{ color: T.wine }}>
                hold absolute.
              </span>
            </h2>
          </ScrollReveal>

          <StaggerReveal stagger={0.1} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {VALUES.map((value) => (
              <div
                key={value.title}
                className="group relative p-8 rounded-sm border transition-all duration-500 hover:border-[#B8935A]/50 hover:shadow-[0_12px_32px_-16px_rgba(28,22,18,0.15)]"
                style={{
                  background: T.bg,
                  borderColor: `${T.gold}25`,
                }}
              >
                <div
                  className="absolute inset-2 pointer-events-none rounded-sm border border-[#B8935A] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  aria-hidden
                />

                <div
                  className="w-12 h-12 rounded-sm flex items-center justify-center mb-6 transition-colors duration-500"
                  style={{
                    background: `${T.gold}10`,
                    border: `1px solid ${T.gold}30`,
                  }}
                >
                  <value.icon className="w-5 h-5 transition-colors duration-500" strokeWidth={1.5} style={{ color: T.gold }} />
                </div>

                <h3
                  className="mb-3"
                  style={{
                    fontFamily: "var(--font-fraunces), Georgia, serif",
                    fontSize: "18px",
                    fontWeight: 500,
                    color: T.ink,
                  }}
                >
                  {value.title}
                </h3>

                <p
                  className="leading-relaxed"
                  style={{
                    fontFamily: "var(--font-fraunces), Georgia, serif",
                    fontSize: "14px",
                    color: T.inkSoft,
                    lineHeight: 1.7,
                  }}
                >
                  {value.text}
                </p>
              </div>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* Timeline */}
      <section className="container-x py-20 md:py-24 max-w-3xl relative z-10">
        <ScrollReveal direction="up">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-px w-8" style={{ background: T.gold, opacity: 0.5 }} />
            <p
              className="text-[9px] tracking-[0.4em] uppercase"
              style={{ color: T.gold, fontFamily: "var(--font-fraunces), Georgia, serif" }}
            >
              The Journey
            </p>
          </div>
          <h2
            className="mb-14 leading-[0.95] tracking-[-0.02em]"
            style={{
              fontFamily: "var(--font-fraunces), Georgia, serif",
              fontSize: "clamp(32px, 4.5vw, 52px)",
              fontWeight: 400,
              color: T.ink,
            }}
          >
            How we{" "}
            <span className="italic font-light" style={{ color: T.wine }}>
              arrived.
            </span>
          </h2>
        </ScrollReveal>

        <div className="relative">
          <div
            className="absolute left-[15px] top-4 bottom-4 w-px"
            style={{ background: `linear-gradient(180deg, ${T.gold}40, ${T.gold}10)` }}
          />

          <div className="space-y-12">
            {TIMELINE.map((item, i) => (
              <ScrollReveal key={item.year} direction="left" delay={i * 0.1}>
                <div className="relative pl-14 group">
                  <div
                    className="absolute left-0 top-1.5 w-8 h-8 rounded-sm flex items-center justify-center transition-all duration-500"
                    style={{
                      background: T.bg,
                      border: `1px solid ${T.gold}40`,
                      boxShadow: `0 4px 12px -4px rgba(28,22,18,0.1)`,
                    }}
                  >
                    <div className="w-2 h-2 rounded-sm" style={{ background: T.gold }} />
                  </div>

                  <p
                    className="text-[9px] tracking-[0.35em] uppercase mb-2"
                    style={{
                      color: T.gold,
                      fontFamily: "var(--font-fraunces), Georgia, serif",
                      fontWeight: 500,
                    }}
                  >
                    {item.year}
                  </p>
                  <h3
                    className="mb-3"
                    style={{
                      fontFamily: "var(--font-fraunces), Georgia, serif",
                      fontSize: "22px",
                      fontWeight: 500,
                      color: T.ink,
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="leading-relaxed"
                    style={{
                      fontFamily: "var(--font-fraunces), Georgia, serif",
                      fontSize: "15px",
                      color: T.inkSoft,
                      lineHeight: 1.7,
                    }}
                  >
                    {item.text}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-x py-20 md:py-24 relative z-10">
        <ScrollReveal direction="scale">
          <div
            className="relative overflow-hidden rounded-sm p-12 md:p-20 text-center"
            style={{
              background: T.ink,
              border: `1px solid ${T.gold}30`,
              boxShadow: `0 24px 64px -24px rgba(28,22,18,0.5)`,
            }}
          >
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(60% 80% at 50% 100%, ${T.gold}15, transparent 70%)`,
              }}
            />

            <div
              className="absolute inset-3 pointer-events-none rounded-sm"
              style={{ border: `0.5px solid ${T.gold}`, opacity: 0.2 }}
              aria-hidden
            />

            <div className="relative z-10">
              <h2
                className="mb-5 leading-[0.95] tracking-[-0.02em]"
                style={{
                  fontFamily: "var(--font-fraunces), Georgia, serif",
                  fontSize: "clamp(32px, 4.5vw, 52px)",
                  fontWeight: 400,
                  color: T.bone,
                }}
              >
                Ready to{" "}
                <span className="italic font-light" style={{ color: T.goldBright }}>
                  explore?
                </span>
              </h2>
              <p
                className="max-w-lg mx-auto mb-10"
                style={{
                  fontFamily: "var(--font-fraunces), Georgia, serif",
                  fontSize: "15px",
                  lineHeight: 1.7,
                  color: T.inkSoft,
                }}
              >
                Discover our curated collections. Complimentary nationwide delivery and seamless Cash on Delivery for every acquisition.
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
                Browse the collection
                <svg
                  width="14"
                  height="10"
                  viewBox="0 0 14 10"
                  fill="none"
                  className="group-hover:translate-x-1 transition-transform duration-300"
                  aria-hidden
                >
                  <path d="M1 5 H13 M9 1 L13 5 L9 9" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}