"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { fadeUp, staggerContainer, EASE, viewportOnce } from "@/lib/motion";

interface StaticPageProps {
  eyebrow: string;
  title: string;
  titleAccent?: string;
  subtitle?: string;
  children: ReactNode;
}

export function StaticPage({
  eyebrow,
  title,
  titleAccent,
  subtitle,
  children,
}: StaticPageProps) {
  return (
    <div className="bg-white min-h-screen">
      {/* ── Cinematic header ── */}
      <section
        className="border-b border-gray-100"
        style={{
          background:
            "radial-gradient(60% 100% at 50% 0%, rgba(62,200,228,0.06), transparent 60%), #ffffff",
        }}
      >
        <div className="container-x py-14 md:py-20 max-w-4xl">
          <motion.div
            variants={staggerContainer(0.08)}
            initial="hidden"
            animate="visible"
          >
            <motion.p
              variants={fadeUp}
              className="text-[11px] tracking-[0.25em] uppercase text-gray-500 mb-4"
              style={{
                fontFamily: "var(--font-instrument), system-ui, sans-serif",
              }}
            >
              {eyebrow}
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="text-gray-900"
              style={{
                fontFamily: "var(--font-instrument), system-ui, sans-serif",
                fontSize: "clamp(32px, 4.5vw, 60px)",
                fontWeight: 500,
                letterSpacing: "-0.03em",
                lineHeight: "1.02",
              }}
            >
              {title}{" "}
              {titleAccent && (
                <span className="serif-italic">{titleAccent}</span>
              )}
            </motion.h1>
            {subtitle && (
              <motion.p
                variants={fadeUp}
                className="text-gray-500 mt-5 max-w-2xl"
                style={{
                  fontFamily: "var(--font-instrument), system-ui, sans-serif",
                  fontSize: "15px",
                  lineHeight: "1.6",
                }}
              >
                {subtitle}
              </motion.p>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="container-x py-14 md:py-20 max-w-3xl">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="prose-ltx"
          style={{
            fontFamily: "var(--font-instrument), system-ui, sans-serif",
            fontSize: "15px",
            lineHeight: "1.75",
            color: "#374151",
          }}
        >
          {children}
        </motion.div>
      </section>
    </div>
  );
}

/* Styled block components for content */
export function H2({ children }: { children: ReactNode }) {
  return (
    <h2
      className="text-gray-900 mt-10 mb-4"
      style={{
        fontFamily: "var(--font-instrument), system-ui, sans-serif",
        fontSize: "22px",
        fontWeight: 600,
        letterSpacing: "-0.02em",
      }}
    >
      {children}
    </h2>
  );
}

export function P({ children }: { children: ReactNode }) {
  return <p className="mb-4 leading-relaxed">{children}</p>;
}

export function UL({ children }: { children: ReactNode }) {
  return (
    <ul className="space-y-2 mb-4 list-none">
      {children}
    </ul>
  );
}

export function LI({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 flex-shrink-0" />
      <span className="flex-1">{children}</span>
    </li>
  );
}