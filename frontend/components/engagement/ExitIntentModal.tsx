"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift } from "lucide-react";
import { EASE } from "@/lib/motion";

/* ——————————————————————————————————————————————
   Palette — Maison edition
—————————————————————————————————————————————— */
const T = {
  bg: "#EFE7D4",
  ink: "#1C1612",
  inkDeep: "#0E0A07",
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
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07] mix-blend-soft-light"
    >
      <filter id="grain-exit">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.7 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain-exit)" />
    </svg>
  );
}

const STORAGE_KEY = "maison_exit_intent_shown_v1";

export function ExitIntentModal() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Skip on mobile
    if (window.matchMedia("(max-width: 768px)").matches) return;

    // Skip if already shown this session
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) return;
    } catch {}

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger when cursor moves to top of viewport
      if (e.clientY <= 0) {
        try {
          sessionStorage.setItem(STORAGE_KEY, "1");
        } catch {}
        setVisible(true);
        document.removeEventListener("mouseleave", handleMouseLeave);
      }
    };

    // Delay binding to avoid triggering on initial load
    const timer = setTimeout(() => {
      document.addEventListener("mouseleave", handleMouseLeave);
    }, 5000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setVisible(false)}
            className="fixed inset-0 z-[220] flex items-center justify-center p-4 md:p-8"
            style={{ background: `${T.inkDeep}E6` }}
            aria-hidden
          >
            <Grain />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background: `radial-gradient(circle at center, transparent 40%, ${T.inkDeep} 100%)`,
              }}
            />
          </motion.div>

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.96, y: 16, filter: "blur(8px)" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md z-[221] overflow-hidden rounded-sm"
            style={{
              background: T.bone,
              border: `1px solid ${T.gold}40`,
              boxShadow: `0 1px 0 ${T.gold}20, 0 40px 80px -20px rgba(28,22,18,0.5)`,
            }}
            role="dialog"
            aria-modal="true"
          >
            {/* Inner gold hairline */}
            <div
              className="absolute inset-1.5 pointer-events-none z-20 rounded-sm"
              style={{ border: `0.5px solid ${T.gold}`, opacity: 0.2 }}
              aria-hidden
            />

            {/* Corner ornaments */}
            {[
              { top: 6, left: 6, rotate: 0 },
              { top: 6, right: 6, rotate: 90 },
              { bottom: 6, right: 6, rotate: 180 },
              { bottom: 6, left: 6, rotate: 270 },
            ].map((pos, idx) => (
              <div
                key={idx}
                className="absolute z-20 w-3 h-3 pointer-events-none"
                style={{
                  top: pos.top,
                  right: pos.right,
                  bottom: pos.bottom,
                  left: pos.left,
                  transform: `rotate(${pos.rotate}deg)`,
                }}
                aria-hidden
              >
                <svg viewBox="0 0 12 12" fill="none">
                  <path d="M0 0 L12 0 L12 12" stroke={T.gold} strokeWidth="0.8" opacity="0.6" />
                  <circle cx="1" cy="1" r="0.8" fill={T.gold} opacity="0.8" />
                </svg>
              </div>
            ))}

            {/* Close Button */}
            <motion.button
              type="button"
              onClick={() => setVisible(false)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="absolute top-3 right-3 z-30 w-8 h-8 rounded-sm flex items-center justify-center transition-all duration-300"
              style={{
                border: `1px solid ${T.gold}30`,
                background: "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = T.gold;
                e.currentTarget.style.background = `${T.gold}15`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = `${T.gold}30`;
                e.currentTarget.style.background = "transparent";
              }}
              aria-label="Close modal"
            >
              <X className="w-3.5 h-3.5" strokeWidth={1.5} style={{ color: T.inkSoft }} />
            </motion.button>

            {/* Content */}
            <div className="relative z-10 p-8 md:p-10 text-center">
              {/* Icon */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5, ease: EASE.expo }}
                className="w-14 h-14 mx-auto mb-6 rounded-sm flex items-center justify-center"
                style={{
                  background: T.bg,
                  border: `1px solid ${T.gold}40`,
                }}
              >
                <Gift className="w-6 h-6" strokeWidth={1.5} style={{ color: T.gold }} />
              </motion.div>

              {/* Eyebrow */}
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.4 }}
                className="mb-3"
                style={{
                  color: T.gold,
                  fontFamily: "var(--font-fraunces), Georgia, serif",
                  fontSize: "9px",
                  letterSpacing: "0.4em",
                  textTransform: "uppercase",
                  fontWeight: 500,
                }}
              >
                A Parting Gift
              </motion.p>

              {/* Headline */}
              <motion.h2
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="mb-4 leading-[0.95] tracking-[-0.02em]"
                style={{
                  color: T.ink,
                  fontFamily: "var(--font-fraunces), Georgia, serif",
                  fontSize: "clamp(24px, 3vw, 32px)",
                  fontWeight: 400,
                }}
              >
                Enjoy <span className="italic font-light" style={{ color: T.wine }}>10% off</span> your first acquisition.
              </motion.h2>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.4 }}
                className="mb-8 max-w-xs mx-auto"
                style={{
                  color: T.inkSoft,
                  fontFamily: "var(--font-fraunces), Georgia, serif",
                  fontSize: "14px",
                  lineHeight: "1.6",
                }}
              >
                Join our private list for exclusive access to new collections and a singular discount code.
              </motion.p>

              {/* Form */}
              <motion.form
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                onSubmit={(e) => {
                  e.preventDefault();
                  setVisible(false);
                }}
                className="space-y-3"
              >
                <input
                  type="email"
                  placeholder="Your email address"
                  required
                  className="w-full h-12 px-4 rounded-sm outline-none transition-all duration-300"
                  style={{
                    color: T.ink,
                    fontFamily: "var(--font-fraunces), Georgia, serif",
                    fontSize: "14px",
                    background: "transparent",
                    border: `1px solid ${T.gold}40`,
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = T.gold;
                    e.target.style.boxShadow = `0 0 0 2px ${T.gold}20`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = `${T.gold}40`;
                    e.target.style.boxShadow = "none";
                  }}
                />
                <motion.button
                  type="submit"
                  whileHover={{ y: -1, boxShadow: `0 8px 20px -8px ${T.gold}60` }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full h-12 rounded-sm flex items-center justify-center gap-2 transition-all duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${T.goldBright}, ${T.gold})`,
                    color: T.ink,
                    fontFamily: "var(--font-fraunces), Georgia, serif",
                    fontSize: "11px",
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                    boxShadow: `0 4px 12px -4px ${T.gold}40`,
                  }}
                >
                  Send my code
                </motion.button>
              </motion.form>

              {/* Dismiss */}
              <motion.button
                type="button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                onClick={() => setVisible(false)}
                className="mt-6 text-[10px] tracking-[0.2em] uppercase transition-colors duration-300"
                style={{ color: T.inkSoft, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = T.wine)}
                onMouseLeave={(e) => (e.currentTarget.style.color = T.inkSoft)}
              >
                Continue without the offer
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}