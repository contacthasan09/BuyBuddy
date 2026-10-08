"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, MessageCircle } from "lucide-react";
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
   SVG noise — organic paper grain
—————————————————————————————————————————————— */
function Grain() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07] mix-blend-multiply"
    >
      <filter id="grain-faq">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain-faq)" />
    </svg>
  );
}

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

const FAQS: FAQ[] = [
  {
    category: "Acquisitions",
    question: "How long does delivery take?",
    answer:
      "Typically 2–4 business days across Bangladesh. Inside Dhaka metro, most orders arrive the following day. Remote upazilas may require 4–5 days.",
  },
  {
    category: "Acquisitions",
    question: "Do I need to create an account to order?",
    answer:
      "No. We offer a seamless guest checkout. You only need to provide your name, contact number, and delivery address. No passwords or emails required.",
  },
  {
    category: "Acquisitions",
    question: "Can I cancel my order after placing it?",
    answer:
      "Yes. You may cancel within 2 hours of placing the order, prior to dispatch. Simply message our concierge on WhatsApp with your Order ID.",
  },
  {
    category: "Payment",
    question: "Do you offer Cash on Delivery?",
    answer:
      "Yes. All orders are fulfilled via Cash on Delivery. You settle the payment securely with the courier upon arrival at your door.",
  },
  {
    category: "Payment",
    question: "Do you accept bKash or Nagad?",
    answer:
      "Cash on Delivery is our exclusive payment method at present. Digital payment options are being carefully integrated for the future.",
  },
  {
    category: "Payment",
    question: "What delivery charges apply?",
    answer:
      "Dhaka ৳60, Chattogram ৳100, and other districts ৳120–130. Complimentary delivery is provided on all orders exceeding ৳2,000.",
  },
  {
    category: "Delivery",
    question: "How can I track my order?",
    answer:
      "Navigate to our Track Order page and enter your Order ID and contact number. You will be presented with a live, detailed timeline of your courier's progress.",
  },
  {
    category: "Delivery",
    question: "What if I miss the courier call?",
    answer:
      "Our courier will always call prior to arrival. Should you miss the call, we will gracefully arrange one additional delivery attempt at no extra cost.",
  },
  {
    category: "Returns",
    question: "Can I return a product?",
    answer:
      "Yes. We offer a 7-day return privilege on unused products in their original packaging. Contact us on WhatsApp to arrange a seamless pickup.",
  },
  {
    category: "Returns",
    question: "What if I receive a damaged product?",
    answer:
      "Please contact us immediately on WhatsApp with a photograph of the item. We will arrange a replacement at no cost, typically within 2–3 days.",
  },
  {
    category: "Returns",
    question: "How long do refunds take?",
    answer:
      "Once we receive and inspect the returned product, refunds are processed within 3–5 business days via bKash, Nagad, or direct bank transfer.",
  },
];

const CATEGORIES = ["All", "Acquisitions", "Payment", "Delivery", "Returns"];

