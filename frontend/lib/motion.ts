import type { Variants, Transition } from "framer-motion";

/* ═══════════════════════════════════════════════════════
   EASING
   ═══════════════════════════════════════════════════════ */
export const EASE = {
  expo: [0.16, 1, 0.3, 1] as const,
  soft: [0.22, 0.61, 0.36, 1] as const,
  retake: [0.22, 1, 0.36, 1] as const,
  slow: [0.65, 0, 0.35, 1] as const,
  back: [0.34, 1.56, 0.64, 1] as const,
  spring: { type: "spring", stiffness: 380, damping: 30 } as const,
} as const;

/* ═══════════════════════════════════════════════════════
   BASIC VARIANTS
   ═══════════════════════════════════════════════════════ */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: EASE.expo } },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE.expo } },
};

export const fadeUpSmall: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE.expo } },
};

export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE.expo } },
};

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE.expo } },
};

export const fadeRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE.expo } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: EASE.expo } },
};

export const zoomIn: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: EASE.back },
  },
};

/* ═══════════════════════════════════════════════════════
   STAGGER
   ═══════════════════════════════════════════════════════ */
export const staggerContainer = (stagger = 0.08, delay = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

export const staggerFast: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

export const staggerSlow: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

/* ═══════════════════════════════════════════════════════
   SECTION REVEALS
   ═══════════════════════════════════════════════════════ */
export const sectionReveal: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE.expo } },
};

export const wordReveal: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: EASE.expo },
  },
};

export const subtitleReveal: Variants = {
  hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease: EASE.expo },
  },
};

/* ═══════════════════════════════════════════════════════
   HOVER STATES
   ═══════════════════════════════════════════════════════ */
export const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.02,
    y: -4,
    transition: { duration: 0.3, ease: EASE.expo },
  },
};

export const imageHover = {
  rest: { scale: 1 },
  hover: { scale: 1.06, transition: { duration: 0.7, ease: EASE.expo } },
};

export const buttonHover = {
  rest: { y: 0 },
  hover: { y: -2, transition: { duration: 0.25, ease: EASE.expo } },
  tap: { scale: 0.97 },
};

/* ═══════════════════════════════════════════════════════
   VIEWPORT PRESETS
   ═══════════════════════════════════════════════════════ */
export const viewportOnce = { once: true, margin: "-80px" } as const;
export const viewportSoft = { once: true, margin: "-120px" } as const;
export const viewportTight = { once: true, margin: "-40px" } as const;

/* ═══════════════════════════════════════════════════════
   DRAWER / MODAL
   ═══════════════════════════════════════════════════════ */
export const drawerBackdrop: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export const drawerContent: Variants = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: { duration: 0.5, ease: EASE.expo },
  },
  exit: {
    x: "100%",
    transition: { duration: 0.35, ease: EASE.soft },
  },
};

export const modalContent: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.35, ease: EASE.expo },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 12,
    transition: { duration: 0.2 },
  },
};

/* ═══════════════════════════════════════════════════════
   PAGE TRANSITION (used by template.tsx)
   ═══════════════════════════════════════════════════════ */
export const pageEnter: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE.expo },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: { duration: 0.25, ease: EASE.soft },
  },
};

/* ═══════════════════════════════════════════════════════
   UTILITIES
   ═══════════════════════════════════════════════════════ */
export const springTransition: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

export function withDelay(variants: Variants, delay: number): Variants {
  return Object.fromEntries(
    Object.entries(variants).map(([key, val]) => {
      if (typeof val === "object" && val !== null) {
        const v = val as any;
        if (v.transition) {
          return [
            key,
            {
              ...v,
              transition: { ...v.transition, delay },
            },
          ];
        }
      }
      return [key, val];
    })
  );
}