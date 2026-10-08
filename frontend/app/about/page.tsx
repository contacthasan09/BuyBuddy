"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Heart, Zap, Shield, Users } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { StaggerReveal } from "@/components/ui/StaggerReveal";

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
      <filter id="grain-about">
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
      <rect width="100%" height="100%" filter="url(#grain-about)" />
    </svg>
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
    <div
      className="relative min-h-screen"
      style={{ background: T.bg, color: T.ink }}
    >
      <Grain />

      {/* Hero */}
      <section
        className="relative border-b"
        style={{ borderColor: `${T.gold}30` }}
      >
        <div className="container-x py-20 md:py-28 max-w-4xl relative z-10">
          <ScrollReveal direction="up">
            <div className="flex items-center gap-3 mb-6">
              <span
                className="h-px w-8"
                style={{ background: T.gold, opacity: 0.5 }}
              />
              <p
                className="text-[9px] tracking-[0.4em] uppercase"
                style={{
                  color: T.gold,
                  fontFamily: "var(--font-fraunces), Georgia, serif",
                }}
              >
                Our Philosophy
              </p>
            </div>

            <h1
              className="mb-8 leading-[0.92] tracking-[-0.03em]"
              style={{
                fontFamily: "var(--font-fraunces), Georgia, serif",
                fontSize: "clamp(40px, 6vw, 72px)",
                fontWeight: 400,
                color: T.ink,
              }}
            >
              Quality curated,{" "}
              <span className="italic font-light" style={{ color: T.wine }}>
                delivered seamlessly.
              </span>
            </h1>

            <p
              className="text-lg max-w-2xl leading-relaxed"
              style={{
                fontFamily: "var(--font-fraunces), Georgia, serif",
                color: T.inkSoft,
                lineHeight: 1.75,
              }}
            >
              We established Maison with a singular objective: to bring
              exceptional, authenticated products to every corner of Bangladesh
              — eliminating friction, uncertainty, and unnecessary delays.
            </p>
          </ScrollReveal>
        </div>
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
            Complimentary Cash on Delivery, ensuring you settle payment only
            upon arrival. Precision-tracked shipping, so you are always
            informed. And dedicated, real human support whenever you reach out.
            This is our foundational model.
          </p>

          <p
            className="leading-relaxed text-lg"
            style={{
              fontFamily: "var(--font-fraunces), Georgia, serif",
              color: T.inkSoft,
              lineHeight: 1.8,
            }}
          >
            Today, we dispatch to all 64 districts, serving a growing community
            of over 10,000 satisfied patrons. Tomorrow, we are engineering the
            infrastructure that empowers any Bangladeshi artisan to operate
            with the same speed, reliability, and elegance.
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
              <span
                className="h-px w-8"
                style={{ background: T.gold, opacity: 0.5 }}
              />
              <p
                className="text-[9px] tracking-[0.4em] uppercase"
                style={{
                  color: T.gold,
                  fontFamily: "var(--font-fraunces), Georgia, serif",
                }}
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

          <StaggerReveal
            stagger={0.1}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
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
                  <value.icon
                    className="w-5 h-5 transition-colors duration-500"
                    strokeWidth={1.5}
                    style={{ color: T.gold }}
                  />
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
            <span
              className="h-px w-8"
              style={{ background: T.gold, opacity: 0.5 }}
            />
            <p
              className="text-[9px] tracking-[0.4em] uppercase"
              style={{
                color: T.gold,
                fontFamily: "var(--font-fraunces), Georgia, serif",
              }}
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
            style={{
              background: `linear-gradient(180deg, ${T.gold}40, ${T.gold}10)`,
            }}
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
                    <div
                      className="w-2 h-2 rounded-sm"
                      style={{ background: T.gold }}
                    />
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
                <span
                  className="italic font-light"
                  style={{ color: T.goldBright }}
                >
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
                Discover our curated collections. Complimentary nationwide
                delivery and seamless Cash on Delivery for every acquisition.
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
                  <path
                    d="M1 5 H13 M9 1 L13 5 L9 9"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}