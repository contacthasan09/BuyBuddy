"use client";

import {
  useEffect,
  useRef,
  useState,
  useMemo,
  type PointerEvent as ReactPointerEvent,
} from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import type { Product } from "@/types";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
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

/* ——————————————————————————————————————————————
   Countdown
—————————————————————————————————————————————— */
function useCountdown(hours = 11) {
  const total = hours * 3600;
  const [left, setLeft] = useState(total);
  useEffect(() => {
    const t = setInterval(() => setLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  const h = Math.floor(left / 3600);
  const m = Math.floor((left % 3600) / 60);
  const s = left % 60;
  return { h, m, s, progress: 1 - left / total };
}

function price(p: Product) {
  return p.discountPrice ?? p.sellingPrice;
}
function off(p: Product) {
  if (!p.discountPrice) return 0;
  return Math.round(((p.sellingPrice - p.discountPrice) / p.sellingPrice) * 100);
}

/* ——————————————————————————————————————————————
   SVG noise
—————————————————————————————————————————————— */
function Grain() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.09] mix-blend-multiply"
    >
      <filter id="grain-m">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.9"
          numOctaves="2"
          stitchTiles="stitch"
        />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0"
        />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain-m)" />
    </svg>
  );
}

/* ——————————————————————————————————————————————
   Floating gold dust — hydration-safe
   Random values are generated AFTER mount so
   server and client output match on first paint.
—————————————————————————————————————————————— */
type Mote = {
  id: number;
  left: number;
  top: number;
  size: number;
  dur: number;
  delay: number;
};

