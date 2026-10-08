"use client";

import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCartDrawer } from "@/store/cart-drawer";
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

export function EmptyCartState() {
  const close = useCartDrawer((s) => s.close);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.6, ease: EASE.expo }}
      className="flex flex-col items-center justify-center h-full px-6 text-center relative z-10"
    >
      <div className="relative mb-8">
        <div 
          className="w-20 h-20 rounded-sm flex items-center justify-center"
          style={{ background: T.bone, border: `1px solid ${T.gold}30` }}
        >
          <ShoppingBag className="w-8 h-8" strokeWidth={1.5} style={{ color: T.gold }} />
        </div>
        {/* Subtle gold pulse ring */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 rounded-sm"
          style={{ border: `1px solid ${T.gold}30` }}
        />
      </div>

      <h3
        className="mb-3 leading-[0.95] tracking-[-0.02em]"
        style={{
          fontFamily: "var(--font-fraunces), Georgia, serif",
          fontSize: "24px",
          fontWeight: 400,
          color: T.ink,
        }}
      >
        Your cart is{" "}
        <span className="italic font-light" style={{ color: T.wine }}>
          empty.
        </span>
      </h3>

      <p 
        className="text-[13px] leading-relaxed mb-8 max-w-[260px]"
        style={{ color: T.inkSoft, fontFamily: "var(--font-fraunces), Georgia, serif" }}
      >
        Discover our curated collections and add your desired pieces.
      </p>

      <Link
        href="/products"
        onClick={close}
        className="group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-sm transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-8px_rgba(184,147,90,0.6)]"
        style={{
          background: `linear-gradient(135deg, ${T.goldBright}, ${T.gold})`,
          color: T.ink,
          fontFamily: "var(--font-fraunces), Georgia, serif",
          fontSize: "11px",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          fontWeight: 600,
          boxShadow: `0 8px 24px -8px rgba(184,147,90,0.4)`,
        }}
      >
        Explore Collection
        <motion.svg
          width="14"
          height="10"
          viewBox="0 0 14 10"
          fill="none"
          className="group-hover:translate-x-1 transition-transform duration-300"
          aria-hidden
        >
          <path d="M1 5 H13 M9 1 L13 5 L9 9" stroke="currentColor" strokeWidth="1.5" />
        </motion.svg>
      </Link>
    </motion.div>
  );
}