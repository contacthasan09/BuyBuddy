"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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

/* ── Backend can return one of these tones ── */
type Tone = "info" | "sale" | "warn";

interface AnnouncementData {
  text: string;
  tone: Tone;
  href?: string;
}

/* ── Tone-based palettes ── */
const TONES: Record<
  Tone,
  { bg: string; border: string; text: string; dot: string; glow: string }
> = {
  info: {
    bg: T.ink,
    border: `${T.gold}30`,
    text: T.goldLeaf,
    dot: T.goldBright,
    glow: `${T.goldBright}80`,
  },
  sale: {
    bg: T.wine,
    border: `${T.goldBright}40`,
    text: T.goldLeaf,
    dot: T.goldBright,
    glow: `${T.goldBright}90`,
  },
  warn: {
    bg: "#2A1F0A",
    border: `${T.goldBright}50`,
    text: "#F4DFA0",
    dot: "#FFD266",
    glow: "#FFD26699",
  },
};

/* ── Fallback if the API fails ── */
const FALLBACK: AnnouncementData = {
  text: "Complimentary delivery on orders above ৳2,500 · Cash on Delivery nationwide",
  tone: "info",
};

/**
 * Normalize whatever the backend returns into an AnnouncementData object.
 * Accepts:
 *   - a plain string:        "🎉 Free delivery"
 *   - an object:             { text, tone, href }
 *   - legacy settings fields: { announcement, announcementTone, announcementHref }
 */
function normalizeAnnouncement(input: any): AnnouncementData | null {
  if (!input) return null;

  // Case 1: plain string
  if (typeof input === "string") {
    const t = input.trim();
    return t ? { text: t, tone: "info" } : null;
  }

  // Case 2: structured object
  if (typeof input === "object") {
    const text =
      input.text ??
      input.announcement ??
      input.message ??
      input.content ??
      "";

    if (!text || typeof text !== "string") return null;

    const toneRaw = String(input.tone ?? input.type ?? "info").toLowerCase();
    const tone: Tone =
      toneRaw === "sale" || toneRaw === "warn" ? (toneRaw as Tone) : "info";

    const href =
      typeof input.href === "string" && input.href.trim()
        ? input.href.trim()
        : undefined;

    return { text: text.trim(), tone, href };
  }

  return null;
}

export function AnnouncementBar() {
  const pathname = usePathname();
  const [data, setData] = useState<AnnouncementData | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let cancelled = false;

    api
      .getSettings()
      .then((s: any) => {
        if (cancelled) return;

        // Try several possible field names the backend may use
        const raw =
          s?.announcementBar ??
          s?.announcement ??
          s?.banner ??
          s?.notice ??
          null;

        const normalized = normalizeAnnouncement(raw);

        // If the backend returned a full object, respect it.
        // If it only returned a string, use it.
        setData(normalized ?? FALLBACK);
      })
      .catch(() => {
        if (!cancelled) setData(FALLBACK);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Hide on admin routes
  if (pathname?.startsWith("/admin")) return null;

  // Hydration guard
  if (!mounted || !data) return null;

  const tone = TONES[data.tone];
  const isLink = Boolean(data.href);

  const inner = (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "12px",
        position: "relative",
        maxWidth: "100%",
      }}
    >
      {/* Glowing gold pulse dot */}
      <motion.span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: tone.dot,
          boxShadow: `0 0 8px ${tone.glow}`,
          flexShrink: 0,
        }}
        animate={{
          scale: [1, 1.3, 1],
          boxShadow: [
            `0 0 6px ${tone.glow}`,
            `0 0 14px ${tone.glow}`,
            `0 0 6px ${tone.glow}`,
          ],
        }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.span
        key={data.text}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
        className="text-[10px] sm:text-[11px] tracking-[0.3em] uppercase font-medium"
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          maxWidth: "min(90vw, 900px)",
        }}
      >
        {data.text}
      </motion.span>
    </span>
  );

  return (
    <AnimatePresence>
      <motion.div
        key="announcement-bar"
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -40, opacity: 0 }}
        transition={{
          type: "spring",
          stiffness: 380,
          damping: 28,
          mass: 0.8,
        }}
        className="relative z-[500] overflow-hidden text-center"
        style={{
          background: tone.bg,
          borderBottom: `1px solid ${tone.border}`,
          color: tone.text,
          fontFamily: "var(--font-fraunces), Georgia, serif",
          transition: "background 400ms ease, border-color 400ms ease, color 400ms ease",
        }}
      >
        {/* Animated gold shimmer sweep */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `linear-gradient(90deg, transparent, ${T.goldBright}20, transparent)`,
          }}
          animate={{ x: ["-100%", "200%"] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "linear",
            repeatDelay: 2,
          }}
        />

        {/* Content — a link if href is provided, otherwise a plain div */}
        {isLink ? (
          <a
            href={data.href}
            className="relative block"
            style={{
              padding: "10px 16px",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            {inner}
          </a>
        ) : (
          <div className="relative" style={{ padding: "10px 16px" }}>
            {inner}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}