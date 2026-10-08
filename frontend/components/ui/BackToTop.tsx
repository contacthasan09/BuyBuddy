"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { EASE } from "@/lib/motion";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 600);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{
            duration: 0.35,
            ease: EASE.back,
          }}
          whileHover={{ y: -3, scale: 1.05 }}
          whileTap={{ scale: 0.94 }}
          /* ⭐ POSITION: bottom-6 (24px from bottom) — BELOW the WhatsApp */
          className="fixed bottom-6 right-6 z-[95] w-11 h-11 rounded-full bg-gray-900 text-white flex items-center justify-center shadow-2xl"
          aria-label="Back to top"
          style={{
            boxShadow:
              "0 12px 32px rgba(4,24,43,0.24), 0 4px 12px rgba(4,24,43,0.12)",
          }}
        >
          <ArrowUp className="w-4 h-4" strokeWidth={2} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}