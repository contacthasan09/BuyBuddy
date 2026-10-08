"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";
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

interface StockUrgencyProps {
  stock: number;
  lowThreshold?: number;
  criticalThreshold?: number;
}

export function StockUrgency({
  stock,
  lowThreshold = 15,
  criticalThreshold = 5,
}: StockUrgencyProps) {
  if (stock <= 0) return null;
  if (stock > lowThreshold) return null;

  const isCritical = stock <= criticalThreshold;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.5, ease: EASE.expo }}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-sm"
      style={{
        background: isCritical ? `${T.wine}10` : `${T.gold}10`,
        border: `1px solid ${isCritical ? `${T.wine}30` : `${T.gold}30`}`,
      }}
    >
      <motion.div
        animate={{ 
          scale: isCritical ? [1, 1.08, 1] : [1, 1.04, 1],
        }}
        transition={{ 
          duration: isCritical ? 1.5 : 2.5, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      >
        <Flame
          className="w-3.5 h-3.5"
          strokeWidth={1.5}
          style={{ 
            color: isCritical ? T.wine : T.gold,
            fill: isCritical ? `${T.wine}20` : `${T.gold}20`
          }}
        />
      </motion.div>
      <span
        className="text-[9px] tracking-[0.25em] uppercase font-medium"
        style={{
          color: isCritical ? T.wine : T.inkSoft,
          fontFamily: "var(--font-fraunces), Georgia, serif",
        }}
      >
        {isCritical ? `Only ${stock} remaining` : `Limited: ${stock} left`}
      </span>
    </motion.div>
  );
}