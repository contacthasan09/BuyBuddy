"use client";

import { motion } from "framer-motion";
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

interface CategoryChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

export function CategoryChip({ label, active, onClick }: CategoryChipProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.96 }}
      className="relative flex-shrink-0 px-4 py-2 rounded-sm transition-colors duration-300"
      style={{
        fontFamily: "var(--font-fraunces), Georgia, serif",
        fontSize: "10px",
        letterSpacing: "0.25em",
        textTransform: "uppercase",
        fontWeight: 500,
        color: active ? T.goldLeaf : T.inkSoft,
        background: active ? T.ink : "transparent",
        border: `1px solid ${active ? T.gold : `${T.gold}40`}`,
      }}
    >
      {/* Sliding gradient overlay for active state */}
      {active && (
        <motion.span
          layoutId="category-active-bg"
          className="absolute inset-0 rounded-sm -z-10"
          style={{
            background: `linear-gradient(135deg, ${T.gold}25, transparent)`,
          }}
          transition={{ duration: 0.4, ease: EASE.expo }}
        />
      )}
      
      <span className="relative z-10 flex items-center gap-2">
        {label}
        {/* Premium active indicator dot */}
        {active && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.05, ease: EASE.expo }}
            className="w-1 h-1 rounded-full"
            style={{ background: T.goldBright }}
          />
        )}
      </span>
    </motion.button>
  );
}