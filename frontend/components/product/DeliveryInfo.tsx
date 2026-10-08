"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Truck, MapPin, ShieldCheck } from "lucide-react";
import { BD_DISTRICTS, DEFAULT_DELIVERY_CHARGES } from "@/lib/constants";
import { formatBDT } from "@/lib/utils";
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

const DHAKA_METRO = ["Dhaka", "Gazipur", "Narayanganj"];

function estimateDays(district: string): string {
  if (DHAKA_METRO.includes(district)) return "1–2 days";
  if (["Chattogram", "Sylhet", "Khulna", "Rajshahi"].includes(district)) {
    return "2–3 days";
  }
  return "3–4 days";
}

export function DeliveryInfo() {
  const [district, setDistrict] = useState("Dhaka");

  const charge =
    DEFAULT_DELIVERY_CHARGES[district] ??
    DEFAULT_DELIVERY_CHARGES._default ??
    130;
  const days = estimateDays(district);

  return (
    <div
      className="p-5 rounded-sm relative overflow-hidden"
      style={{
        background: T.bone,
        border: `1px solid ${T.gold}40`,
        boxShadow: `0 1px 0 ${T.gold}20, 0 12px 24px -12px rgba(28,22,18,0.15)`,
      }}
    >
      {/* Subtle corner ornament */}
      <div
        className="absolute top-0 right-0 w-8 h-8 pointer-events-none"
        style={{
          borderBottom: `1px solid ${T.gold}30`,
          borderLeft: `1px solid ${T.gold}30`,
        }}
        aria-hidden
      />

      {/* Header */}
      <div className="flex items-center gap-2.5 mb-5">
        <div
          className="w-8 h-8 rounded-sm flex items-center justify-center"
          style={{ background: `${T.gold}15`, border: `1px solid ${T.gold}30` }}
        >
          <Truck className="w-4 h-4" strokeWidth={1.5} style={{ color: T.gold }} />
        </div>
        <div className="flex flex-col">
          <span
            className="text-[10px] tracking-[0.3em] uppercase font-medium"
            style={{ color: T.ink, fontFamily: "var(--font-fraunces), Georgia, serif" }}
          >
            Delivery & Allocation
          </span>
          <span
            className="text-[9px] tracking-[0.2em] uppercase"
            style={{ color: T.inkSoft, fontFamily: "var(--font-fraunces), Georgia, serif" }}
          >
            Nationwide coverage
          </span>
        </div>
      </div>

      {/* District Selector */}
      <div className="flex items-center gap-3 mb-4">
        <MapPin
          className="w-4 h-4 flex-shrink-0"
          strokeWidth={1.5}
          style={{ color: T.inkSoft }}
        />
        <div className="relative flex-1">
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full appearance-none px-3 py-2.5 rounded-sm outline-none cursor-pointer transition-all duration-300"
            style={{
              color: T.ink,
              fontFamily: "var(--font-fraunces), Georgia, serif",
              fontSize: "13px",
              letterSpacing: "0.05em",
              background: "transparent",
              border: `1px solid ${T.gold}50`,
            }}
            onFocus={(e) => {
              e.target.style.borderColor = T.gold;
              e.target.style.boxShadow = `0 0 0 2px ${T.gold}20`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = `${T.gold}50`;
              e.target.style.boxShadow = "none";
            }}
          >
            {BD_DISTRICTS.map((d) => (
              <option key={d} value={d} className="bg-white text-gray-900 py-1">
                {d}
              </option>
            ))}
          </select>
          {/* Custom chevron */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
              <path d="M1 1 L5 5 L9 1" stroke={T.gold} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* Animated Details */}
      <div className="space-y-3 pt-3" style={{ borderTop: `1px dashed ${T.gold}30` }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`charge-${district}`}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.4, ease: EASE.expo }}
            className="flex items-center justify-between"
          >
            <span
              className="text-[10px] tracking-[0.25em] uppercase"
              style={{ color: T.inkSoft, fontFamily: "var(--font-fraunces), Georgia, serif" }}
            >
              Delivery charge
            </span>
            <span
              className="text-[14px] font-medium tabular-nums"
              style={{ color: T.ink, fontFamily: "var(--font-fraunces), Georgia, serif" }}
            >
              {formatBDT(charge)}
            </span>
          </motion.div>

          <motion.div
            key={`time-${district}`}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.4, delay: 0.05, ease: EASE.expo }}
            className="flex items-center justify-between"
          >
            <span
              className="text-[10px] tracking-[0.25em] uppercase"
              style={{ color: T.inkSoft, fontFamily: "var(--font-fraunces), Georgia, serif" }}
            >
              Estimated arrival
            </span>
            <span
              className="text-[13px] font-medium tabular-nums flex items-center gap-1.5"
              style={{ color: T.wine, fontFamily: "var(--font-fraunces), Georgia, serif" }}
            >
              {days}
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: T.wine }}
              />
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Note */}
      <div
        className="mt-5 pt-3 flex items-start gap-2"
        style={{ borderTop: `1px solid ${T.gold}20` }}
      >
        <ShieldCheck
          className="w-3.5 h-3.5 flex-shrink-0 mt-0.5"
          strokeWidth={1.5}
          style={{ color: T.gold }}
        />
        <p
          className="text-[10px] leading-relaxed tracking-[0.15em] uppercase"
          style={{ color: T.inkSoft, fontFamily: "var(--font-fraunces), Georgia, serif" }}
        >
          Cash on Delivery — settle payment securely upon arrival.
        </p>
      </div>
    </div>
  );
}