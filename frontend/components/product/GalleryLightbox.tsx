"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { EASE } from "@/lib/motion";

/* ——————————————————————————————————————————————
   Palette — Maison edition
—————————————————————————————————————————————— */
const T = {
  bg: "#EFE7D4",
  ink: "#1C1612",
  inkDeep: "#0E0A07",
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
      <filter id="grain-lb">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.7 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain-lb)" />
    </svg>
  );
}

interface GalleryLightboxProps {
  images: string[];
  activeIndex: number;
  productName: string;
  open: boolean;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

export function GalleryLightbox({
  images,
  activeIndex,
  productName,
  open,
  onClose,
  onIndexChange,
}: GalleryLightboxProps) {
  const next = useCallback(() => {
    onIndexChange((activeIndex + 1) % images.length);
  }, [activeIndex, images.length, onIndexChange]);

  const prev = useCallback(() => {
    onIndexChange((activeIndex - 1 + images.length) % images.length);
  }, [activeIndex, images.length, onIndexChange]);

  // Keyboard nav
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose, next, prev]);

  // Body scroll lock
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: EASE.expo }}
          className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-8"
          style={{ background: `${T.inkDeep}F2` }}
          onClick={onClose}
        >
          <Grain />

          {/* Vignette overlay */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(circle at center, transparent 30%, ${T.inkDeep} 100%)`,
            }}
          />

          {/* Close */}
          <motion.button
            type="button"
            onClick={onClose}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="absolute top-5 right-5 md:top-8 md:right-8 z-20 w-10 h-10 rounded-sm flex items-center justify-center transition-all duration-300"
            style={{
              border: `1px solid ${T.gold}30`,
              background: `${T.ink}60`,
              backdropFilter: "blur(8px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = T.gold;
              e.currentTarget.style.background = `${T.gold}15`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = `${T.gold}30`;
              e.currentTarget.style.background = `${T.ink}60`;
            }}
            aria-label="Close gallery"
          >
            <X className="w-4 h-4" strokeWidth={1.5} style={{ color: T.goldLeaf }} />
          </motion.button>

          {/* Counter */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="absolute top-6 left-5 md:top-8 md:left-8 z-20 flex items-center gap-2"
          >
            <span
              className="text-[10px] tracking-[0.3em] uppercase font-medium"
              style={{ color: T.gold, fontFamily: "var(--font-fraunces), Georgia, serif" }}
            >
              {String(activeIndex + 1).padStart(2, "0")}
            </span>
            <span className="h-px w-4" style={{ background: T.gold, opacity: 0.5 }} />
            <span
              className="text-[10px] tracking-[0.2em] uppercase"
              style={{ color: T.bone, opacity: 0.6, fontFamily: "var(--font-fraunces), Georgia, serif" }}
            >
              {images.length}
            </span>
          </motion.div>

          {/* Prev */}
          {images.length > 1 && (
            <motion.button
              type="button"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="absolute left-2 md:left-6 z-20 w-11 h-11 md:w-12 md:h-12 rounded-sm flex items-center justify-center transition-all duration-300"
              style={{
                border: `1px solid ${T.gold}20`,
                background: `${T.ink}40`,
                backdropFilter: "blur(8px)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = T.gold;
                e.currentTarget.style.background = `${T.gold}15`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = `${T.gold}20`;
                e.currentTarget.style.background = `${T.ink}40`;
              }}
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" strokeWidth={1.5} style={{ color: T.goldLeaf }} />
            </motion.button>
          )}

          {/* Main image */}
          <div className="relative z-10 flex items-center justify-center max-w-5xl w-full">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeIndex}
                src={images[activeIndex]}
                alt={`${productName} — view ${activeIndex + 1}`}
                initial={{ opacity: 0, scale: 0.97, filter: "blur(6px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 1.02, filter: "blur(6px)" }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                onClick={(e) => e.stopPropagation()}
                className="max-w-full max-h-[70vh] md:max-h-[80vh] object-contain rounded-sm select-none"
                style={{
                  boxShadow: `0 24px 64px -16px rgba(0,0,0,0.6), 0 0 0 1px ${T.gold}15`,
                }}
                draggable={false}
              />
            </AnimatePresence>
          </div>

          {/* Next */}
          {images.length > 1 && (
            <motion.button
              type="button"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="absolute right-2 md:right-6 z-20 w-11 h-11 md:w-12 md:h-12 rounded-sm flex items-center justify-center transition-all duration-300"
              style={{
                border: `1px solid ${T.gold}20`,
                background: `${T.ink}40`,
                backdropFilter: "blur(8px)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = T.gold;
                e.currentTarget.style.background = `${T.gold}15`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = `${T.gold}20`;
                e.currentTarget.style.background = `${T.ink}40`;
              }}
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" strokeWidth={1.5} style={{ color: T.goldLeaf }} />
            </motion.button>
          )}

          {/* Thumbnails */}
          {images.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5, ease: EASE.expo }}
              className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-20"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="flex gap-2 md:gap-2.5 max-w-[90vw] overflow-x-auto no-scrollbar p-2 md:p-2.5 rounded-sm"
                style={{
                  background: `${T.ink}70`,
                  backdropFilter: "blur(16px)",
                  border: `1px solid ${T.gold}25`,
                  boxShadow: `0 8px 32px -8px rgba(0,0,0,0.5)`,
                }}
              >
                {images.map((img, i) => (
                  <motion.button
                    key={i}
                    type="button"
                    onClick={() => onIndexChange(i)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative w-12 h-12 md:w-14 md:h-14 rounded-sm overflow-hidden flex-shrink-0 transition-all duration-300`}
                    style={{
                      border: i === activeIndex ? `1px solid ${T.gold}` : `1px solid transparent`,
                      opacity: i === activeIndex ? 1 : 0.45,
                      boxShadow: i === activeIndex ? `0 0 12px -2px ${T.gold}60` : "none",
                    }}
                    aria-label={`View image ${i + 1}`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                    {/* Active overlay tint */}
                    {i === activeIndex && (
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{ background: `linear-gradient(135deg, ${T.gold}15, transparent)` }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}