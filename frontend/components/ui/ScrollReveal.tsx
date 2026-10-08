"use client";

import { motion, Variants } from "framer-motion";
import { ReactNode } from "react";
import { EASE, viewportOnce } from "@/lib/motion";

type Direction = "up" | "down" | "left" | "right" | "fade" | "scale";

interface ScrollRevealProps {
  children: ReactNode;
  /** Direction the content slides in from */
  direction?: Direction;
  /** Delay before reveal (seconds) */
  delay?: number;
  /** Duration of the animation (seconds) */
  duration?: number;
  /** Extra classes for the wrapper */
  className?: string;
  /** Amount of scroll before triggering (px) */
  amount?: number;
}

const variantsFor = (direction: Direction): Variants => {
  const distance = 40;
  const base = {
    hidden: {},
    visible: {},
  };

  switch (direction) {
    case "up":
      return {
        hidden: { opacity: 0, y: distance },
        visible: { opacity: 1, y: 0 },
      };
    case "down":
      return {
        hidden: { opacity: 0, y: -distance },
        visible: { opacity: 1, y: 0 },
      };
    case "left":
      return {
        hidden: { opacity: 0, x: -distance },
        visible: { opacity: 1, x: 0 },
      };
    case "right":
      return {
        hidden: { opacity: 0, x: distance },
        visible: { opacity: 1, x: 0 },
      };
    case "scale":
      return {
        hidden: { opacity: 0, scale: 0.94 },
        visible: { opacity: 1, scale: 1 },
      };
    case "fade":
    default:
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      };
  }
};

export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.7,
  className = "",
  amount = -80,
}: ScrollRevealProps) {
  const variants = variantsFor(direction);

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: `${amount}px` }}
      transition={{
        duration,
        delay,
        ease: EASE.expo,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}