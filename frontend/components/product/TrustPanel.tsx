"use client";

import { Truck, Shield, RotateCcw, Banknote } from "lucide-react";
import { motion } from "framer-motion";
import { fadeUp, staggerFast, viewportOnce, EASE } from "@/lib/motion";

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

const TRUST = [
  {
    icon: Banknote,
    title: "Cash on Delivery",
    sub: "Pay upon arrival",
  },
  { 
    icon: Truck, 
    title: "Expedited Delivery", 
    sub: "2–4 days nationwide" 
  },
  { 
    icon: Shield, 
    title: "Quality Assured", 
    sub: "Authenticated pieces" 
  },
  { 
    icon: RotateCcw, 
    title: "7-Day Returns", 
    sub: "Seamless exchanges" 
  },
];

export function TrustPanel() {
  return (
    <motion.div
      variants={staggerFast}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className="grid grid-cols-2 gap-x-4 gap-y-6 pt-6"
      style={{ borderTop: `1px dashed ${T.gold}30` }}
    >
      {TRUST.map((item, i) => (
        <motion.div
          key={item.title}
          variants={fadeUp}
          className="flex items-start gap-3 group"
        >
          {/* Icon Container */}
          <div
            className="w-9 h-9 rounded-sm flex items-center justify-center flex-shrink-0 transition-all duration-300"
            style={{
              background: T.bg,
              border: `1px solid ${T.gold}30`,
            }}
          >
            <item.icon
              className="w-4 h-4 transition-colors duration-300"
              strokeWidth={1.5}
              style={{ color: T.gold }}
            />
          </div>

          {/* Text */}
          <div className="min-w-0 pt-0.5">
            <p
              className="text-[12px] font-medium leading-snug mb-0.5 transition-colors duration-300 group-hover:text-[color:var(--gold)]"
              style={{
                color: T.ink,
                fontFamily: "var(--font-fraunces), Georgia, serif",
              }}
            >
              {item.title}
            </p>
            <p
              className="text-[10px] tracking-[0.2em] uppercase"
              style={{ 
                color: T.inkSoft, 
                fontFamily: "var(--font-fraunces), Georgia, serif" 
              }}
            >
              {item.sub}
            </p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}