"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { EASE } from "@/lib/motion";

const columns = [
  {
    title: "Shop",
    links: [
      { href: "/products", label: "All products" },
      { href: "/products?sort=newest", label: "New arrivals" },
      { href: "/track", label: "Track an order" },
      { href: "/cart", label: "Your cart" },
    ],
  },
  {
    title: "Help",
    links: [
      { href: "/faq", label: "Questions" },
      { href: "/contact", label: "Contact us" },
      { href: "/shipping-policy", label: "Shipping" },
      { href: "/return-policy", label: "Returns" },
    ],
  },
  {
    title: "About",
    links: [
      { href: "/about", label: "Our story" },
      { href: "/privacy-policy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

const social = [
  { href: "https://facebook.com", label: "Facebook" },
  { href: "https://instagram.com", label: "Instagram" },
  { href: "https://wa.me/8801700000000", label: "WhatsApp" },
  { href: "https://tiktok.com", label: "TikTok" },
];

/* One sequence, same grammar as the benefits section. */
const root: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
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

/* Underline that draws in on hover and keyboard focus. */
const linkClass =
  "relative inline-block rounded-sm text-[14px] text-[#ece7da]/60 transition-colors duration-300 hover:text-[#ece7da] focus-visible:text-[#ece7da] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#d9a93f] " +
  "after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-[#d9a93f] after:transition-transform after:duration-500 after:ease-out hover:after:scale-x-100 focus-visible:after:scale-x-100";

export function Footer() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  if (pathname?.startsWith("/admin")) return null;

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    // TODO: send `email` to your newsletter endpoint here.
    setDone(true);
  }

  return (
    <footer className="bg-[#0b1812] text-[#ece7da]">
      <div className="container-x pt-16 md:pt-24">
        <motion.div
          variants={root}
          initial={reduce ? "show" : "hidden"}
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          {/* Newsletter */}
          <div className="grid gap-10 md:grid-cols-12 md:items-end">
            <motion.div variants={settle} className="md:col-span-6">
              <h3
                className="text-[1.75rem] md:text-[2.5rem] font-normal leading-[1.1] tracking-[-0.02em] text-balance"
                style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
              >
                Be the first to see what&rsquo;s new.
              </h3>
              <p className="mt-3 max-w-[40ch] text-[14px] leading-relaxed text-[#ece7da]/55">
                One email when new stock lands. Nothing in between.
              </p>
            </motion.div>

            <motion.div
              variants={settle}
              className="md:col-span-5 md:col-start-8 min-h-[56px]"
            >
              <AnimatePresence mode="wait" initial={false}>
                {done ? (
                  <motion.p
                    key="thanks"
                    role="status"
                    initial={reduce ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: EASE.expo }}
                    className="text-[15px] leading-relaxed text-[#ece7da]/80"
                  >
                    Added. We&rsquo;ll write to{" "}
                    <span className="text-[#d9a93f]">{email}</span> when
                    something new arrives.
                  </motion.p>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={onSubmit}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3 }}
                    className="group relative flex items-center gap-4 border-b border-[#ece7da]/25 pb-3"
                  >
                    <label htmlFor="footer-email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="footer-email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      className="min-w-0 flex-1 bg-transparent text-[16px] text-[#ece7da] placeholder:text-[#ece7da]/35 outline-none"
                    />
                    <button
                      type="submit"
                      className="shrink-0 rounded-[3px] bg-[#ece7da] px-5 py-2 text-[13px] font-medium text-[#0b1812] transition-colors duration-300 hover:bg-[#d9a93f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d9a93f]"
                    >
                      Subscribe
                    </button>
                    {/* Gold line that fills the underline while typing */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -bottom-px left-0 h-px w-full origin-left scale-x-0 bg-[#d9a93f] transition-transform duration-700 ease-out group-focus-within:scale-x-100"
                    />
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          <motion.div
            aria-hidden
            variants={rule}
            className="mt-16 md:mt-20 h-px origin-left bg-[#d9a93f]/70"
          />

          {/* Brand + links */}
          <div className="grid gap-12 py-12 md:grid-cols-12 md:py-16">
            <motion.div variants={settle} className="md:col-span-5">
              <Link
                href="/"
                className="inline-block rounded-sm text-[1.6rem] leading-none tracking-[-0.01em] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#d9a93f]"
                style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
              >
                BD Store
              </Link>
              <p className="mt-4 max-w-[34ch] text-[14px] leading-relaxed text-[#ece7da]/55">
                Everyday products at direct prices, with cash on delivery to
                every district in Bangladesh.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 md:col-span-7 md:col-start-6">
              {columns.map((col) => (
                <motion.nav
                  key={col.title}
                  variants={settle}
                  aria-label={col.title}
                >
                  <h4
                    className="mb-5 text-[1.05rem] font-normal text-[#ece7da]"
                    style={{
                      fontFamily: "var(--font-fraunces), Georgia, serif",
                    }}
                  >
                    {col.title}
                  </h4>
                  <ul className="space-y-3">
                    {col.links.map((l) => (
                      <li key={l.href}>
                        <Link href={l.href} className={linkClass}>
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.nav>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom row */}
      <div className="border-t border-[#ece7da]/10">
        <div className="container-x flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between">
          <p className="text-[13px] text-[#ece7da]/45">
            &copy; {new Date().getFullYear()} BD Store. Made in Bangladesh.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {social.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass.replace("text-[14px]", "text-[13px]")}
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}