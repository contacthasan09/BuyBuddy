"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export function TopProgressBar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show briefly on route change
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 400);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={pathname}
          initial={{ scaleX: 0, opacity: 1 }}
          animate={{ scaleX: 1, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            scaleX: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
            opacity: { duration: 0.3, delay: 0.2 },
          }}
          className="fixed top-0 left-0 right-0 h-0.5 z-[100] origin-left"
          style={{
            background:
              "linear-gradient(90deg, #3ec8e4 0%, #8ef4ff 50%, #3ec8e4 100%)",
            boxShadow: "0 0 12px rgba(62,200,228,0.6)",
          }}
        />
      )}
    </AnimatePresence>
  );
}