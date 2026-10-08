"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Expand } from "lucide-react";
import { ImageZoom } from "./ImageZoom";
import { GalleryLightbox } from "./GalleryLightbox";
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

interface ProductGalleryProps {
  images: string[];
  productName: string;
  discount?: number;
  isFeatured?: boolean;
  outOfStock?: boolean;
}

export function ProductGallery({
  images,
  productName,
  discount = 0,
  isFeatured = false,
  outOfStock = false,
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const safeImages =
    images.length > 0 ? images : ["https://placehold.co/800x800?text=Product"];

  return (
    <>
      <div className="lg:sticky lg:top-24 lg:self-start">
        {/* Main image frame */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, ease: EASE.expo }}
          className="relative aspect-square overflow-hidden rounded-sm group"
          style={{
            background: T.bone,
            border: `1px solid ${T.gold}30`,
            boxShadow: `0 1px 0 ${T.gold}20, 0 24px 48px -24px rgba(28,22,18,0.3)`,
          }}
        >
          {/* Inner gold hairline */}
          <div
            className="absolute inset-1.5 pointer-events-none z-20 rounded-sm"
            style={{ border: `0.5px solid ${T.gold}`, opacity: 0.25 }}
            aria-hidden
          />

          {/* Corner ornaments */}
          {[
            { top: 6, left: 6, rotate: 0 },
            { top: 6, right: 6, rotate: 90 },
            { bottom: 6, right: 6, rotate: 180 },
            { bottom: 6, left: 6, rotate: 270 },
          ].map((pos, idx) => (
            <div
              key={idx}
              className="absolute z-20 w-3 h-3 pointer-events-none"
              style={{
                top: pos.top,
                right: pos.right,
                bottom: pos.bottom,
                left: pos.left,
                transform: `rotate(${pos.rotate}deg)`,
              }}
              aria-hidden
            >
              <svg viewBox="0 0 12 12" fill="none">
                <path d="M0 0 L12 0 L12 12" stroke={T.gold} strokeWidth="0.8" opacity="0.6" />
                <circle cx="1" cy="1" r="0.8" fill={T.gold} opacity="0.8" />
              </svg>
            </div>
          ))}

          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <ImageZoom
                src={safeImages[activeIndex]}
                alt={productName}
                zoomLevel={2}
              />
            </motion.div>
          </AnimatePresence>

          {/* Discount wax seal */}
          {discount > 0 && (
            <motion.div
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
              className="absolute top-3 right-3 z-20 h-11 w-11 rounded-full flex items-center justify-center"
              style={{
                background: `radial-gradient(circle at 30% 30%, ${T.goldBright}, ${T.gold} 70%, #8A6B3A 100%)`,
                boxShadow: `0 4px 12px -2px rgba(184,147,90,0.5), inset 0 1px 0 ${T.goldLeaf}80`,
              }}
            >
              <div
                className="h-[42px] w-[42px] rounded-full flex items-center justify-center"
                style={{ border: `1px dashed ${T.ink}50` }}
              >
                <span
                  className="text-[11px] font-bold"
                  style={{ color: T.ink, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                >
                  −{discount}
                </span>
              </div>
            </motion.div>
          )}

          {/* Featured badge */}
          {isFeatured && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="absolute top-3 left-3 z-20 px-3 py-1.5 rounded-sm"
              style={{
                background: `${T.bone}E6`,
                backdropFilter: "blur(8px)",
                border: `1px solid ${T.gold}50`,
              }}
            >
              <span
                className="text-[9px] tracking-[0.25em] uppercase font-semibold"
                style={{ color: T.gold, fontFamily: "var(--font-fraunces), Georgia, serif" }}
              >
                Featured
              </span>
            </motion.div>
          )}

          {/* Sold out overlay */}
          {outOfStock && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 z-30 flex items-center justify-center"
              style={{ background: `${T.bone}E6`, backdropFilter: "blur(6px)" }}
            >
              <span
                className="px-5 py-2.5 rounded-sm"
                style={{
                  border: `1px solid ${T.gold}50`,
                  color: T.inkSoft,
                  fontFamily: "var(--font-fraunces), Georgia, serif",
                  fontSize: "11px",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  fontWeight: 500,
                }}
              >
                Sold out
              </span>
            </motion.div>
          )}

          {/* Expand button */}
          <motion.button
            type="button"
            onClick={() => setLightboxOpen(true)}
            initial={{ opacity: 0, y: 8 }}
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            className="absolute bottom-3 right-3 z-20 w-10 h-10 rounded-sm flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100"
            style={{
              background: `${T.bone}F0`,
              backdropFilter: "blur(12px)",
              border: `1px solid ${T.gold}50`,
            }}
            aria-label="View full size"
          >
            <Expand className="w-4 h-4" strokeWidth={1.5} style={{ color: T.gold }} />
          </motion.button>
        </motion.div>

        {/* Thumbnails */}
        {safeImages.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE.expo }}
            className="grid grid-cols-5 gap-3 mt-4"
          >
            {safeImages.slice(0, 5).map((img, i) => (
              <motion.button
                key={i}
                type="button"
                onClick={() => setActiveIndex(i)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.3, ease: EASE.expo }}
                className="relative aspect-square overflow-hidden rounded-sm transition-all duration-300"
                style={{
                  border: `1px solid ${activeIndex === i ? T.gold : `${T.gold}30`}`,
                  background: T.bone,
                  boxShadow: activeIndex === i ? `0 0 0 1px ${T.gold}40, 0 4px 12px -4px rgba(28,22,18,0.2)` : "none",
                  opacity: activeIndex === i ? 1 : 0.7,
                }}
                aria-label={`View image ${i + 1}`}
              >
                <img
                  src={img}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  draggable={false}
                />
                {/* Active overlay tint */}
                {activeIndex === i && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: `linear-gradient(135deg, ${T.gold}15, transparent)` }}
                  />
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>

      <GalleryLightbox
        images={safeImages}
        activeIndex={activeIndex}
        productName={productName}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onIndexChange={setActiveIndex}
      />
    </>
  );
}