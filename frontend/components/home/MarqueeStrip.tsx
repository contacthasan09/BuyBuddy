"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

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

interface MarqueeStripProps {
  speed?: number;
  /** Optional extra items to append after the dynamic ones */
  extraItems?: string[];
}

/* ═══════════════════════════════════════════════════════
   Fallback items — elevated copy for premium brand voice
   ═══════════════════════════════════════════════════════ */
const FALLBACK_ITEMS = [
  "Complimentary Nationwide Delivery",
  "7-Day Seamless Returns",
  "Authenticated & Quality Assured",
  "Expedited Shipping",
  "Trusted by Discerning Collectors",
  "Proudly Crafted in Bangladesh",
];

export function MarqueeStrip({
  speed = 45,
  extraItems = [],
}: MarqueeStripProps) {
  const [items, setItems] = useState<string[]>(FALLBACK_ITEMS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    api
      .getSettings()
      .then((settings: any) => {
        const dynamic: string[] = [];

        // 1. Admin announcement
        if (settings?.announcement) {
          dynamic.push(String(settings.announcement));
        }

        // 2. Free delivery threshold
        const threshold = settings?.freeDeliveryThreshold;
        if (threshold && Number(threshold) > 0) {
          dynamic.push(`Complimentary Delivery Over ৳${Number(threshold)}`);
        }

        // 3. Store-specific static items (elevated)
        dynamic.push(
          "Cash on Delivery",
          "7-Day Seamless Returns",
          "Authenticated & Quality Assured",
          "Expedited Nationwide Shipping",
          "Trusted by Discerning Collectors",
          "Proudly Crafted in Bangladesh"
        );

        // Append any extra items passed as props
        if (extraItems.length > 0) {
          dynamic.push(...extraItems);
        }

        // De-duplicate
        const unique = Array.from(new Set(dynamic));

        setItems(unique);
        setLoaded(true);
      })
      .catch(() => {
        // API failed — keep fallback items
        setLoaded(true);
      });
  }, [extraItems]);

  // Duplicate the list for seamless loop
  const doubled = [...items, ...items];

  return (
    <section
      className="relative overflow-hidden py-3"
      style={{
        background: T.ink,
        borderTop: `1px solid ${T.gold}30`,
        borderBottom: `1px solid ${T.gold}30`,
      }}
    >
      {/* Subtle organic grain overlay */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.06] mix-blend-soft-light"
      >
        <filter id="grain-marquee">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.7 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-marquee)" />
      </svg>

      <div
        className="flex items-center marquee-track"
        style={{
          animationDuration: `${speed}s`,
          willChange: "transform",
        }}
        data-loaded={loaded}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-6 md:gap-8 whitespace-nowrap"
          >
            <span
              className="text-[10px] md:text-[11px] tracking-[0.3em] uppercase font-medium"
              style={{ 
                color: T.goldLeaf, 
                fontFamily: "var(--font-fraunces), Georgia, serif" 
              }}
            >
              {item}
            </span>
            <span
              className="text-[8px] opacity-40"
              style={{ color: T.gold }}
              aria-hidden
            >
              ❖
            </span>
          </span>
        ))}
      </div>

      <style jsx>{`
        .marquee-track {
          animation-name: marquee-scroll;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        @keyframes marquee-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        /* Mobile: speed up the scroll slightly so it doesn't feel sluggish */
        @media (max-width: 640px) {
          .marquee-track {
            animation-duration: ${Math.max(20, speed / 2)}s !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .marquee-track {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}