function Dust() {
  const [motes, setMotes] = useState<Mote[]>([]);

  useEffect(() => {
    setMotes(
      Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 1 + Math.random() * 2,
        dur: 14 + Math.random() * 16,
        delay: Math.random() * -18,
      }))
    );
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {motes.map((m) => (
        <motion.span
          key={m.id}
          className="absolute rounded-full"
          style={{
            left: `${m.left}%`,
            top: `${m.top}%`,
            width: m.size,
            height: m.size,
            background: `radial-gradient(circle, ${T.goldBright} 0%, ${T.gold} 60%, transparent 100%)`,
            boxShadow: `0 0 ${m.size * 3}px ${T.goldBright}`,
          }}
          animate={{
            y: [0, -35, 0],
            x: [0, 8, -6, 0],
            opacity: [0, 0.8, 0.3, 0],
          }}
          transition={{
            duration: m.dur,
            delay: m.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ——————————————————————————————————————————————
   Ornamental fleuron
—————————————————————————————————————————————— */
function Fleuron({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 14" className={className} fill="none" aria-hidden>
      <path
        d="M0 7 H50"
        stroke={T.gold}
        strokeOpacity="0.5"
        strokeWidth="0.6"
      />
      <path
        d="M70 7 H120"
        stroke={T.gold}
        strokeOpacity="0.5"
        strokeWidth="0.6"
      />
      <g transform="translate(60 7)">
        <path
          d="M0 -4 C2 -4 3 -2 3 0 C3 2 2 4 0 4 C-2 4 -3 2 -3 0 C-3 -2 -2 -4 0 -4 Z"
          fill={T.gold}
          fillOpacity="0.85"
        />
        <circle r="1" fill={T.bone} />
        <path
          d="M-8 0 L-5 0 M5 0 L8 0"
          stroke={T.gold}
          strokeOpacity="0.7"
          strokeWidth="0.6"
        />
      </g>
    </svg>
  );
}

/* ——————————————————————————————————————————————
   Flip digit
—————————————————————————————————————————————— */
function Digit({ value, label }: { value: number; label: string }) {
  const str = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="relative h-14 w-11 sm:h-16 sm:w-12 overflow-hidden rounded-[3px]"
        style={{
          background: `linear-gradient(180deg, ${T.ink} 0%, #0E0A07 100%)`,
          boxShadow: `inset 0 1px 0 rgba(232,212,160,0.12), inset 0 -1px 0 rgba(0,0,0,0.6), 0 8px 24px -8px rgba(28,22,18,0.6)`,
        }}
      >
        <div
          className="absolute inset-0 rounded-[3px] pointer-events-none"
          style={{ border: `1px solid ${T.gold}`, opacity: 0.35 }}
        />
        <div className="absolute inset-x-0 top-1/2 h-px bg-black/70" />
        <div
          className="absolute inset-x-0 top-1/2 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${T.goldBright}, transparent)`,
            opacity: 0.25,
          }}
        />
        {[
          { top: 2, left: 2 },
          { top: 2, right: 2 },
          { bottom: 2, left: 2 },
          { bottom: 2, right: 2 },
        ].map((p, i) => (
          <span
            key={i}
            className="absolute h-[2.5px] w-[2.5px] rounded-full"
            style={
              { background: T.gold, opacity: 0.5, ...p } as React.CSSProperties
            }
          />
        ))}
        <AnimatePresence mode="popLayout">
          <motion.span
            key={str}
            initial={{ y: "-100%", opacity: 0, filter: "blur(6px)" }}
            animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
            exit={{ y: "100%", opacity: 0, filter: "blur(6px)" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 flex items-center justify-center font-mono text-xl sm:text-2xl font-semibold tabular-nums"
            style={{
              color: T.goldLeaf,
              textShadow: `0 0 12px ${T.goldBright}40, 0 1px 0 rgba(0,0,0,0.6)`,
            }}
          >
            {str}
          </motion.span>
        </AnimatePresence>
      </div>
      <span
        className="text-[8px] tracking-[0.3em] uppercase"
        style={{
          color: T.inkSoft,
          fontFamily: "var(--font-fraunces), Georgia, serif",
        }}
      >
        {label}
      </span>
    </div>
  );
}

/* ——————————————————————————————————————————————
   Progress ring
—————————————————————————————————————————————— */
function ProgressRing({ progress }: { progress: number }) {
  const r = 88;
  const c = 2 * Math.PI * r;
  return (
    <svg
      className="absolute inset-0 -m-3 h-[calc(100%+1.5rem)] w-[calc(100%+1.5rem)] pointer-events-none"
      viewBox="0 0 200 200"
      aria-hidden
    >
      <circle
        cx="100"
        cy="100"
        r={r}
        fill="none"
        stroke={T.gold}
        strokeOpacity="0.12"
        strokeWidth="0.5"
      />
      <motion.circle
        cx="100"
        cy="100"
        r={r}
        fill="none"
        stroke="url(#ringGrad)"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeDasharray={c}
        animate={{ strokeDashoffset: c * (1 - progress) }}
        transition={{ duration: 1, ease: "easeOut" }}
        transform="rotate(-90 100 100)"
      />
      <defs>
        <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={T.goldBright} />
          <stop offset="100%" stopColor={T.gold} />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ——————————————————————————————————————————————
   Precious product card
—————————————————————————————————————————————— */
function TiltCard({ p, i }: { p: Product; i: number }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), {
    stiffness: 180,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), {
    stiffness: 180,
    damping: 18,
  });

  function onMove(e: ReactPointerEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mouseX.set((e.clientX - r.left) / r.width - 0.5);
    mouseY.set((e.clientY - r.top) / r.height - 0.5);
  }
  function onLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  const discount = off(p);

  return (
    <motion.article
      initial={{ opacity: 0, y: 32, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay: i * 0.08, ease: EASE.expo }}
      className="group relative"
      style={{ perspective: 1000 }}
    >
      <Link
        ref={ref}
        href={`/product/${p.slug}`}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="block"
        style={{ transformStyle: "preserve-3d" }}
      >
        <motion.div
          className="relative"
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        >
          {/* outer gold frame */}
          <div
            className="absolute -inset-[3px] rounded-sm pointer-events-none"
            style={{
              background: `linear-gradient(135deg, ${T.gold}60, ${T.goldBright}40, ${T.gold}60)`,
              opacity: 0,
              transition: "opacity 0.4s ease",
            }}
            aria-hidden
          />

          {/* card frame */}
          <div
            className="relative aspect-[4/5] overflow-hidden rounded-sm"
            style={{
              background: T.bone,
              boxShadow: `0 1px 0 ${T.gold}20, 0 24px 48px -24px rgba(28,22,18,0.5), 0 8px 16px -8px rgba(28,22,18,0.3)`,
            }}
          >
            {/* inner gold hairline */}
            <div
              className="absolute inset-1.5 pointer-events-none z-20 rounded-sm"
              style={{ border: `0.5px solid ${T.gold}`, opacity: 0.3 }}
              aria-hidden
            />

            {/* image */}
            <motion.div
              className="absolute inset-0"
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src={p.images[0]}
                alt={p.name}
                fill
                sizes="(max-width:768px) 50vw, 16vw"
                className="object-cover"
                priority={i < 2}
              />
            </motion.div>

            {/* vignette */}
            <div
              className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              style={{
                background: `radial-gradient(120% 80% at 50% 100%, ${T.ink}E6 0%, transparent 60%)`,
              }}
              aria-hidden
            />

            {/* corner ornaments */}
            {[
              { top: 6, left: 6, rotate: 0 },
              { top: 6, right: 6, rotate: 90 },
              { bottom: 6, right: 6, rotate: 180 },
              { bottom: 6, left: 6, rotate: 270 },
            ].map((pos, idx) => (
              <div
                key={idx}
                className="absolute z-20 w-3 h-3 pointer-events-none"
                style={{
                  top: pos.top,
                  right: pos.right,
                  bottom: pos.bottom,
                  left: pos.left,
                  transform: `rotate(${pos.rotate}deg)`,
                }}
                aria-hidden
              >
                <svg viewBox="0 0 12 12" fill="none">
                  <path
                    d="M0 0 L12 0 L12 12"
                    stroke={T.gold}
                    strokeWidth="0.8"
                    opacity="0.6"
                  />
                  <circle cx="1" cy="1" r="0.8" fill={T.gold} opacity="0.8" />
                </svg>
              </div>
            ))}

            {/* discount wax seal */}
            {discount > 0 && (
              <motion.div
                className="absolute top-2.5 right-2.5 z-20 h-10 w-10 rounded-full flex items-center justify-center"
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.08 + 0.3,
                  ease: [0.34, 1.56, 0.64, 1],
                }}
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${T.goldBright}, ${T.gold} 70%, #8A6B3A 100%)`,
                  boxShadow: `0 3px 10px -2px rgba(184,147,90,0.6), inset 0 1px 0 ${T.goldLeaf}80, inset 0 -1px 0 #8A6B3A80`,
                }}
              >
                <div
                  className="h-[36px] w-[36px] rounded-full flex items-center justify-center"
                  style={{ border: `1px dashed ${T.ink}50` }}
                >
                  <span
                    className="text-[10px] font-bold"
                    style={{
                      color: T.ink,
                      fontFamily: "var(--font-fraunces), Georgia, serif",
                    }}
                  >
                    −{discount}
                  </span>
                </div>
              </motion.div>
            )}

            {/* hover CTA */}
            <motion.div
              className="absolute inset-x-2.5 bottom-2.5 z-20 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out"
              style={{ transform: "translateZ(25px)" }}
            >
              <div
                className="flex items-center justify-between px-2.5 py-2 rounded-sm"
                style={{
                  background: `${T.bone}F0`,
                  backdropFilter: "blur(12px)",
                  border: `0.5px solid ${T.gold}50`,
                }}
              >
                <span
                  className="text-[9px] tracking-[0.3em] uppercase"
                  style={{
                    color: T.ink,
                    fontFamily: "var(--font-fraunces), Georgia, serif",
                  }}
                >
                  View
                </span>
                <svg
                  width="12"
                  height="8"
                  viewBox="0 0 14 10"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M1 5 H13 M9 1 L13 5 L9 9"
                    stroke={T.gold}
                    strokeWidth="1"
                  />
                </svg>
              </div>
            </motion.div>
          </div>

          {/* meta */}
          <div
            className="mt-3 flex items-start justify-between gap-2"
            style={{ transform: "translateZ(15px)" }}
          >
            <div className="min-w-0 flex-1">
              <p
                className="text-[12px] leading-snug line-clamp-2"
                style={{
                  color: T.ink,
                  fontFamily: "var(--font-fraunces), Georgia, serif",
                }}
              >
                {p.name}
              </p>
            </div>
            <div className="text-right shrink-0">
              <div
                className="text-[13px] font-medium tabular-nums"
                style={{
                  color: T.ink,
                  fontFamily: "var(--font-fraunces), Georgia, serif",
                }}
              >
                ৳{price(p)}
              </div>
              {p.discountPrice && (
                <div
                  className="text-[9px] line-through tabular-nums"
                  style={{ color: T.inkSoft, opacity: 0.5 }}
                >
                  ৳{p.sellingPrice}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.article>
  );
}

/* ——————————————————————————————————————————————
   Main section
—————————————————————————————————————————————— */
export function FlashDeals({ products }: { products: Product[] }) {
  const deals = products
    .filter((p) => p.tags?.includes("flash") || p.discountPrice)
    .slice(0, 6);

  const { h, m, s, progress } = useCountdown(11);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  if (!deals.length) return null;

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{ background: T.bg }}
    >
      <Grain />
      <Dust />

      {/* radial washes */}
      <motion.div
        aria-hidden
        style={{ y: bgY }}
        className="pointer-events-none absolute -top-48 right-[-12%] h-[520px] w-[520px] rounded-full blur-3xl"
      >
        <div
          className="h-full w-full rounded-full"
          style={{
            background: `radial-gradient(closest-side, ${T.goldBright}35, transparent 70%)`,
          }}
        />
      </motion.div>
      <motion.div
        aria-hidden
        style={{ y: bgY }}
        className="pointer-events-none absolute -bottom-48 left-[-12%] h-[460px] w-[460px] rounded-full blur-3xl"
      >
        <div
          className="h-full w-full rounded-full"
          style={{
            background: `radial-gradient(closest-side, ${T.wine}25, transparent 70%)`,
          }}
        />
      </motion.div>

      {/* top rule */}
      <div
        className="relative h-px w-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${T.gold}50 20%, ${T.gold}50 80%, transparent)`,
        }}
      />

      <div className="container-x relative py-10 md:py-14">
        {/* header */}
        <ScrollReveal direction="up">
          <div className="flex flex-col items-center gap-5 mb-8">
            <div className="flex items-center gap-3">
              <span
                className="h-px w-10"
                style={{ background: T.gold, opacity: 0.5 }}
              />
              <span
                className="text-[9px] tracking-[0.4em] uppercase"
                style={{
                  color: T.gold,
                  fontFamily: "var(--font-fraunces), Georgia, serif",
                }}
              >
                Édition Limitée
              </span>
              <span
                className="h-px w-10"
                style={{ background: T.gold, opacity: 0.5 }}
              />
            </div>

            <h2
              className="relative inline-block text-[40px] sm:text-[56px] md:text-[72px] leading-[0.92] tracking-[-0.02em] text-center"
              style={{
                fontFamily: "var(--font-fraunces), Georgia, serif",
                fontWeight: 400,
                color: T.ink,
              }}
            >
              <span className="italic font-light">Flash</span>
              <span className="mx-2 sm:mx-3" style={{ color: T.gold }}>
                ❖
              </span>
              <span className="relative">
                Deals
                <motion.span
                  aria-hidden
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `linear-gradient(110deg, transparent 30%, ${T.goldBright} 50%, transparent 70%)`,
                    backgroundSize: "200% 100%",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                  animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
                  transition={{
                    duration: 4.5,
                    repeat: Infinity,
                    ease: "linear",
                    repeatDelay: 1.5,
                  }}
                >
                  Deals
                </motion.span>
              </span>
            </h2>

            <p
              className="max-w-sm text-center text-[12px] leading-relaxed"
              style={{
                color: T.inkSoft,
                fontFamily: "var(--font-fraunces), Georgia, serif",
              }}
            >
              A fleeting allocation of rare pieces at singular prices
            </p>
          </div>
        </ScrollReveal>

        {/* countdown */}
        <ScrollReveal direction="up">
          <div className="flex justify-center mb-8">
            <div className="relative flex items-center gap-2 sm:gap-3 px-6 sm:px-10 py-4 rounded-sm">
              <ProgressRing progress={progress} />
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Digit value={h} label="hrs" />
                <span
                  className="text-xl -mt-4"
                  style={{
                    color: T.gold,
                    fontFamily: "var(--font-fraunces), Georgia, serif",
                  }}
                >
                  :
                </span>
                <Digit value={m} label="min" />
                <span
                  className="text-xl -mt-4"
                  style={{
                    color: T.gold,
                    fontFamily: "var(--font-fraunces), Georgia, serif",
                  }}
                >
                  :
                </span>
                <Digit value={s} label="sec" />
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* fleuron */}
        <div className="flex justify-center mb-7">
          <Fleuron className="w-32 h-3.5" />
        </div>

        {/* grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-3 gap-y-10 md:gap-x-4">
          {deals.map((p, i) => (
            <TiltCard key={p._id} p={p} i={i} />
          ))}
        </div>

        {/* footer */}
        <div className="mt-12">
          <div className="flex justify-center mb-4">
            <Fleuron className="w-28 h-3" />
          </div>
          <div
            className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left"
            style={{
              color: T.inkSoft,
              fontFamily: "var(--font-fraunces), Georgia, serif",
            }}
          >
            <span className="text-[9px] tracking-[0.3em] uppercase">
              Complimentary shipping
            </span>
            <span
              className="text-[9px] tracking-[0.3em] uppercase"
              style={{ color: T.gold }}
            >
              ❖ Six pieces only ❖
            </span>
            <span className="text-[9px] tracking-[0.3em] uppercase">
              Authenticated
            </span>
          </div>
        </div>
      </div>

      {/* bottom rule */}
      <div
        className="relative h-px w-full mt-2"
        style={{
          background: `linear-gradient(90deg, transparent, ${T.gold}50 20%, ${T.gold}50 80%, transparent)`,
        }}
      />
    </section>
  );
}