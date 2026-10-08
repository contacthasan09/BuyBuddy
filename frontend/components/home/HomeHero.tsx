"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import LTXSceneClient from "./LTXSceneClient";

export function HomeHero() {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const opacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 1, 0.7]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 40]);

  return (
    <div ref={ref} className="relative">
      <motion.div
        style={{
          scale,
          opacity,
          y,
          transformOrigin: "center top",
        }}
        className="will-change-transform"
      >
        <LTXSceneClient />
      </motion.div>
    </div>
  );
}