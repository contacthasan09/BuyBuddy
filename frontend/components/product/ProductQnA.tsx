"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, ChevronDown, HelpCircle } from "lucide-react";
import { fadeUp, EASE } from "@/lib/motion";
import { useToast } from "@/components/providers/ToastProvider";

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

interface QA {
  id: string;
  question: string;
  answer?: string;
  askedBy: string;
  date: string;
}

const PLACEHOLDER_QA: QA[] = [
  {
    id: "1",
    question: "Is this piece covered by warranty?",
    answer:
      "Yes, all our curated pieces come with a 6-month manufacturer warranty. Please contact our concierge if you need to make a claim.",
    askedBy: "Verified Collector",
    date: "Oct 15, 2026",
  },
  {
    id: "2",
    question: "What is the return policy?",
    answer:
      "We offer a 7-day return window on all unused items in their original packaging. Please refer to our Atelier return policy for full details.",
    askedBy: "Verified Collector",
    date: "Oct 10, 2026",
  },
];

interface ProductQnAProps {
  productId: string;
}

export function ProductQnA({ productId }: ProductQnAProps) {
  const { toast } = useToast();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [showAskForm, setShowAskForm] = useState(false);
  const [question, setQuestion] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    toast("Your inquiry has been submitted. Our concierge will respond shortly.", "success");
    setQuestion("");
    setShowAskForm(false);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="h-px w-8" style={{ background: T.gold, opacity: 0.5 }} />
            <p
              className="text-[9px] tracking-[0.4em] uppercase"
              style={{ color: T.gold, fontFamily: "var(--font-fraunces), Georgia, serif" }}
            >
              Inquiries
            </p>
          </div>
          <h2
            className="leading-[0.95] tracking-[-0.02em]"
            style={{
              color: T.ink,
              fontFamily: "var(--font-fraunces), Georgia, serif",
              fontSize: "clamp(28px, 3vw, 36px)",
              fontWeight: 400,
            }}
          >
            Ask & <span className="italic font-light" style={{ color: T.wine }}>answer.</span>
          </h2>
        </div>

        <motion.button
          type="button"
          onClick={() => setShowAskForm((v) => !v)}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-sm transition-all duration-300"
          style={{
            border: `1px solid ${T.gold}50`,
            color: T.ink,
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontSize: "10px",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            fontWeight: 500,
            background: showAskForm ? `${T.gold}15` : "transparent",
          }}
        >
          <HelpCircle className="w-3.5 h-3.5" strokeWidth={1.5} />
          Ask a question
        </motion.button>
      </div>

      {/* Ask Form */}
      <AnimatePresence>
        {showAskForm && (
          <motion.form
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: 32 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.4, ease: EASE.expo }}
            onSubmit={handleSubmit}
            className="overflow-hidden"
          >
            <div
              className="p-6 rounded-sm"
              style={{
                background: T.bone,
                border: `1px solid ${T.gold}30`,
              }}
            >
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Inquire about sizing, delivery, provenance, or any other detail..."
                rows={3}
                className="w-full px-4 py-3 rounded-sm outline-none resize-none transition-all duration-300"
                style={{
                  color: T.ink,
                  fontFamily: "var(--font-fraunces), Georgia, serif",
                  fontSize: "14px",
                  background: "transparent",
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
              <div className="flex gap-3 mt-4">
                <motion.button
                  type="submit"
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 rounded-sm transition-colors duration-300"
                  style={{
                    background: T.ink,
                    color: T.goldLeaf,
                    border: `1px solid ${T.gold}60`,
                    fontFamily: "var(--font-fraunces), Georgia, serif",
                    fontSize: "10px",
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    fontWeight: 500,
                  }}
                >
                  Submit inquiry
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => setShowAskForm(false)}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 rounded-sm transition-colors duration-300"
                  style={{
                    color: T.inkSoft,
                    fontFamily: "var(--font-fraunces), Georgia, serif",
                    fontSize: "10px",
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    fontWeight: 500,
                    border: `1px solid transparent`,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${T.gold}30`)}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "transparent")}
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* QA List */}
      <div className="space-y-3">
        {PLACEHOLDER_QA.map((qa, i) => {
          const open = openIndex === i;
          return (
            <motion.div
              key={qa.id}
              variants={fadeUp}
              className="rounded-sm overflow-hidden"
              style={{
                border: `1px solid ${open ? T.gold : `${T.gold}25`}`,
                background: open ? T.bone : "transparent",
                transition: "border-color 0.3s ease, background 0.3s ease",
              }}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : i)}
                className="w-full flex items-start justify-between gap-4 p-5 text-left transition-colors duration-300"
                onMouseEnter={(e) => {
                  if (!open) e.currentTarget.style.background = `${T.bone}60`;
                }}
                onMouseLeave={(e) => {
                  if (!open) e.currentTarget.style.background = "transparent";
                }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3 mb-2">
                    <MessageSquare
                      className="w-4 h-4 flex-shrink-0 mt-0.5"
                      strokeWidth={1.5}
                      style={{ color: T.gold }}
                    />
                    <p
                      className="text-[14px] leading-snug"
                      style={{
                        color: T.ink,
                        fontFamily: "var(--font-fraunces), Georgia, serif",
                        fontWeight: 500,
                      }}
                    >
                      {qa.question}
                    </p>
                  </div>
                  <p
                    className="text-[10px] tracking-[0.2em] uppercase"
                    style={{ color: T.inkSoft, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                  >
                    {qa.askedBy} · {qa.date}
                  </p>
                </div>

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
                {open && qa.answer && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE.expo }}
                    className="overflow-hidden"
                  >
                    <div
                      className="px-5 pb-5 pt-0"
                      style={{ borderTop: `1px dashed ${T.gold}30` }}
                    >
                      <p
                        className="text-[10px] tracking-[0.25em] uppercase font-semibold mb-2 pt-4"
                        style={{ color: T.wine, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                      >
                        Response from Maison
                      </p>
                      <p
                        className="text-[14px] leading-relaxed"
                        style={{ color: T.inkSoft, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                      >
                        {qa.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}