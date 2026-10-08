"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  MessageSquare,
  ThumbsUp,
  Loader2,
  Check,
  ShieldCheck,
} from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/components/providers/ToastProvider";
import { formatDateTime } from "@/lib/utils";
import { fadeUp, staggerFast, viewportOnce, EASE } from "@/lib/motion";

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

interface Review {
  _id: string;
  customerName: string;
  rating: number;
  title?: string;
  comment: string;
  images: string[];
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: string;
}

interface Summary {
  average: number;
  total: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

interface ReviewsSectionProps {
  productId: string;
  productName: string;
}

export function ReviewsSection({
  productId,
  productName,
}: ReviewsSectionProps) {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filterRating, setFilterRating] = useState<number | null>(null);

  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    rating: 5,
    title: "",
    comment: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const load = async (rating?: number | null) => {
    setLoading(true);
    try {
      const res = await api.getProductReviews(productId, {
        limit: 20,
        sort: "newest",
        ...(rating ? { rating } : {}),
      });
      setReviews(res?.items || []);
      setSummary(res?.summary || null);
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) load(filterRating);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, filterRating]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customerName.trim() || !form.customerPhone.trim()) {
      toast("Name and phone are required", "error");
      return;
    }
    if (form.comment.trim().length < 4) {
      toast("Please write a longer review", "error");
      return;
    }

    setSubmitting(true);
    try {
      await api.createReview({
        productId,
        customerName: form.customerName.trim(),
        customerPhone: form.customerPhone.trim(),
        rating: form.rating,
        title: form.title.trim() || undefined,
        comment: form.comment.trim(),
        images: [],
      });
      toast("Thank you! Your review has been posted.", "success");
      setShowForm(false);
      setForm({
        customerName: "",
        customerPhone: "",
        rating: 5,
        title: "",
        comment: "",
      });
      load(filterRating);
    } catch (err: any) {
      toast(err?.message || "Failed to submit review", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkHelpful = async (reviewId: string) => {
    try {
      await api.markReviewHelpful(reviewId);
      setReviews((prev) =>
        prev.map((r) =>
          r._id === reviewId
            ? { ...r, helpfulCount: r.helpfulCount + 1 }
            : r
        )
      );
    } catch {}
  };

  const distributionPercent = useMemo(() => {
    if (!summary || summary.total === 0) return { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    return {
      5: (summary.distribution[5] / summary.total) * 100,
      4: (summary.distribution[4] / summary.total) * 100,
      3: (summary.distribution[3] / summary.total) * 100,
      2: (summary.distribution[2] / summary.total) * 100,
      1: (summary.distribution[1] / summary.total) * 100,
    };
  }, [summary]);

  return (
    <div>
      {/* ═══════════════════════════════════════════════
          Header
         ═══════════════════════════════════════════════ */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="h-px w-8" style={{ background: T.gold, opacity: 0.5 }} />
            <p
              className="text-[9px] tracking-[0.4em] uppercase"
              style={{ color: T.gold, fontFamily: "var(--font-fraunces), Georgia, serif" }}
            >
              Testimonials
            </p>
          </div>
          <h2
            className="leading-[0.95] tracking-[-0.02em]"
            style={{
              color: T.ink,
              fontFamily: "var(--font-fraunces), Georgia, serif",
              fontSize: "clamp(28px, 3vw, 40px)",
              fontWeight: 400,
            }}
          >
            What collectors <span className="italic font-light" style={{ color: T.wine }}>say.</span>
          </h2>
        </div>

        <motion.button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-sm transition-all duration-300 self-start md:self-auto"
          style={{
            border: `1px solid ${T.gold}50`,
            color: T.ink,
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontSize: "10px",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            fontWeight: 500,
            background: showForm ? `${T.gold}15` : "transparent",
          }}
        >
          <MessageSquare className="w-3.5 h-3.5" strokeWidth={1.5} />
          Write a review
        </motion.button>
      </div>

      {/* ═══════════════════════════════════════════════
          Summary + Distribution
         ═══════════════════════════════════════════════ */}
      {summary && summary.total > 0 && (
        <div
          className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8 md:gap-12 mb-12 p-6 md:p-8 rounded-sm relative overflow-hidden"
          style={{
            background: T.bone,
            border: `1px solid ${T.gold}30`,
            boxShadow: `0 1px 0 ${T.gold}20`,
          }}
        >
          {/* Inner gold hairline */}
          <div
            className="absolute inset-2 pointer-events-none rounded-sm"
            style={{ border: `0.5px solid ${T.gold}`, opacity: 0.2 }}
            aria-hidden
          />

          {/* Big average */}
          <div className="relative z-10 text-center md:text-left md:border-r md:pr-10" style={{ borderColor: `${T.gold}30` }}>
            <p
              className="mb-3 tabular-nums"
              style={{
                color: T.ink,
                fontFamily: "var(--font-fraunces), Georgia, serif",
                fontSize: "clamp(48px, 6vw, 64px)",
                fontWeight: 400,
                lineHeight: 1,
              }}
            >
              {summary.average.toFixed(1)}
            </p>
            <div className="flex items-center justify-center md:justify-start gap-0.5 mb-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className="w-4 h-4"
                  style={{
                    fill: i <= Math.round(summary.average) ? T.goldBright : "transparent",
                    color: i <= Math.round(summary.average) ? T.gold : `${T.inkSoft}30`,
                  }}
                  strokeWidth={1.5}
                />
              ))}
            </div>
            <p
              className="text-[10px] tracking-[0.2em] uppercase"
              style={{ color: T.inkSoft, fontFamily: "var(--font-fraunces), Georgia, serif" }}
            >
              Based on {summary.total} review{summary.total !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Distribution bars */}
          <div className="relative z-10 space-y-3">
            {([5, 4, 3, 2, 1] as const).map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => setFilterRating(filterRating === rating ? null : rating)}
                className={`w-full flex items-center gap-3 text-left transition-all duration-300 group ${
                  filterRating && filterRating !== rating ? "opacity-40" : "opacity-100"
                }`}
              >
                <span
                  className="text-[10px] tracking-[0.15em] w-8"
                  style={{ color: T.inkSoft, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                >
                  {rating}★
                </span>
                <div
                  className="flex-1 h-1.5 rounded-sm overflow-hidden"
                  style={{ background: `${T.gold}20` }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${distributionPercent[rating]}%` }}
                    transition={{ duration: 0.8, ease: EASE.expo, delay: (5 - rating) * 0.05 }}
                    className="h-full rounded-sm"
                    style={{ background: T.gold }}
                  />
                </div>
                <span
                  className="text-[10px] tracking-[0.15em] w-8 text-right tabular-nums"
                  style={{ color: T.inkSoft, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                >
                  {summary.distribution[rating]}
                </span>
              </button>
            ))}

            {filterRating && (
              <button
                type="button"
                onClick={() => setFilterRating(null)}
                className="text-[10px] tracking-[0.2em] uppercase mt-2 transition-colors hover:text-[color:var(--wine)]"
                style={{ color: T.wine, fontFamily: "var(--font-fraunces), Georgia, serif" }}
              >
                Clear filter
              </button>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════
          Write review form
         ═══════════════════════════════════════════════ */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: 48 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.4, ease: EASE.expo }}
            onSubmit={handleSubmit}
            className="overflow-hidden"
          >
            <div
              className="p-6 md:p-8 rounded-sm relative"
              style={{
                background: T.bone,
                border: `1px solid ${T.gold}30`,
              }}
            >
              {/* Inner gold hairline */}
              <div
                className="absolute inset-2 pointer-events-none rounded-sm"
                style={{ border: `0.5px solid ${T.gold}`, opacity: 0.2 }}
                aria-hidden
              />

              <div className="relative z-10 space-y-6">
                <h3
                  className="leading-[0.95] tracking-[-0.02em]"
                  style={{
                    color: T.ink,
                    fontFamily: "var(--font-fraunces), Georgia, serif",
                    fontSize: "20px",
                    fontWeight: 400,
                  }}
                >
                  Share your experience with <span className="italic" style={{ color: T.wine }}>{productName}</span>
                </h3>

                {/* Rating picker */}
                <div>
                  <label
                    className="block mb-3"
                    style={{
                      color: T.inkSoft,
                      fontFamily: "var(--font-fraunces), Georgia, serif",
                      fontSize: "9px",
                      letterSpacing: "0.35em",
                      textTransform: "uppercase",
                      fontWeight: 500,
                    }}
                  >
                    Your rating *
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <motion.button
                        key={i}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, rating: i }))}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-9 h-9 rounded-sm flex items-center justify-center transition-colors"
                        style={{
                          background: i <= form.rating ? `${T.gold}15` : "transparent",
                        }}
                        aria-label={`${i} star${i !== 1 ? "s" : ""}`}
                      >
                        <Star
                          className="w-5 h-5 transition-colors"
                          strokeWidth={1.5}
                          style={{
                            fill: i <= form.rating ? T.goldBright : "transparent",
                            color: i <= form.rating ? T.gold : `${T.inkSoft}40`,
                          }}
                        />
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Name + phone */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      className="block mb-2"
                      style={{
                        color: T.inkSoft,
                        fontFamily: "var(--font-fraunces), Georgia, serif",
                        fontSize: "9px",
                        letterSpacing: "0.35em",
                        textTransform: "uppercase",
                        fontWeight: 500,
                      }}
                    >
                      Your name *
                    </label>
                    <input
                      type="text"
                      value={form.customerName}
                      onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))}
                      placeholder="e.g., Rahim Ahmed"
                      required
                      className="w-full px-4 py-3 rounded-sm outline-none transition-all duration-300"
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
                  </div>
                  <div>
                    <label
                      className="block mb-2"
                      style={{
                        color: T.inkSoft,
                        fontFamily: "var(--font-fraunces), Georgia, serif",
                        fontSize: "9px",
                        letterSpacing: "0.35em",
                        textTransform: "uppercase",
                        fontWeight: 500,
                      }}
                    >
                      Phone *
                    </label>
                    <input
                      type="tel"
                      value={form.customerPhone}
                      onChange={(e) => setForm((f) => ({ ...f, customerPhone: e.target.value }))}
                      placeholder="e.g., 01712345678"
                      required
                      className="w-full px-4 py-3 rounded-sm outline-none transition-all duration-300"
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
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label
                    className="block mb-2"
                    style={{
                      color: T.inkSoft,
                      fontFamily: "var(--font-fraunces), Georgia, serif",
                      fontSize: "9px",
                      letterSpacing: "0.35em",
                      textTransform: "uppercase",
                      fontWeight: 500,
                    }}
                  >
                    Title (optional)
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="e.g., Exceptional quality"
                    className="w-full px-4 py-3 rounded-sm outline-none transition-all duration-300"
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
                </div>

                {/* Comment */}
                <div>
                  <label
                    className="block mb-2"
                    style={{
                      color: T.inkSoft,
                      fontFamily: "var(--font-fraunces), Georgia, serif",
                      fontSize: "9px",
                      letterSpacing: "0.35em",
                      textTransform: "uppercase",
                      fontWeight: 500,
                    }}
                  >
                    Your review *
                  </label>
                  <textarea
                    value={form.comment}
                    onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
                    rows={4}
                    placeholder="Share the details of your experience with this piece..."
                    required
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
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <motion.button
                    type="submit"
                    disabled={submitting}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-sm transition-all duration-300 disabled:opacity-60"
                    style={{
                      background: T.ink,
                      border: `1px solid ${T.gold}60`,
                      color: T.goldLeaf,
                      fontFamily: "var(--font-fraunces), Georgia, serif",
                      fontSize: "10px",
                      letterSpacing: "0.25em",
                      textTransform: "uppercase",
                      fontWeight: 500,
                    }}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" strokeWidth={1.5} />
                        Submit review
                      </>
                    )}
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => setShowForm(false)}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center px-6 py-3 rounded-sm transition-all duration-300"
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
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════
          Reviews list
         ═══════════════════════════════════════════════ */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin" style={{ color: T.gold }} />
        </div>
      ) : reviews.length === 0 ? (
        <div
          className="relative py-12 md:py-16 text-center overflow-hidden rounded-sm"
          style={{
            background: T.bone,
            border: `1px solid ${T.gold}30`,
            boxShadow: `0 1px 0 ${T.gold}20`,
          }}
        >
          <div
            className="absolute inset-2 pointer-events-none rounded-sm"
            style={{ border: `0.5px solid ${T.gold}`, opacity: 0.2 }}
            aria-hidden
          />
          
          <div className="relative z-10 px-6">
            <div className="w-14 h-14 mx-auto mb-6 rounded-sm flex items-center justify-center" style={{ background: T.bg, border: `1px solid ${T.gold}40` }}>
              <MessageSquare className="w-5 h-5" strokeWidth={1.5} style={{ color: T.gold }} />
            </div>
            <h3
              className="mb-3 leading-[0.95] tracking-[-0.02em]"
              style={{ color: T.ink, fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "22px", fontWeight: 400 }}
            >
              {filterRating ? `No ${filterRating}-star reviews yet` : "Awaiting first reviews."}
            </h3>
            <p className="text-[13px] leading-relaxed mb-6 max-w-sm mx-auto" style={{ color: T.inkSoft, fontFamily: "var(--font-fraunces), Georgia, serif" }}>
              Be the first to share your experience. Reviews will be published once your order has been delivered.
            </p>
            <motion.button
              type="button"
              onClick={() => setShowForm(true)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-sm transition-all duration-300"
              style={{
                background: T.ink,
                border: `1px solid ${T.gold}60`,
                color: T.goldLeaf,
                fontFamily: "var(--font-fraunces), Georgia, serif",
                fontSize: "10px",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                fontWeight: 500,
              }}
            >
              Write the first review
            </motion.button>
          </div>
        </div>
      ) : (
        <motion.div
          variants={staggerFast}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="space-y-4"
        >
          {reviews.map((review) => (
            <motion.article
              key={review._id}
              variants={fadeUp}
              className="p-5 md:p-6 rounded-sm relative transition-all duration-300"
              style={{
                background: T.bone,
                border: `1px solid ${T.gold}25`,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${T.gold}50`)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = `${T.gold}25`)}
            >
              {/* Header row */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Avatar */}
                  <div
                    className="w-10 h-10 rounded-sm flex items-center justify-center flex-shrink-0"
                    style={{ background: T.bg, border: `1px solid ${T.gold}40` }}
                  >
                    <span
                      style={{
                        color: T.ink,
                        fontFamily: "var(--font-fraunces), Georgia, serif",
                        fontSize: "14px",
                        fontWeight: 500,
                      }}
                    >
                      {review.customerName.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p
                        className="text-[14px] font-medium"
                        style={{ color: T.ink, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                      >
                        {review.customerName}
                      </p>
                      {review.isVerifiedPurchase && (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm"
                          style={{
                            background: `${T.wine}10`,
                            border: `1px solid ${T.wine}30`,
                            color: T.wine,
                            fontFamily: "var(--font-fraunces), Georgia, serif",
                            fontSize: "9px",
                            letterSpacing: "0.2em",
                            textTransform: "uppercase",
                            fontWeight: 600,
                          }}
                        >
                          <ShieldCheck className="w-2.5 h-2.5" strokeWidth={1.5} />
                          Verified
                        </span>
                      )}
                    </div>
                    <p
                      className="text-[10px] tracking-[0.15em]"
                      style={{ color: T.inkSoft, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                    >
                      {formatDateTime(review.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Rating stars */}
                <div className="flex items-center gap-0.5 flex-shrink-0">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5"
                      style={{
                        fill: i <= review.rating ? T.goldBright : "transparent",
                        color: i <= review.rating ? T.gold : `${T.inkSoft}30`,
                      }}
                      strokeWidth={1.5}
                    />
                  ))}
                </div>
              </div>

              {/* Title */}
              {review.title && (
                <h4
                  className="mb-2 leading-snug"
                  style={{
                    color: T.ink,
                    fontFamily: "var(--font-fraunces), Georgia, serif",
                    fontSize: "15px",
                    fontWeight: 500,
                  }}
                >
                  {review.title}
                </h4>
              )}

              {/* Comment */}
              <p
                className="leading-relaxed mb-5"
                style={{ color: T.inkSoft, fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "14px", lineHeight: "1.7" }}
              >
                {review.comment}
              </p>

              {/* Helpful */}
              <button
                type="button"
                onClick={() => handleMarkHelpful(review._id)}
                className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase transition-colors duration-300"
                style={{ color: T.inkSoft, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = T.gold)}
                onMouseLeave={(e) => (e.currentTarget.style.color = T.inkSoft)}
              >
                <ThumbsUp className="w-3 h-3" strokeWidth={1.5} />
                Helpful
                {review.helpfulCount > 0 && ` (${review.helpfulCount})`}
              </button>
            </motion.article>
          ))}
        </motion.div>
      )}
    </div>
  );
}