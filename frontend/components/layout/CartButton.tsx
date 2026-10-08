"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/store/cart";
import { useCartDrawer } from "@/store/cart-drawer";

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

export function CartButton() {
  const itemCount = useCart((s) => s.itemCount());
  const open = useCartDrawer((s) => s.open);

  const controls = useAnimation();
  const badgeControls = useAnimation();
  const [mounted, setMounted] = useState(false);
  const prevCountRef = useRef(itemCount);

  // Hydration guard
  useEffect(() => {
    setMounted(true);
  }, []);

  // Listen for flying-dot landed events
  useEffect(() => {
    if (typeof window === "undefined") return;

    const onLanded = async () => {
      // Elegant, restrained "clink" shake (not cartoonish)
      await controls.start({
        rotate: [0, -6, 4, -2, 1, 0],
        scale: [1, 1.05, 1],
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
      });

      // Smooth, weighty badge pop
      badgeControls.start({
        scale: [1, 1.25, 1],
        transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] },
      });
    };

    window.addEventListener("flying-cart-dot-landed", onLanded);
    return () => window.removeEventListener("flying-cart-dot-landed", onLanded);
  }, [controls, badgeControls]);

  // Also pulse the badge whenever itemCount changes (fallback)
  useEffect(() => {
    if (prevCountRef.current !== itemCount && itemCount > 0) {
      badgeControls.start({
        scale: [1, 1.25, 1],
        transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] },
      });
    }
    prevCountRef.current = itemCount;
  }, [itemCount, badgeControls]);

  const displayCount = mounted ? itemCount : 0;

  return (
    <button
      type="button"
      onClick={open}
      data-cart-icon
      className="relative w-10 h-10 flex items-center justify-center transition-all duration-300"
      style={{
        borderRadius: "4px",
        border: `1px solid ${T.gold}40`,
        background: "transparent",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = `${T.gold}10`;
        e.currentTarget.style.borderColor = T.gold;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.borderColor = `${T.gold}40`;
      }}
      aria-label={`Cart — ${displayCount} item${displayCount === 1 ? "" : "s"}`}
    >
      <motion.div animate={controls}>
        <ShoppingBag 
          className="w-4 h-4" 
          strokeWidth={1.5} 
          style={{ color: T.ink }} 
        />
      </motion.div>

      {displayCount > 0 && (
        <motion.span
          animate={badgeControls}
          initial={{ scale: 0 }}
          className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center"
          style={{
            borderRadius: "3px",
            background: T.wine,
            color: T.goldLeaf,
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontSize: "9px",
            fontWeight: 600,
            letterSpacing: "0.05em",
            boxShadow: `0 2px 8px -2px ${T.wine}60`,
            border: `1px solid ${T.gold}40`,
          }}
        >
          {displayCount > 99 ? "99+" : displayCount}
        </motion.span>
      )}
    </button>
  );
}