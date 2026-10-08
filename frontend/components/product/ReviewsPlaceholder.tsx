"use client";

import { motion } from "framer-motion";
import { Star, MessageSquare } from "lucide-react";
import { fadeUp, viewportOnce, EASE } from "@/lib/motion";

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

export function ReviewsPlaceholder() {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className="relative py-12 md:py-16 text-center overflow-hidden"
      style={{
        background: T.bone,
        border: `1px solid ${T.gold}30`,
        borderRadius: "4px",
        boxShadow: `0 1px 0 ${T.gold}20, 0 16px 32px -16px rgba(28,22,18,0.15)`,
      }}
    >
      {/* Inner gold hairline */}
      <div
        className="absolute inset-2 pointer-events-none"
        style={{ border: `0.5px solid ${T.gold}`, opacity: 0.2, borderRadius: "2px" }}
        aria-hidden
      />

      {/* Corner ornaments */}
      {[
        { top: 8, left: 8, rotate: 0 },
        { top: 8, right: 8, rotate: 90 },
        { bottom: 8, right: 8, rotate: 180 },
        { bottom: 8, left: 8, rotate: 270 },
      ].map(({ rotate, ...position }, idx) => (
        <div
          key={idx}
          className="absolute w-3 h-3 pointer-events-none"
          style={{ ...position, transform: `rotate(${rotate}deg)` }}
          aria-hidden
        >
          <svg viewBox="0 0 12 12" fill="none">
            <path d="M0 0 L12 0 L12 12" stroke={T.gold} strokeWidth="0.7" opacity="0.5" />
            <circle cx="1" cy="1" r="0.7" fill={T.gold} opacity="0.7" />
          </svg>
        </div>
      ))}

      <div className="relative z-10 px-6">
        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE.expo }}
          className="w-14 h-14 mx-auto mb-6 rounded-sm flex items-center justify-center"
          style={{
            background: T.bg,
            border: `1px solid ${T.gold}40`,
          }}
        >
          <MessageSquare
            className="w-5 h-5"
            strokeWidth={1.5}
            style={{ color: T.gold }}
          />
        </motion.div>

        {/* Heading */}
        <motion.h3
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: EASE.expo }}
          className="mb-3 leading-[0.95] tracking-[-0.02em]"
          style={{
            color: T.ink,
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontSize: "clamp(20px, 2.5vw, 26px)",
            fontWeight: 400,
          }}
        >
          Awaiting <span className="italic font-light" style={{ color: T.wine }}>first reviews.</span>
        </motion.h3>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15, ease: EASE.expo }}
          className="text-[13px] leading-relaxed mb-6 max-w-sm mx-auto"
          style={{
            color: T.inkSoft,
            fontFamily: "var(--font-fraunces), Georgia, serif",
          }}
        >
          Be the first to share your experience. Reviews will be published once your order has been delivered and verified.
        </motion.p>

        {/* Empty Stars */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2, ease: EASE.expo }}
          className="inline-flex items-center gap-1"
        >
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              className="w-4 h-4"
              strokeWidth={1.2}
              style={{
                fill: "transparent",
                color: T.gold,
                opacity: 0.35,
              }}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}