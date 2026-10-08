"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { EASE, viewportOnce } from "@/lib/motion";

interface StaggerRevealProps {
  children: ReactNode;
  /** Delay between each child (seconds) */
  stagger?: number;
  /** Initial delay before the first child (seconds) */
  delay?: number;
  className?: string;
  /** How far each child slides in from (px) */
  distance?: number;
}

const container = (stagger: number, delay: number) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
      delayChildren: delay,
    },
  },
});

const child = (distance: number) => ({
  hidden: { opacity: 0, y: distance },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE.expo },
  },
});

export function StaggerReveal({
  children,
  stagger = 0.08,
  delay = 0,
  className = "",
  distance = 24,
}: StaggerRevealProps) {
  return (
    <motion.div
      variants={container(stagger, delay)}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className={className}
    >
      {Array.isArray(children) ? (
        children.map((c, i) => (
          <motion.div key={i} variants={child(distance)}>
            {c}
          </motion.div>
        ))
      ) : (
        <motion.div variants={child(distance)}>{children}</motion.div>
      )}
    </motion.div>
  );
}