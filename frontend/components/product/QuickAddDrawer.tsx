"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
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

interface QuickAddToastProps {
  show: boolean;
  productName: string;
}

export function QuickAddToast({ show, productName }: QuickAddToastProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: 16, scale: 0.98, filter: "blur(4px)" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] flex items-center gap-3 px-5 py-3.5 rounded-sm max-w-[90vw]"
          style={{
            background: T.bone,
            border: `1px solid ${T.gold}50`,
            boxShadow: `0 1px 0 ${T.gold}30, 0 20px 40px -12px rgba(28,22,18,0.35)`,
            backdropFilter: "blur(16px) saturate(140%)",
          }}
        >
          {/* Check indicator */}
          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.34, 1.56, 0.64, 1] }}
            className="w-7 h-7 rounded-sm flex items-center justify-center flex-shrink-0"
            style={{
              background: `${T.wine}15`,
              border: `1px solid ${T.wine}40`,
            }}
          >
            <Check
              className="w-3.5 h-3.5"
              strokeWidth={2}
              style={{ color: T.wine }}
            />
          </motion.div>

          {/* Text */}
          <div className="flex items-baseline gap-2 min-w-0">
            <span
              className="text-[12px] font-medium truncate"
              style={{
                color: T.ink,
                fontFamily: "var(--font-fraunces), Georgia, serif",
              }}
            >
              {productName}
            </span>
            <span
              className="text-[10px] tracking-[0.2em] uppercase whitespace-nowrap"
              style={{
                color: T.inkSoft,
                fontFamily: "var(--font-fraunces), Georgia, serif",
              }}
            >
              added to cart
            </span>
          </div>

          {/* Gold accent line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE.expo }}
            className="absolute bottom-0 left-0 right-0 h-px origin-left"
            style={{
              background: `linear-gradient(90deg, transparent, ${T.gold}, transparent)`,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}