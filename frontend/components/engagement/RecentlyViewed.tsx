"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { formatBDT } from "@/lib/utils";
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

interface RecentlyViewedProps {
  /** Hide current product from the list */
  excludeProductId?: string;
}

export function RecentlyViewed({ excludeProductId }: RecentlyViewedProps) {
  const { items, mounted } = useRecentlyViewed();

  if (!mounted) return null;

  const filtered = items.filter((p) => p._id !== excludeProductId);

  // Don't render if fewer than 2 items
  if (filtered.length < 2) return null;

  return (
    <section 
      className="container-x py-16 md:py-20 border-t" 
      style={{ borderColor: `${T.gold}30` }}
    >
      <motion.div
        variants={staggerFast}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mb-10"
      >
        <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
          <span className="h-px w-8" style={{ background: T.gold, opacity: 0.5 }} />
          <p
            className="text-[9px] tracking-[0.4em] uppercase"
            style={{ color: T.gold, fontFamily: "var(--font-fraunces), Georgia, serif" }}
          >
            Recently Viewed
          </p>
        </motion.div>

        <motion.h2
          variants={fadeUp}
          className="leading-[0.95] tracking-[-0.02em]"
          style={{
            color: T.ink,
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontSize: "clamp(28px, 3vw, 40px)",
            fontWeight: 400,
          }}
        >
          Picked up where you{" "}
          <span className="italic font-light" style={{ color: T.wine }}>
            left off.
          </span>
        </motion.h2>
      </motion.div>

      {/* Horizontal scroll */}
      <div className="flex gap-4 md:gap-5 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 pb-4">
        {filtered.map((item, i) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, delay: i * 0.06, ease: EASE.expo }}
            className="flex-shrink-0 w-[160px] md:w-[200px] group"
          >
            <Link href={`/product/${item.slug}`} className="block">
              {/* Image Frame */}
              <div 
                className="relative aspect-square overflow-hidden rounded-sm mb-3"
                style={{
                  background: T.bone,
                  border: `1px solid ${T.gold}30`,
                  boxShadow: `0 1px 0 ${T.gold}20, 0 12px 24px -12px rgba(28,22,18,0.15)`,
                }}
              >
                {/* Inner gold hairline */}
                <div
                  className="absolute inset-1.5 pointer-events-none z-10 rounded-sm"
                  style={{ border: `0.5px solid ${T.gold}`, opacity: 0.25 }}
                  aria-hidden
                />

                {/* Corner ornaments */}
                {[
                  { top: 4, left: 4, rotate: 0 },
                  { top: 4, right: 4, rotate: 90 },
                  { bottom: 4, right: 4, rotate: 180 },
                  { bottom: 4, left: 4, rotate: 270 },
                ].map(({ rotate, ...position }, idx) => (
                  <div
                    key={idx}
                    className="absolute z-10 w-2 h-2 pointer-events-none"
                    style={{ ...position, transform: `rotate(${rotate}deg)` }}
                    aria-hidden
                  >
                    <svg viewBox="0 0 8 8" fill="none">
                      <path d="M0 0 L8 0 L8 8" stroke={T.gold} strokeWidth="0.6" opacity="0.5" />
                      <circle cx="0.6" cy="0.6" r="0.5" fill={T.gold} opacity="0.7" />
                    </svg>
                  </div>
                ))}

                <motion.img
                  src={item.image}
                  alt={item.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  whileHover={{ scale: 1.04 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  loading="lazy"
                  draggable={false}
                />
              </div>

              {/* Meta */}
              <h3
                className="line-clamp-2 leading-snug mb-1.5 transition-colors duration-300 group-hover:text-[color:var(--gold)]"
                style={{
                  color: T.ink,
                  fontFamily: "var(--font-fraunces), Georgia, serif",
                  fontSize: "13px",
                }}
              >
                {item.name}
              </h3>
              <p
                className="tabular-nums"
                style={{
                  color: T.inkSoft,
                  fontFamily: "var(--font-fraunces), Georgia, serif",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                {formatBDT(item.price)}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}