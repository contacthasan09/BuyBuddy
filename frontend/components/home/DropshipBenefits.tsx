"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import {
  Truck,
  ShieldCheck,
  BadgePercent,
  Headphones,
  Package,
  MapPin,
} from "lucide-react";
import { EASE } from "@/lib/motion";

const items = [
  {
    icon: Truck,
    title: "Cash on delivery",
    desc: "Pay the courier when your parcel arrives. Nothing upfront.",
  },
  {
    icon: Package,
    title: "Same-day dispatch",
    desc: "Orders placed before the cut-off leave our Dhaka desk today.",
  },
  {
    icon: ShieldCheck,
    title: "7-day returns",
    desc: "Wrong size or not as pictured? Exchange it, no arguments.",
  },
  {
    icon: BadgePercent,
    title: "Direct pricing",
    desc: "We buy at source, so the price you see has no middleman on it.",
  },
  {
    icon: MapPin,
    title: "All 64 districts",
    desc: "Every parcel is tracked from our door to yours.",
  },
  {
    icon: Headphones,
    title: "Real people on support",
    desc: "Message us and a person writes back, usually within the hour.",
  },
];

/* One orchestrated sequence: rule draws, header settles, cells follow. */
const root: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const rule: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 1.4, ease: EASE.expo } },
};

const settle: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE.expo },
  },
};

function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(to);

  useEffect(() => {
    if (reduce) return setValue(to);
    if (!inView) return setValue(0);
    const controls = animate(0, to, {
      duration: 2,
      delay: 0.5,
      ease: EASE.expo,
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduce, to]);

  return (
    <span ref={ref} className="tabular-nums">
      {value.toLocaleString("en-US")}
    </span>
  );
}

export function DropshipBenefits() {
  const reduce = useReducedMotion();

  return (
    <section
      aria-labelledby="benefits-heading"
      className="bg-[#10201a] text-[#ece7da]"
    >
      <div className="container-x py-16 md:py-24">
        <motion.div
          variants={root}
          initial={reduce ? "show" : "hidden"}
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Header */}
          <div className="grid gap-8 md:grid-cols-12 md:items-end">
            <motion.h2
              id="benefits-heading"
              variants={settle}
              className="md:col-span-7 text-[2rem] md:text-[3.25rem] font-normal tracking-[-0.02em] leading-[1.08] text-balance"
              style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
            >
              Buy from us the way you&rsquo;d buy from a shop you know.
            </motion.h2>

            <motion.p
              variants={settle}
              className="md:col-span-4 md:col-start-9 text-[15px] leading-relaxed text-[#ece7da]/60"
            >
              <CountUp to={8500} />+ people across Bangladesh have ordered
              from us. These are the six things they rely on.
            </motion.p>
          </div>

          {/* The one memorable gesture: a single hairline that draws across */}
          <motion.div
            aria-hidden
            variants={rule}
            className="mt-14 md:mt-20 h-px origin-left bg-[#d9a93f]"
          />

          {/* Benefits */}
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-0">
            {items.map((item) => (
              <motion.li
                key={item.title}
                variants={settle}
                className="group relative border-b border-[#ece7da]/10 py-8 md:py-10 lg:[&:nth-last-child(-n+3)]:border-b-0 sm:[&:nth-last-child(-n+2)]:max-lg:border-b-0"
              >
                <div className="flex items-start gap-5">
                  <item.icon
                    className="mt-0.5 h-[22px] w-[22px] shrink-0 text-[#d9a93f] transition-transform duration-500 ease-out group-hover:-translate-y-0.5"
                    strokeWidth={1.25}
                    aria-hidden
                  />
                  <div>
                    <h3
                      className="text-[1.2rem] md:text-[1.3rem] font-normal leading-tight tracking-[-0.01em]"
                      style={{
                        fontFamily: "var(--font-fraunces), Georgia, serif",
                      }}
                    >
                      {item.title}
                    </h3>
                    <p className="mt-2 max-w-[34ch] text-[14px] leading-relaxed text-[#ece7da]/55 transition-colors duration-500 group-hover:text-[#ece7da]/80">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}