"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
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

export function WhatsAppFloat() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 200);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20, filter: "blur(8px)" }}
          animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.8, y: 20, filter: "blur(8px)" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-24 right-6 z-[96] flex flex-col items-end gap-3"
        >
          {/* Tooltip */}
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.95 }}
            animate={{ 
              opacity: isHovered ? 1 : 0, 
              x: isHovered ? 0 : 10, 
              scale: isHovered ? 1 : 0.95 
            }}
            transition={{ duration: 0.3, ease: EASE.expo }}
            className="pointer-events-none absolute right-full mr-4 top-1/2 -translate-y-1/2 whitespace-nowrap"
          >
            <div
              className="px-4 py-2 rounded-sm shadow-lg"
              style={{
                background: T.ink,
                border: `1px solid ${T.gold}40`,
              }}
            >
              <p
                className="text-[10px] tracking-[0.25em] uppercase font-medium"
                style={{ color: T.goldLeaf, fontFamily: "var(--font-fraunces), Georgia, serif" }}
              >
                Chat with Concierge
              </p>
              {/* Tooltip arrow */}
              <div
                className="absolute top-1/2 -right-1.5 w-3 h-3 -translate-y-1/2 rotate-45"
                style={{
                  background: T.ink,
                  borderRight: `1px solid ${T.gold}40`,
                  borderBottom: `1px solid ${T.gold}40`,
                }}
              />
            </div>
          </motion.div>

          {/* Button */}
          <motion.a
            href="https://wa.me/8801700000000?text=Hello%2C%20I%20have%20an%20inquiry%20regarding%20a%20piece."
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="relative w-14 h-14 flex items-center justify-center overflow-hidden transition-all duration-500"
            style={{
              borderRadius: "12px",
              background: isHovered ? T.gold : T.ink,
              border: `1px solid ${isHovered ? T.gold : T.gold}40`,
              boxShadow: isHovered 
                ? `0 12px 32px -8px ${T.gold}60` 
                : `0 8px 24px -8px rgba(28,22,18,0.4)`,
            }}
            aria-label="Chat with Concierge on WhatsApp"
          >
            {/* Subtle breathing pulse ring */}
            <motion.span
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 rounded-[12px]"
              style={{ border: `1.5px solid ${T.gold}` }}
              aria-hidden
            />

            {/* WhatsApp Icon */}
            <motion.svg
              width="24"
              height="24"
              viewBox="0 0 32 32"
              animate={{
                fill: isHovered ? T.ink : T.goldLeaf,
              }}
              transition={{ duration: 0.4, ease: EASE.expo }}
              aria-hidden
            >
              <path d="M16.004 3C9.377 3 4 8.377 4 15.004c0 2.652.86 5.11 2.325 7.11L4.67 27.33l5.39-1.41A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.623 28 15.004 28 8.377 22.63 3 16.004 3zm6.98 16.99c-.29.82-1.69 1.5-2.35 1.6-.6.09-1.36.13-2.2-.14-.5-.16-1.15-.38-1.98-.74-3.48-1.5-5.75-5-5.92-5.23-.17-.23-1.35-1.8-1.35-3.43 0-1.64.86-2.45 1.17-2.78.3-.33.66-.41.88-.41.22 0 .44 0 .63.01.2.01.47-.08.74.56.29.68.98 2.38 1.07 2.55.09.17.15.37.03.6-.12.23-.18.37-.35.57-.17.2-.36.44-.51.59-.17.17-.35.35-.15.69.2.33.89 1.47 1.91 2.38 1.31 1.17 2.41 1.53 2.75 1.7.34.17.54.14.74-.09.2-.23.85-.99 1.08-1.33.23-.34.46-.28.77-.17.31.11 1.98.93 2.32 1.1.34.17.57.25.65.39.08.14.08.82-.21 1.64z" />
            </motion.svg>
          </motion.a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}