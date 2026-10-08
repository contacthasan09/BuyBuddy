"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer, viewportOnce, EASE } from "@/lib/motion";

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

interface Spec {
  key: string;
  value: string;
}

export function SpecTable({ specs }: { specs: Spec[] }) {
  if (!specs || specs.length === 0) return null;

  return (
    <motion.div
      variants={staggerContainer(0.06)}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <span className="h-px w-8" style={{ background: T.gold, opacity: 0.5 }} />
        <h3
          className="text-[9px] tracking-[0.4em] uppercase"
          style={{ color: T.gold, fontFamily: "var(--font-fraunces), Georgia, serif" }}
        >
          Specifications
        </h3>
      </div>

      {/* Table Container */}
      <div
        className="relative rounded-sm overflow-hidden"
        style={{
          background: T.bone,
          border: `1px solid ${T.gold}30`,
          boxShadow: `0 1px 0 ${T.gold}20`,
        }}
      >
        {/* Inner gold hairline */}
        <div
          className="absolute inset-1.5 pointer-events-none rounded-sm"
          style={{ border: `0.5px solid ${T.gold}`, opacity: 0.2 }}
          aria-hidden
        />

        {/* Rows */}
        <div className="relative z-10 divide-y">
          {specs.map((spec, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="grid grid-cols-1 sm:grid-cols-3 px-5 py-4 sm:px-6 sm:py-4.5 transition-colors duration-300"
              style={{
                background: i % 2 === 0 ? "transparent" : `${T.gold}05`,
                borderColor: `${T.gold}20`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `${T.gold}10`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = i % 2 === 0 ? "transparent" : `${T.gold}05`;
              }}
            >
              {/* Key */}
              <span
                className="text-[10px] tracking-[0.25em] uppercase font-medium sm:pr-4"
                style={{ color: T.inkSoft, fontFamily: "var(--font-fraunces), Georgia, serif" }}
              >
                {spec.key}
              </span>
              
              {/* Value */}
              <span
                className="mt-1 sm:mt-0 text-[14px] leading-relaxed sm:col-span-2"
                style={{ color: T.ink, fontFamily: "var(--font-fraunces), Georgia, serif" }}
              >
                {spec.value}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}