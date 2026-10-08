"use client";

import Link from "next/link";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import {
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Facebook,
  Instagram,
} from "lucide-react";
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
   Cinematic Hero Images (Atelier/Concierge themed)
—————————————————————————————————————————————— */
const CONTACT_HERO_IMAGES = [
  "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop",
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
      <filter id="grain-contact">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain-contact)" />
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
            alt="Maison concierge"
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
            <filter id="img-grain-contact">
              <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
              <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#img-grain-contact)" />
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

const CONTACTS = [
  {
    icon: Phone,
    label: "Telephone",
    value: "+880 1700-000000",
    href: "tel:+8801700000000",
    note: "Available daily, 9 AM – 9 PM",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp Concierge",
    value: "Message Us",
    href: "https://wa.me/8801700000000",
    note: "Expedited response guaranteed",
    accent: true,
  },
  {
    icon: Mail,
    label: "Electronic Mail",
    value: "concierge@maison.com",
    href: "mailto:concierge@maison.com",
    note: "Responses within 24 hours",
  },
  {
    icon: MapPin,
    label: "Atelier Address",
    value: "Dhaka, Bangladesh",
    href: undefined,
    note: "Complimentary nationwide delivery",
  },
];

export default function ContactPage() {
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
                      Concierge & Inquiries
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
                    At your{" "}
                    <span className="italic font-light relative inline-block">
                      service.
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
                    Questions regarding an acquisition or our collections? Our dedicated concierge is available to assist you. Reach us via WhatsApp for the most expedited response.
                  </motion.p>
                </div>

                {/* ── Image Side ── */}
                <div className="col-span-5 md:col-span-2 relative order-1 md:order-2">
                  <CinematicImageSlider images={CONTACT_HERO_IMAGES} />

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

      {/* Contact cards */}
      <section className="container-x py-20 md:py-24 max-w-5xl relative z-10">
        <StaggerReveal stagger={0.08} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {CONTACTS.map((contact) => {
            const content = (
              <>
                <div
                  className="w-12 h-12 rounded-sm flex items-center justify-center mb-6 transition-colors duration-500"
                  style={{
                    background: contact.accent ? `${T.gold}15` : `${T.gold}10`,
                    border: `1px solid ${contact.accent ? T.gold : `${T.gold}30`}`,
                  }}
                >
                  <contact.icon
                    className="w-5 h-5 transition-colors duration-500"
                    strokeWidth={1.5}
                    style={{ color: T.gold }}
                  />
                </div>
                <p
                  className="text-[9px] tracking-[0.35em] uppercase mb-2"
                  style={{ color: T.inkSoft, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                >
                  {contact.label}
                </p>
                <p
                  className="text-[16px] font-medium mb-2"
                  style={{ color: T.ink, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                >
                  {contact.value}
                </p>
                <p
                  className="text-[12px] leading-relaxed"
                  style={{ color: T.inkSoft, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                >
                  {contact.note}
                </p>
              </>
            );

            if (contact.href) {
              return (
                <a
                  key={contact.label}
                  href={contact.href}
                  target={contact.href.startsWith("http") ? "_blank" : undefined}
                  rel={contact.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group relative block p-8 rounded-sm border transition-all duration-500 hover:shadow-[0_12px_32px_-16px_rgba(28,22,18,0.15)]"
                  style={{
                    background: contact.accent ? `${T.gold}08` : T.bg,
                    borderColor: contact.accent ? `${T.gold}40` : `${T.gold}25`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${T.gold}60`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = contact.accent ? `${T.gold}40` : `${T.gold}25`;
                  }}
                >
                  <div
                    className="absolute inset-2 pointer-events-none rounded-sm border border-[#B8935A] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    aria-hidden
                  />
                  {content}
                </a>
              );
            }

            return (
              <div
                key={contact.label}
                className="group relative block p-8 rounded-sm border transition-all duration-500 hover:border-[#B8935A]/50 hover:shadow-[0_12px_32px_-16px_rgba(28,22,18,0.15)]"
                style={{
                  background: T.bg,
                  borderColor: `${T.gold}25`,
                }}
              >
                <div
                  className="absolute inset-2 pointer-events-none rounded-sm border border-[#B8935A] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  aria-hidden
                />
                {content}
              </div>
            );
          })}
        </StaggerReveal>
      </section>

      {/* Business hours + social */}
      <section className="container-x pb-20 md:pb-24 max-w-5xl relative z-10">
        <div className="grid md:grid-cols-2 gap-6">
          <ScrollReveal direction="left">
            <div
              className="relative p-8 rounded-sm border"
              style={{
                background: T.bone,
                borderColor: `${T.gold}25`,
              }}
            >
              <div
                className="absolute inset-2 pointer-events-none rounded-sm border border-[#B8935A] opacity-20"
                aria-hidden
              />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <Clock className="w-5 h-5" strokeWidth={1.5} style={{ color: T.gold }} />
                  <h2
                    className="text-[9px] tracking-[0.4em] uppercase"
                    style={{ color: T.gold, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                  >
                    Hours of Operation
                  </h2>
                </div>
                <ul className="space-y-4">
                  {[
                    { day: "Saturday – Thursday", hours: "9 AM – 9 PM" },
                    { day: "Friday", hours: "2 PM – 9 PM" },
                    { day: "Public Holidays", hours: "WhatsApp Only" },
                  ].map((item, i) => (
                    <li key={i} className="flex justify-between items-baseline">
                      <span
                        className="text-[13px]"
                        style={{ color: T.inkSoft, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                      >
                        {item.day}
                      </span>
                      <span
                        className="text-[13px] font-medium tabular-nums"
                        style={{ color: T.ink, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                      >
                        {item.hours}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.1}>
            <div
              className="relative p-8 rounded-sm border"
              style={{
                background: T.bone,
                borderColor: `${T.gold}25`,
              }}
            >
              <div
                className="absolute inset-2 pointer-events-none rounded-sm border border-[#B8935A] opacity-20"
                aria-hidden
              />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <MessageCircle className="w-5 h-5" strokeWidth={1.5} style={{ color: T.gold }} />
                  <h2
                    className="text-[9px] tracking-[0.4em] uppercase"
                    style={{ color: T.gold, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                  >
                    Connect With Us
                  </h2>
                </div>
                <div className="flex gap-3 mb-6">
                  {[
                    { href: "https://facebook.com", icon: Facebook, label: "Facebook" },
                    { href: "https://instagram.com", icon: Instagram, label: "Instagram" },
                    { href: "https://wa.me/8801700000000", icon: MessageCircle, label: "WhatsApp" },
                  ].map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group w-11 h-11 rounded-sm border flex items-center justify-center transition-all duration-300"
                      style={{
                        background: T.bg,
                        borderColor: `${T.gold}30`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = T.gold;
                        e.currentTarget.style.background = `${T.gold}10`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = `${T.gold}30`;
                        e.currentTarget.style.background = T.bg;
                      }}
                      aria-label={social.label}
                    >
                      <social.icon
                        className="w-4 h-4 transition-colors duration-300"
                        strokeWidth={1.5}
                        style={{ color: T.inkSoft }}
                      />
                    </a>
                  ))}
                </div>
                <p
                  className="text-[12px] leading-relaxed"
                  style={{ color: T.inkSoft, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                >
                  Receive exclusive collection previews, private offers, and behind-the-scenes insights from our atelier.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FAQ teaser */}
      <section className="container-x pb-24 relative z-10">
        <ScrollReveal direction="scale">
          <div
            className="relative overflow-hidden rounded-sm p-10 md:p-16 text-center"
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
                className="mb-4 leading-[0.95] tracking-[-0.02em]"
                style={{
                  fontFamily: "var(--font-fraunces), Georgia, serif",
                  fontSize: "clamp(28px, 4vw, 40px)",
                  fontWeight: 400,
                  color: T.bone,
                }}
              >
                Seeking{" "}
                <span className="italic font-light" style={{ color: T.goldBright }}>
                  immediate guidance?
                </span>
              </h2>
              <p
                className="max-w-lg mx-auto mb-8"
                style={{
                  fontFamily: "var(--font-fraunces), Georgia, serif",
                  fontSize: "14px",
                  lineHeight: 1.7,
                  color: T.inkSoft,
                }}
              >
                Our comprehensive guide addresses the most frequent inquiries regarding delivery protocols, return privileges, and Cash on Delivery.
              </p>
              <Link
                href="/faq"
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
                Consult the FAQ
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