"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Cookie, X } from "lucide-react";
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

const STORAGE_KEY = "maison_cookie_consent_v1";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        // Delay showing so it doesn't interfere with initial load
        setTimeout(() => setVisible(true), 1500);
      }
    } catch {
      // localStorage unavailable — show anyway
      setTimeout(() => setVisible(true), 1500);
    }
  }, []);

  const handleAccept = (level: "all" | "essential") => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ level, date: new Date().toISOString() })
      );
    } catch {}
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 120, opacity: 0, filter: "blur(8px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: 120, opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-md z-[110] rounded-sm p-6"
          style={{
            background: T.bone,
            border: `1px solid ${T.gold}40`,
            boxShadow: `0 1px 0 ${T.gold}20, 0 24px 48px -12px rgba(28,22,18,0.3)`,
          }}
        >
          {/* Inner gold hairline */}
          <div
            className="absolute inset-2 pointer-events-none rounded-sm"
            style={{ border: `0.5px solid ${T.gold}`, opacity: 0.2 }}
            aria-hidden
          />

          <div className="relative z-10 flex items-start gap-4">
            <div 
              className="w-10 h-10 rounded-sm flex items-center justify-center flex-shrink-0"
              style={{ background: `${T.gold}10`, border: `1px solid ${T.gold}30` }}
            >
              <Cookie className="w-5 h-5" strokeWidth={1.5} style={{ color: T.gold }} />
            </div>

            <div className="flex-1 min-w-0">
              <h3
                className="mb-2"
                style={{
                  fontFamily: "var(--font-fraunces), Georgia, serif",
                  fontSize: "16px",
                  fontWeight: 500,
                  color: T.ink,
                }}
              >
                Cookie Preferences
              </h3>
              <p
                className="text-[13px] leading-relaxed mb-5"
                style={{
                  fontFamily: "var(--font-fraunces), Georgia, serif",
                  color: T.inkSoft,
                }}
              >
                We utilize minimal cookies to refine your shopping experience, preserve your cart, and understand our clientele. Review our{" "}
                <Link
                  href="/privacy-policy"
                  className="font-medium transition-colors duration-300 hover:underline"
                  style={{ color: T.gold }}
                >
                  Privacy Policy
                </Link>
                .
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                  type="button"
                  onClick={() => handleAccept("all")}
                  whileHover={{ y: -1, boxShadow: `0 8px 20px -8px ${T.gold}60` }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-4 py-3 rounded-sm transition-all duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${T.goldBright}, ${T.gold})`,
                    color: T.ink,
                    fontFamily: "var(--font-fraunces), Georgia, serif",
                    fontSize: "10px",
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                    boxShadow: `0 4px 12px -4px ${T.gold}40`,
                  }}
                >
                  Accept All
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => handleAccept("essential")}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-4 py-3 rounded-sm transition-all duration-300"
                  style={{
                    background: "transparent",
                    color: T.inkSoft,
                    fontFamily: "var(--font-fraunces), Georgia, serif",
                    fontSize: "10px",
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    fontWeight: 500,
                    border: `1px solid ${T.gold}40`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = T.gold;
                    e.currentTarget.style.background = `${T.gold}08`;
                    e.currentTarget.style.color = T.ink;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = `${T.gold}40`;
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = T.inkSoft;
                  }}
                >
                  Essential Only
                </motion.button>
              </div>
            </div>

            <motion.button
              type="button"
              onClick={() => handleAccept("essential")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0 transition-all duration-300"
              style={{ border: `1px solid ${T.gold}30` }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = T.gold;
                e.currentTarget.style.background = `${T.gold}10`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = `${T.gold}30`;
                e.currentTarget.style.background = "transparent";
              }}
              aria-label="Close"
            >
              <X className="w-4 h-4" strokeWidth={1.5} style={{ color: T.inkSoft }} />
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}