export default function FAQPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filtered = useMemo(() => {
    return FAQS.filter((faq) => {
      if (activeCategory !== "All" && faq.category !== activeCategory) {
        return false;
      }
      if (search) {
        const q = search.toLowerCase();
        return (
          faq.question.toLowerCase().includes(q) ||
          faq.answer.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [search, activeCategory]);

  return (
    <div className="relative min-h-screen" style={{ background: T.bg, color: T.ink }}>
      <Grain />

      {/* Header */}
      <section className="relative border-b" style={{ borderColor: `${T.gold}30` }}>
        <div className="container-x py-20 md:py-28 max-w-4xl relative z-10">
          <ScrollReveal direction="up">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-8" style={{ background: T.gold, opacity: 0.5 }} />
              <p
                className="text-[9px] tracking-[0.4em] uppercase"
                style={{ color: T.gold, fontFamily: "var(--font-fraunces), Georgia, serif" }}
              >
                Concierge & Support
              </p>
            </div>

            <h1
              className="mb-8 leading-[0.92] tracking-[-0.03em]"
              style={{
                fontFamily: "var(--font-fraunces), Georgia, serif",
                fontSize: "clamp(40px, 6vw, 72px)",
                fontWeight: 400,
                color: T.ink,
              }}
            >
              Frequently asked{" "}
              <span className="italic font-light" style={{ color: T.wine }}>
                questions.
              </span>
            </h1>

            <p
              className="text-lg max-w-2xl leading-relaxed"
              style={{
                fontFamily: "var(--font-fraunces), Georgia, serif",
                color: T.inkSoft,
                lineHeight: 1.75,
              }}
            >
              Everything you need to know about our acquisitions, delivery protocols, 
              payment methods, and return privileges.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="container-x py-16 md:py-24 max-w-3xl relative z-10">
        {/* Search + filters */}
        <div className="space-y-5 mb-12">
          <div className="relative">
            <Search 
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" 
              style={{ color: T.gold }} 
              strokeWidth={1.5} 
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search inquiries..."
              className="w-full pl-11 pr-4 py-3.5 rounded-sm outline-none transition-all duration-300"
              style={{
                color: T.ink,
                fontFamily: "var(--font-fraunces), Georgia, serif",
                fontSize: "14px",
                background: T.bone,
                border: `1px solid ${T.gold}40`,
              }}
              onFocus={(e) => {
                e.target.style.borderColor = T.gold;
                e.target.style.boxShadow = `0 0 0 2px ${T.gold}20`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = `${T.gold}40`;
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {CATEGORIES.map((cat) => (
              <motion.button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                whileTap={{ scale: 0.96 }}
                className="flex-shrink-0 px-5 py-2.5 rounded-sm text-[10px] tracking-[0.25em] uppercase font-medium transition-all duration-300"
                style={{
                  background: activeCategory === cat ? T.ink : "transparent",
                  color: activeCategory === cat ? T.goldLeaf : T.inkSoft,
                  border: `1px solid ${activeCategory === cat ? T.gold : `${T.gold}40`}`,
                  fontFamily: "var(--font-fraunces), Georgia, serif",
                }}
                onMouseEnter={(e) => {
                  if (activeCategory !== cat) {
                    e.currentTarget.style.borderColor = T.gold;
                    e.currentTarget.style.color = T.ink;
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeCategory !== cat) {
                    e.currentTarget.style.borderColor = `${T.gold}40`;
                    e.currentTarget.style.color = T.inkSoft;
                  }
                }}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </div>

        {/* FAQs */}
        {filtered.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 rounded-sm relative"
            style={{
              background: T.bone,
              border: `1px solid ${T.gold}30`,
            }}
          >
            <div
              className="absolute inset-2 pointer-events-none rounded-sm"
              style={{ border: `0.5px solid ${T.gold}`, opacity: 0.2 }}
              aria-hidden
            />
            <p 
              className="relative z-10 text-[13px]"
              style={{ color: T.inkSoft, fontFamily: "var(--font-fraunces), Georgia, serif" }}
            >
              No inquiries match your search.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {filtered.map((faq, i) => {
              const open = openIndex === i;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.4, delay: i * 0.04, ease: EASE.expo }}
                  className="relative rounded-sm overflow-hidden"
                  style={{
                    background: open ? T.bone : "transparent",
                    border: `1px solid ${open ? T.gold : `${T.gold}25`}`,
                    transition: "border-color 0.3s ease, background 0.3s ease",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(open ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left transition-colors duration-300"
                    onMouseEnter={(e) => {
                      if (!open) e.currentTarget.style.background = `${T.bone}60`;
                    }}
                    onMouseLeave={(e) => {
                      if (!open) e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <span
                      className="text-[14px] font-medium pr-2 leading-snug"
                      style={{
                        color: T.ink,
                        fontFamily: "var(--font-fraunces), Georgia, serif",
                      }}
                    >
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: open ? 180 : 0 }}
                      transition={{ duration: 0.4, ease: EASE.expo }}
                      className="w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0"
                      style={{
                        border: `1px solid ${T.gold}30`,
                        background: open ? `${T.gold}15` : "transparent",
                      }}
                    >
                      <ChevronDown className="w-4 h-4" strokeWidth={1.5} style={{ color: T.gold }} />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: EASE.expo }}
                        className="overflow-hidden"
                      >
                        <div 
                          className="px-6 pb-6 pt-0"
                          style={{ borderTop: `1px dashed ${T.gold}30` }}
                        >
                          <p 
                            className="pt-5 text-[14px] leading-relaxed"
                            style={{ color: T.inkSoft, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                          >
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Contact CTA */}
        <ScrollReveal direction="up">
          <div 
            className="mt-16 p-10 md:p-14 rounded-sm relative text-center overflow-hidden"
            style={{
              background: T.ink,
              border: `1px solid ${T.gold}30`,
              boxShadow: `0 24px 64px -24px rgba(28,22,18,0.5)`,
            }}
          >
            {/* Subtle gold glow */}
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(60% 80% at 50% 100%, ${T.gold}15, transparent 70%)`,
              }}
            />

            {/* Inner gold hairline */}
            <div
              className="absolute inset-3 pointer-events-none rounded-sm"
              style={{ border: `0.5px solid ${T.gold}`, opacity: 0.2 }}
              aria-hidden
            />

            <div className="relative z-10">
              <h2
                className="mb-4 leading-[0.95] tracking-[-0.02em]"
                style={{
                  fontFamily: "var(--font-fraunces), Georgia, serif",
                  fontSize: "clamp(24px, 4vw, 36px)",
                  fontWeight: 400,
                  color: T.bone,
                }}
              >
                Still have <span className="italic font-light" style={{ color: T.goldBright }}>inquiries?</span>
              </h2>
              <p
                className="max-w-md mx-auto mb-8"
                style={{
                  fontFamily: "var(--font-fraunces), Georgia, serif",
                  fontSize: "14px",
                  lineHeight: 1.7,
                  color: T.inkSoft,
                }}
              >
                Message our concierge on WhatsApp. We typically respond within the hour.
              </p>
              <a
                href="https://wa.me/8801700000000"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-sm transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-8px_rgba(184,147,90,0.6)]"
                style={{
                  background: `linear-gradient(135deg, ${T.goldBright}, ${T.gold})`,
                  color: T.ink,
                  fontFamily: "var(--font-fraunces), Georgia, serif",
                  fontSize: "11px",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  boxShadow: `0 8px 24px -8px rgba(184,147,90,0.4)`,
                }}
              >
                <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
                Contact on WhatsApp
                <motion.svg
                  width="14"
                  height="10"
                  viewBox="0 0 14 10"
                  fill="none"
                  className="group-hover:translate-x-1 transition-transform duration-300"
                  aria-hidden
                >
                  <path d="M1 5 H13 M9 1 L13 5 L9 9" stroke="currentColor" strokeWidth="1.5" />
                </motion.svg>
              </a>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}