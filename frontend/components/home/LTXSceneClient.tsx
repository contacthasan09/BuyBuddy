"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

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

/* ——————————————————————————————————————————————
   SVG noise — organic paper grain
—————————————————————————————————————————————— */
function Grain() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07] mix-blend-soft-light"
    >
      <filter id="grain-loader">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.7 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain-loader)" />
    </svg>
  );
}

/* ——————————————————————————————————————————————
   Elegant Loading Placeholder
—————————————————————————————————————————————— */
function ElegantLoader() {
  return (
    <div
      className="relative w-full flex flex-col items-center justify-center"
      style={{
        height: "70vh",
        minHeight: 560,
        background: `radial-gradient(60% 100% at 50% 0%, ${T.goldBright}20, transparent 60%), ${T.bone}`,
      }}
    >
      <Grain />
      
      {/* Refined, slow-spinning gold ring */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-10 h-10 flex items-center justify-center"
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            border: `1px solid ${T.gold}30`,
          }}
        />
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            borderTop: `1.5px solid ${T.gold}`,
            borderRight: `1.5px solid transparent`,
            borderBottom: `1.5px solid transparent`,
            borderLeft: `1.5px solid transparent`,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Subtle inner pulse */}
        <motion.div
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: T.goldBright }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mt-6 text-[10px] tracking-[0.35em] uppercase"
        style={{ color: T.inkSoft, fontFamily: "var(--font-fraunces), Georgia, serif" }}
      >
        Preparing the gallery
      </motion.p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Dynamically import LTXScene with SSR disabled.
   This prevents any hydration mismatch — the component
   only renders on the client, after mount.
   ═══════════════════════════════════════════════════════ */
const LTXScene = dynamic(() => import("./LTXScene"), {
  ssr: false,
  loading: () => <ElegantLoader />,
});

export default function LTXSceneClient() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Before mount — render the elegant placeholder
  if (!mounted) {
    return <ElegantLoader />;
  }

  return <LTXScene />;
}