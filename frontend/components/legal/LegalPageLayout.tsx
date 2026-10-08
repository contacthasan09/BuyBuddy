"use client";

import { ReactNode, useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EASE } from "@/lib/motion";

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

interface TocItem {
  id: string;
  label: string;
}

interface LegalPageLayoutProps {
  eyebrow: string;
  title: string;
  titleAccent?: string;
  lastUpdated: string;
  toc: TocItem[];
  children: ReactNode;
}

export function LegalPageLayout({
  eyebrow,
  title,
  titleAccent,
  lastUpdated,
  toc,
  children,
}: LegalPageLayoutProps) {
  const [activeSection, setActiveSection] = useState<string>(toc[0]?.id || "");

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 300,
    damping: 40,
    restDelta: 0.001,
  });

  // Track active section via IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    toc.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [toc]);

  return (
    <div className="relative min-h-screen" style={{ background: T.bg, color: T.ink }}>
      {/* Subtle organic grain overlay */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.06] mix-blend-multiply"
      >
        <filter id="grain-legal">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-legal)" />
      </svg>

      {/* Progress bar */}
      <motion.div
        style={{
          scaleX: progress,
          transformOrigin: "0%",
          background: `linear-gradient(90deg, transparent, ${T.gold}, ${T.goldBright}, ${T.gold}, transparent)`,
        }}
        className="fixed top-0 left-0 right-0 h-[2px] z-[100]"
      />

      {/* Header */}
      <section className="relative border-b" style={{ borderColor: `${T.gold}30` }}>
        <div className="container-x py-16 md:py-24 max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, ease: EASE.expo }}
          >
            <Link
              href="/"
              className="group inline-flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase mb-8 transition-colors duration-300"
              style={{ color: T.inkSoft, fontFamily: "var(--font-fraunces), Georgia, serif" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = T.gold)}
              onMouseLeave={(e) => (e.currentTarget.style.color = T.inkSoft)}
            >
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform duration-300" strokeWidth={1.5} />
              Return to Maison
            </Link>

            <div className="flex items-center gap-3 mb-5">
              <span className="h-px w-8" style={{ background: T.gold, opacity: 0.5 }} />
              <p
                className="text-[9px] tracking-[0.4em] uppercase"
                style={{ color: T.gold, fontFamily: "var(--font-fraunces), Georgia, serif" }}
              >
                {eyebrow}
              </p>
            </div>

            <h1
              className="mb-5 leading-[0.92] tracking-[-0.03em]"
              style={{
                fontFamily: "var(--font-fraunces), Georgia, serif",
                fontSize: "clamp(36px, 5vw, 64px)",
                fontWeight: 400,
                color: T.ink,
              }}
            >
              {title}{" "}
              {titleAccent && (
                <span className="italic font-light" style={{ color: T.wine }}>
                  {titleAccent}
                </span>
              )}
            </h1>

            <p
              className="text-[12px] tracking-[0.15em] uppercase"
              style={{ color: T.inkSoft, fontFamily: "var(--font-fraunces), Georgia, serif" }}
            >
              Last updated: {lastUpdated}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content + TOC */}
      <section className="container-x py-16 md:py-24 max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-[240px_1fr] gap-12 lg:gap-16">
          {/* Sticky TOC */}
          <aside className="hidden lg:block lg:sticky lg:top-24 h-fit">
            <p
              className="text-[9px] tracking-[0.4em] uppercase mb-5"
              style={{ color: T.gold, fontFamily: "var(--font-fraunces), Georgia, serif" }}
            >
              Contents
            </p>
            <nav className="space-y-1 border-l" style={{ borderColor: `${T.gold}25` }}>
              {toc.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`block pl-4 py-2 text-[10px] tracking-[0.25em] uppercase transition-all duration-300 relative`}
                    style={{
                      fontFamily: "var(--font-fraunces), Georgia, serif",
                      color: isActive ? T.gold : T.inkSoft,
                      borderLeft: isActive ? `2px solid ${T.gold}` : "2px solid transparent",
                      marginLeft: isActive ? "-2px" : "0",
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.getElementById(item.id);
                      if (el) {
                        const top = el.getBoundingClientRect().top + window.scrollY - 100;
                        window.scrollTo({ top, behavior: "smooth" });
                      }
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.color = T.ink;
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.color = T.inkSoft;
                    }}
                  >
                    {item.label}
                  </a>
                );
              })}
            </nav>
          </aside>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE.expo }}
            className="max-w-none"
            style={{
              fontFamily: "var(--font-fraunces), Georgia, serif",
              fontSize: "15px",
              lineHeight: "1.8",
              color: T.inkSoft,
            }}
          >
            {children}
          </motion.div>
        </div>
      </section>
    </div>
  );
}

/* ——————————————————————————————————————————————
   Reusable content primitives for legal pages
—————————————————————————————————————————————— */

export function LegalH2({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2
      id={id}
      className="mt-14 mb-5 scroll-mt-24"
      style={{
        fontFamily: "var(--font-fraunces), Georgia, serif",
        fontSize: "clamp(22px, 2.8vw, 28px)",
        fontWeight: 500,
        letterSpacing: "-0.02em",
        color: "var(--ink, #1C1612)",
      }}
    >
      {children}
    </h2>
  );
}

export function LegalP({ children }: { children: ReactNode }) {
  return <p className="mb-6 leading-relaxed">{children}</p>;
}

export function LegalUL({ children }: { children: ReactNode }) {
  return <ul className="space-y-3 mb-6 list-none">{children}</ul>;
}

export function LegalLI({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span 
        className="w-1.5 h-1.5 rounded-sm mt-2 flex-shrink-0" 
        style={{ background: "var(--gold, #B8935A)" }} 
      />
      <span className="flex-1">{children}</span>
    </li>
  );
}

export function LegalCallout({
  children,
  tone = "info",
}: {
  children: ReactNode;
  tone?: "info" | "warning";
}) {
  const isWarning = tone === "warning";
  return (
    <div 
      className="p-5 rounded-sm mb-8 text-[14px] leading-relaxed"
      style={{
        background: isWarning ? "rgba(90, 26, 31, 0.06)" : "rgba(184, 147, 90, 0.08)",
        border: `1px solid ${isWarning ? "rgba(90, 26, 31, 0.25)" : "rgba(184, 147, 90, 0.3)"}`,
        color: "var(--ink, #1C1612)",
      }}
    >
      {children}
    </div>
  );
}