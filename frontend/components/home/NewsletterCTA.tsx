"use client";

import { useState, type FormEvent } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { EASE } from "@/lib/motion";

/* ——————————————————————————————————————————————
   Palette — Maison "Haute" edition
—————————————————————————————————————————————— */
const T = {
  bg: "#F0E8D5",
  ink: "#120E0A",
  inkSoft: "#6B5D4F",
  gold: "#C59D5F",
  goldBright: "#E8C87A",
  goldLeaf: "#F2DCA4",
  wine: "#3D1216",
  bone: "#FAF5EB",
};

type Status = "idle" | "loading" | "done" | "error";

const root: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};

const settle: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1, ease: EASE.expo },
  },
};

const draw: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 1.2, ease: EASE.expo } },
};

export function NewsletterCTA() {
  const reduce = useReducedMotion();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || status === "loading" || status === "done") return;

    setStatus("loading");
    try {
      // Slightly longer delay for a deliberate, cinematic feel
      await new Promise((r) => setTimeout(r, 1200));
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  const busy = status === "loading";
  const done = status === "done";

  return (
    <section
      aria-labelledby="newsletter-heading"
      className="relative overflow-hidden"
      style={{ background: T.bg, color: T.ink }}
    >
      {/* Subtle organic grain overlay */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.05] mix-blend-multiply"
      >
        <filter id="grain-newsletter">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.65 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-newsletter)" />
      </svg>

      <div className="container-x relative z-10 py-24 md:py-32">
        <motion.form
          onSubmit={handleSubmit}
          variants={root}
          initial={reduce ? "show" : "hidden"}
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="max-w-5xl mx-auto"
          noValidate={false}
        >
          <h2 id="newsletter-heading" className="sr-only">
            Private Access List
          </h2>

          {/* The sentence is the form: label and input share one line of type. */}
          <motion.div
            variants={settle}
            className="flex flex-col gap-x-8 gap-y-4 md:flex-row md:items-baseline"
            style={{
              fontFamily: "var(--font-fraunces), Georgia, serif",
              fontSize: "clamp(1.8rem, 4.2vw, 3.2rem)",
              lineHeight: 1.15,
              letterSpacing: "-0.025em",
            }}
          >
            <label htmlFor="newsletter-email" className="shrink-0 font-normal">
              Join our private list for early access:
            </label>

            <div className="group relative min-w-0 flex-1">
              <input
                id="newsletter-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                disabled={busy || done}
                placeholder="your@email.com"
                // Adjusted padding and explicit smaller font size for elegant contrast
                className="w-full bg-transparent pb-1.5 outline-none placeholder:text-[#6B5D4F]/40 disabled:opacity-60"
                style={{ 
                  fontSize: "1.1rem", // Smaller, refined size
                  letterSpacing: "-0.01em",
                  fontFamily: "var(--font-fraunces), Georgia, serif",
                  color: "inherit"
                }}
              />
              
              {/* Resting underline draws in with the sequence */}
              <motion.span
                aria-hidden
                variants={draw}
                className="absolute bottom-0 left-0 h-px w-full origin-left"
                style={{ background: `${T.inkSoft}40` }}
              />
              
              {/* Fills in with luminous gold while the field is focused */}
              <span
                aria-hidden
                className="pointer-events-none absolute bottom-0 left-0 h-[1.5px] w-full origin-left scale-x-0 transition-transform duration-700 ease-out group-focus-within:scale-x-100"
                style={{ background: T.gold, boxShadow: `0 0 8px ${T.gold}40` }}
              />
            </div>
          </motion.div>

          <motion.div
            variants={settle}
            className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-6"
          >
            <motion.button
              type="submit"
              disabled={busy || done}
              whileHover={status === "idle" || status === "error" ? { y: -2 } : undefined}
              whileTap={status === "idle" || status === "error" ? { scale: 0.98 } : undefined}
              transition={{ duration: 0.3, ease: EASE.expo }}
              className="inline-flex h-12 min-w-[10rem] items-center justify-center gap-2.5 rounded-sm px-8 text-[11px] font-semibold uppercase tracking-[0.2em] transition-all duration-300 disabled:cursor-default disabled:opacity-70"
              style={{
                background: done ? `${T.gold}20` : `linear-gradient(135deg, ${T.goldBright}, ${T.gold})`,
                color: done ? T.gold : T.ink,
                border: `1px solid ${done ? T.gold : "transparent"}`,
                boxShadow: done ? "none" : `0 8px 24px -8px ${T.gold}40`,
              }}
              onMouseEnter={(e) => {
                if (!done && !busy) {
                  e.currentTarget.style.boxShadow = `0 12px 32px -8px ${T.gold}60`;
                }
              }}
              onMouseLeave={(e) => {
                if (!done && !busy) {
                  e.currentTarget.style.boxShadow = `0 8px 24px -8px ${T.gold}40`;
                }
              }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={status}
                  initial={reduce ? false : { opacity: 0, y: 8, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                  transition={{ duration: 0.3, ease: EASE.expo }}
                  className="inline-flex items-center gap-2.5"
                >
                  {busy ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                      Processing
                    </>
                  ) : done ? (
                    <>
                      <Check className="h-4 w-4" strokeWidth={2} aria-hidden />
                      Granted
                    </>
                  ) : (
                    "Request Access"
                  )}
                </motion.span>
              </AnimatePresence>
            </motion.button>

            <p
              role="status"
              aria-live="polite"
              className="max-w-[44ch] text-[13px] leading-relaxed"
              style={{ color: T.inkSoft, fontFamily: "var(--font-fraunces), Georgia, serif" }}
            >
              {done
                ? "Your request has been received. We will notify you upon our next arrival."
                : status === "error"
                  ? "We were unable to process your request. Please verify your address and try again."
                  : "Receive exclusive previews of new acquisitions and private offers. You may withdraw your consent at any time."}
            </p>
          </motion.div>
        </motion.form>
      </div>
    </section>
  );
}