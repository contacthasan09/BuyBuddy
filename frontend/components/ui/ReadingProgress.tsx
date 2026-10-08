"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

export function ReadingProgress() {
  const { scrollYProgress } = useScroll();

  // Smooth the progress with a spring
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 300,
    damping: 40,
    restDelta: 0.001,
  });

  const [visible, setVisible] = useState(false);

  // Show after some scroll
  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 100);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.div
      initial={false}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 h-[2px] z-[100] pointer-events-none"
      style={{
        background: "transparent",
      }}
      aria-hidden
    >
      <motion.div
        style={{
          scaleX,
          transformOrigin: "0%",
          background:
            "linear-gradient(90deg, #3ec8e4 0%, #8ef4ff 50%, #3ec8e4 100%)",
          boxShadow: "0 0 10px rgba(62,200,228,0.6)",
          height: "100%",
          width: "100%",
        }}
      />
    </motion.div>
  );
}