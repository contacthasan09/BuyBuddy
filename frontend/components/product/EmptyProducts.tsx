"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Package } from "lucide-react";
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

interface EmptyProductsProps {
  search?: string;
  category?: string;
}

export function EmptyProducts({ search, category }: EmptyProductsProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative py-20 md:py-28 max-w-lg mx-auto text-center"
    >
      {/* Ornamental top fleuron */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: EASE.expo }}
        className="flex justify-center mb-8"
      >
        <svg viewBox="0 0 120 14" className="w-32 h-3.5" fill="none" aria-hidden>
          <path d="M0 7 H50" stroke={T.gold} strokeOpacity="0.5" strokeWidth="0.6" />
          <path d="M70 7 H120" stroke={T.gold} strokeOpacity="0.5" strokeWidth="0.6" />
          <g transform="translate(60 7)">
            <path
              d="M0 -4 C2 -4 3 -2 3 0 C3 2 2 4 0 4 C-2 4 -3 2 -3 0 C-3 -2 -2 -4 0 -4 Z"
              fill={T.gold}
              fillOpacity="0.85"
            />
            <circle r="1" fill={T.bone} />
            <path d="M-8 0 L-5 0 M5 0 L8 0" stroke={T.gold} strokeOpacity="0.7" strokeWidth="0.6" />
          </g>
        </svg>
      </motion.div>

      {/* Icon container */}
      <motion.div
        initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.7, delay: 0.1, ease: EASE.expo }}
        className="relative mx-auto mb-8 w-20 h-20 rounded-sm flex items-center justify-center"
        style={{
          background: T.bone,
          border: `1px solid ${T.gold}40`,
          boxShadow: `0 1px 0 ${T.gold}20, 0 16px 32px -12px rgba(28,22,18,0.2)`,
        }}
      >
        {/* Inner gold hairline */}
        <div
          className="absolute inset-1.5 rounded-sm pointer-events-none"
          style={{ border: `0.5px solid ${T.gold}`, opacity: 0.25 }}
          aria-hidden
        />
        
        {/* Corner ornaments */}
        {[
          { top: 4, left: 4, rotate: 0 },
          { top: 4, right: 4, rotate: 90 },
          { bottom: 4, right: 4, rotate: 180 },
          { bottom: 4, left: 4, rotate: 270 },
        ].map((pos, idx) => (
          <div
            key={idx}
            className="absolute w-2 h-2 pointer-events-none"
            style={{
              top: pos.top,
              right: pos.right,
              bottom: pos.bottom,
              left: pos.left,
              transform: `rotate(${pos.rotate}deg)`,
            }}
            aria-hidden
          >
            <svg viewBox="0 0 8 8" fill="none">
              <path d="M0 0 L8 0 L8 8" stroke={T.gold} strokeWidth="0.6" opacity="0.5" />
              <circle cx="0.6" cy="0.6" r="0.5" fill={T.gold} opacity="0.7" />
            </svg>
          </div>
        ))}

        <motion.div
          animate={{ 
            y: [0, -3, 0],
            rotate: [0, -2, 2, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Package className="w-7 h-7" strokeWidth={1.3} style={{ color: T.gold }} />
        </motion.div>
      </motion.div>

      {/* Headline */}
      <motion.h2
        initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.7, delay: 0.2, ease: EASE.expo }}
        className="text-[32px] md:text-[40px] leading-[0.95] tracking-[-0.02em] mb-4"
        style={{
          fontFamily: "var(--font-fraunces), Georgia, serif",
          fontWeight: 400,
          color: T.ink,
        }}
      >
        <span className="italic font-light">No pieces</span>
        <span className="mx-2" style={{ color: T.gold }}>
          ❖
        </span>
        <span className="relative">
          found
          <motion.span
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(110deg, transparent 30%, ${T.goldBright} 50%, transparent 70%)`,
              backgroundSize: "200% 100%",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
          >
            found
          </motion.span>
        </span>
      </motion.h2>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: EASE.expo }}
        className="text-[13px] leading-relaxed mb-10 max-w-sm mx-auto"
        style={{
          color: T.inkSoft,
          fontFamily: "var(--font-fraunces), Georgia, serif",
        }}
      >
        {search
          ? `We couldn't locate any pieces matching "${search}". Perhaps explore our full collection?`
          : "This allocation is currently unavailable. Our curators are preparing new arrivals."}
      </motion.p>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4, ease: EASE.expo }}
      >
        <Link
          href="/products"
          className="group inline-flex items-center gap-3 px-8 py-4 rounded-sm transition-all duration-300"
          style={{
            background: T.ink,
            border: `1px solid ${T.gold}60`,
            color: T.goldLeaf,
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontSize: "11px",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            fontWeight: 500,
          }}
        >
          <span className="relative">
            Browse collection
            <span
              className="absolute bottom-0 left-0 w-0 group-hover:w-full h-px transition-all duration-500 ease-out"
              style={{ background: T.gold }}
            />
          </span>
          <motion.svg
            width="14"
            height="10"
            viewBox="0 0 14 10"
            fill="none"
            className="group-hover:translate-x-1 transition-transform duration-300"
            aria-hidden
          >
            <path d="M1 5 H13 M9 1 L13 5 L9 9" stroke="currentColor" strokeWidth="1" />
          </motion.svg>
        </Link>
      </motion.div>

      {/* Ornamental bottom fleuron */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.5, ease: EASE.expo }}
        className="flex justify-center mt-12"
      >
        <svg viewBox="0 0 120 14" className="w-24 h-3" fill="none" aria-hidden>
          <path d="M0 7 H50" stroke={T.gold} strokeOpacity="0.4" strokeWidth="0.6" />
          <path d="M70 7 H120" stroke={T.gold} strokeOpacity="0.4" strokeWidth="0.6" />
          <g transform="translate(60 7)">
            <path
              d="M0 -3 C1.5 -3 2 -1.5 2 0 C2 1.5 1.5 3 0 3 C-1.5 3 -2 1.5 -2 0 C-2 -1.5 -1.5 -3 0 -3 Z"
              fill={T.gold}
              fillOpacity="0.7"
            />
            <circle r="0.8" fill={T.bone} />
          </g>
        </svg>
      </motion.div>
    </motion.div>
  );
}