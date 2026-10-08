"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus } from "lucide-react";

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

interface QuantitySelectorProps {
  value: number;
  max: number;
  onChange: (value: number) => void;
}

export function QuantitySelector({
  value,
  max,
  onChange,
}: QuantitySelectorProps) {
  const canDecrease = value > 1;
  const canIncrease = value < max;

  return (
    <div>
      <label
        className="block mb-3"
        style={{
          color: T.inkSoft,
          fontFamily: "var(--font-fraunces), Georgia, serif",
          fontSize: "9px",
          letterSpacing: "0.35em",
          textTransform: "uppercase",
          fontWeight: 500,
        }}
      >
        Quantity
      </label>

      <div
        className="inline-flex items-center rounded-sm overflow-hidden"
        style={{
          border: `1px solid ${T.gold}40`,
          background: T.bone,
          boxShadow: `0 1px 0 ${T.gold}20`,
        }}
      >
        {/* Decrease */}
        <motion.button
          type="button"
          onClick={() => canDecrease && onChange(value - 1)}
          whileTap={canDecrease ? { scale: 0.92 } : undefined}
          disabled={!canDecrease}
          className="w-11 h-11 flex items-center justify-center transition-all duration-300 disabled:cursor-not-allowed"
          style={{
            color: canDecrease ? T.ink : T.inkSoft,
            opacity: canDecrease ? 1 : 0.35,
            borderRight: `1px solid ${T.gold}25`,
          }}
          onMouseEnter={(e) => {
            if (canDecrease) e.currentTarget.style.background = `${T.gold}10`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
          aria-label="Decrease quantity"
        >
          <Minus className="w-3.5 h-3.5" strokeWidth={1.5} />
        </motion.button>

        {/* Value */}
        <div className="w-14 h-11 flex items-center justify-center relative overflow-hidden">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={value}
              initial={{ y: -12, opacity: 0, filter: "blur(4px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              exit={{ y: 12, opacity: 0, filter: "blur(4px)" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="absolute tabular-nums font-medium"
              style={{
                color: T.ink,
                fontFamily: "var(--font-fraunces), Georgia, serif",
                fontSize: "15px",
              }}
            >
              {value}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Increase */}
        <motion.button
          type="button"
          onClick={() => canIncrease && onChange(value + 1)}
          whileTap={canIncrease ? { scale: 0.92 } : undefined}
          disabled={!canIncrease}
          className="w-11 h-11 flex items-center justify-center transition-all duration-300 disabled:cursor-not-allowed"
          style={{
            color: canIncrease ? T.ink : T.inkSoft,
            opacity: canIncrease ? 1 : 0.35,
            borderLeft: `1px solid ${T.gold}25`,
          }}
          onMouseEnter={(e) => {
            if (canIncrease) e.currentTarget.style.background = `${T.gold}10`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
          aria-label="Increase quantity"
        >
          <Plus className="w-3.5 h-3.5" strokeWidth={1.5} />
        </motion.button>
      </div>

      {/* Max warning */}
      {max <= 10 && value >= max && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2.5 flex items-center gap-1.5"
        >
          <span className="h-px w-3" style={{ background: T.gold, opacity: 0.6 }} />
          <span
            className="text-[9px] tracking-[0.25em] uppercase"
            style={{ color: T.wine, fontFamily: "var(--font-fraunces), Georgia, serif" }}
          >
            Max available: {max}
          </span>
        </motion.p>
      )}
    </div>
  );
}