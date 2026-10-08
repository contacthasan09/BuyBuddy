"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import {
  Search,
  Loader2,
  CheckCircle2,
  Truck,
  Package,
  Home,
  XCircle,
  Clock,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { api } from "@/lib/api";
import { formatBDT, formatDateTime } from "@/lib/utils";
import { ORDER_STATUS_LABELS_EN } from "@/lib/constants";
import { fadeUp, staggerContainer, EASE } from "@/lib/motion";

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

const EASE_EXPO = [0.16, 1, 0.3, 1] as const;

/* ——————————————————————————————————————————————
   Cinematic Hero Images (Logistics themed)
—————————————————————————————————————————————— */
const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1601599561213-832382fd07ba?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1612622626109-3da3d1b03d43?q=80&w=800&auto=format&fit=crop",
];

interface TrackResult {
  order: {
    invoice: string;
    customerName: string;
    customerPhone: string;
    address: string;
    area?: string;
    district: string;
    total: number;
    status: string;
    paymentMethod: string;
    paymentStatus: string;
    courier?: {
      provider?: string;
      trackingCode?: string;
      consignmentId?: string;
    };
    createdAt: string;
  };
  history: {
    _id: string;
    status: string;
    note?: string;
    changedBy: string;
    createdAt: string;
  }[];
}

const STATUS_ICONS: Record<string, any> = {
  PENDING: Clock,
  CONFIRMED: CheckCircle2,
  PROCESSING: Package,
  SHIPMENT_CREATED: Truck,
  PICKED_UP: Truck,
  IN_TRANSIT: Truck,
  OUT_FOR_DELIVERY: MapPin,
  DELIVERED: Home,
  CANCELLED: XCircle,
  FAILED_DELIVERY: XCircle,
  RETURN_REQUESTED: Package,
  RETURNED: Package,
};

/* ——————————————————————————————————————————————
   SVG noise — ultra-fine organic paper grain
—————————————————————————————————————————————— */
function Grain() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.05] mix-blend-multiply"
    >
      <filter id="grain-track-hero">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain-track-hero)" />
    </svg>
  );
}

/* ——————————————————————————————————————————————
   3D Tilt Card Wrapper
—————————————————————————————————————————————— */
function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [1.2, -1.2]), {
    stiffness: 150,
    damping: 25,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-1.2, 1.2]), {
    stiffness: 150,
    damping: 25,
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1200,
      }}
      className="relative"
    >
      {children}
    </motion.div>
  );
}

/* ——————————————————————————————————————————————
   Cinematic Image Slider (inside card)
—————————————————————————————————————————————— */
function CinematicImageSlider({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length, isHovered]);

  return (
    <div
      className="relative w-full h-full min-h-[320px] md:min-h-0 overflow-hidden"
      style={{ background: "#E8DFCB" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          {/* Ken Burns slow zoom */}
          <motion.img
            src={images[currentIndex]}
            alt="Featured delivery"
            className="w-full h-full object-cover"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 6, ease: "linear" }}
          />

          {/* Cinematic vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at center, transparent 40%, rgba(18,14,10,0.35) 100%)`,
            }}
          />

          {/* Image grain */}
          <svg className="pointer-events-none absolute inset-0 w-full h-full opacity-[0.1] mix-blend-overlay">
            <filter id="img-grain-track">
              <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
              <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#img-grain-track)" />
          </svg>
        </motion.div>
      </AnimatePresence>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black/10">
        <motion.div
          key={currentIndex}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 5, ease: "linear" }}
          className="h-full"
          style={{ background: T.gold }}
        />
      </div>

      {/* Pagination dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className="w-1.5 h-1.5 rounded-full transition-all duration-500"
            style={{
              background: idx === currentIndex ? T.gold : "rgba(255,255,255,0.5)",
              transform: idx === currentIndex ? "scale(1.3)" : "scale(1)",
              boxShadow: idx === currentIndex ? `0 0 8px ${T.gold}80` : "none",
            }}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

function TrackClient() {
  const searchParams = useSearchParams();
  const [invoice, setInvoice] = useState(searchParams?.get("invoice") || "");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrackResult | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const prefilled = searchParams?.get("invoice");
    if (prefilled) setInvoice(prefilled);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const res = await api.trackOrder(invoice.trim(), phone.trim());
      setResult(res);
    } catch (err: any) {
      setError(
        err?.message ||
          "Acquisition not found. Please verify your Order ID and contact number."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen relative"
      style={{ background: T.bg, color: T.ink }}
    >
      <Grain />

      {/* ═══════════════════════════════════════════════
          CINEMATIC HERO — Editorial Split Card
          ═══════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${T.bone} 0%, ${T.bg} 60%, ${T.bg} 100%)`,
          borderBottom: `1px solid ${T.gold}25`,
        }}
      >
        {/* Ambient lighting */}
        <motion.div
          aria-hidden
          className="absolute pointer-events-none"
          style={{
            top: "-35%",
            left: "50%",
            width: "min(720px, 90vw)",
            height: "min(720px, 90vw)",
            transform: "translateX(-50%)",
            background: `radial-gradient(circle, ${T.goldBright}18 0%, transparent 55%)`,
            filter: "blur(70px)",
            zIndex: 0,
          }}
          animate={{ opacity: [0.3, 0.55, 0.3], scale: [1, 1.05, 1] }}
          transition={{ duration: 15, ease: "easeInOut", repeat: Infinity }}
        />

        {/* Vignette */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 1,
            background: `radial-gradient(120% 90% at 50% 30%, transparent 35%, ${T.bg}90 100%)`,
          }}
        />

        {/* Content */}
        <div className="relative container-x pt-14 pb-12 md:pt-20 md:pb-16" style={{ zIndex: 10 }}>
          <motion.div
            variants={staggerContainer(0.09)}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto"
          >
            <TiltCard>
              <motion.div
                variants={fadeUp}
                className="relative grid md:grid-cols-5 rounded-sm overflow-hidden"
                style={{
                  background: `linear-gradient(165deg, ${T.bone} 0%, ${T.bg} 100%)`,
                  border: `1px solid ${T.gold}35`,
                  boxShadow: `
                    0 1px 0 ${T.goldLeaf}40,
                    0 16px 40px -16px rgba(18, 14, 10, 0.14),
                    0 30px 70px -30px rgba(18, 14, 10, 0.08)
                  `,
                }}
              >
                {/* Unified Inner gold hairline */}
                <div
                  aria-hidden
                  className="absolute inset-2.5 pointer-events-none rounded-sm z-20"
                  style={{ border: `0.5px solid ${T.gold}`, opacity: 0.22 }}
                />

                {/* Unified Corner ornaments */}
                {[
                  { top: 8, left: 8, rotate: 0 },
                  { top: 8, right: 8, rotate: 90 },
                  { bottom: 8, right: 8, rotate: 180 },
                  { bottom: 8, left: 8, rotate: 270 },
                ].map((pos, idx) => (
                  <div
                    key={idx}
                    className="absolute w-3 h-3 pointer-events-none z-20"
                    style={{
                      top: pos.top,
                      right: pos.right,
                      bottom: pos.bottom,
                      left: pos.left,
                      transform: `rotate(${pos.rotate}deg)`,
                    }}
                    aria-hidden
                  >
                    <svg viewBox="0 0 16 16" fill="none">
                      <path d="M0 0 L16 0 L16 16" stroke={T.gold} strokeWidth="0.8" opacity="0.6" />
                      <circle cx="1.5" cy="1.5" r="1" fill={T.goldBright} opacity="0.8" />
                    </svg>
                  </div>
                ))}

                {/* Top edge cinematic light sweep */}
                <div
                  aria-hidden
                  className="absolute top-0 left-0 right-0 h-px pointer-events-none z-20"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${T.goldBright}80, transparent)`,
                  }}
                />

                {/* ── Text Side ── */}
                <div
                  className="col-span-5 md:col-span-3 p-6 md:p-10 lg:p-12 flex flex-col justify-center order-2 md:order-1 relative z-10"
                  style={{ transform: "translateZ(20px)" }}
                >
                  {/* Eyebrow */}
                  <motion.div variants={fadeUp} className="flex items-center gap-3 mb-5">
                    <div
                      className="flex items-center justify-center w-6 h-6 rounded-full"
                      style={{
                        background: `linear-gradient(135deg, ${T.goldBright}30, ${T.gold}20)`,
                        border: `1px solid ${T.gold}40`,
                      }}
                    >
                      <span className="text-[10px]" style={{ color: T.gold }}>❖</span>
                    </div>
                    <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${T.gold}40, transparent)` }} />
                    <p
                      className="text-[9px] tracking-[0.35em] uppercase font-medium"
                      style={{ color: T.inkSoft, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                    >
                      Concierge · Live Tracking
                    </p>
                  </motion.div>

                  {/* Headline */}
                  <motion.h1
                    variants={fadeUp}
                    className="mb-5 relative leading-[0.95] tracking-[-0.025em]"
                    style={{
                      color: T.ink,
                      fontFamily: "var(--font-fraunces), Georgia, serif",
                      fontSize: "clamp(30px, 4vw, 52px)",
                      fontWeight: 400,
                    }}
                  >
                    Track your{" "}
                    <span className="italic font-light relative inline-block">
                      acquisition.
                    </span>
                  </motion.h1>

                  {/* Subtitle */}
                  <motion.p
                    variants={fadeUp}
                    className="max-w-lg"
                    style={{
                      color: T.inkSoft,
                      fontFamily: "var(--font-fraunces), Georgia, serif",
                      fontSize: "clamp(13px, 1vw, 15px)",
                      lineHeight: 1.65,
                      letterSpacing: "0.01em",
                    }}
                  >
                    Enter your Order ID and the contact number provided during checkout to view real-time status of your delivery.
                  </motion.p>
                </div>

                {/* ── Image Side ── */}
                <div className="col-span-5 md:col-span-2 relative order-1 md:order-2">
                  <CinematicImageSlider images={HERO_IMAGES} />

                  {/* Vertical divider for desktop */}
                  <div
                    className="hidden md:block absolute top-0 bottom-0 left-0 w-px z-10"
                    style={{ background: `linear-gradient(180deg, transparent, ${T.gold}40, transparent)` }}
                  />
                </div>
              </motion.div>
            </TiltCard>
          </motion.div>
        </div>

        {/* Bottom cinematic fade */}
        <div
          aria-hidden
          className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
          style={{
            background: `linear-gradient(180deg, transparent 0%, ${T.bg} 100%)`,
            zIndex: 5,
          }}
        />
      </section>

      {/* ═══════════════════════════════════════════════
          FORM SECTION
          ═══════════════════════════════════════════════ */}
      <section className="container-x py-12 md:py-16 relative z-10">
        <motion.form
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE_EXPO }}
          onSubmit={handleSubmit}
          className="max-w-2xl p-8 md:p-10 rounded-sm relative"
          style={{
            background: T.bone,
            border: `1px solid ${T.gold}35`,
            boxShadow: `0 1px 0 ${T.gold}20, 0 24px 48px -24px rgba(28,22,18,0.2)`,
          }}
        >
          <div
            className="absolute inset-2 pointer-events-none rounded-sm"
            style={{ border: `0.5px solid ${T.gold}`, opacity: 0.2 }}
            aria-hidden
          />

          <div className="relative z-10 grid sm:grid-cols-2 gap-6 mb-8">
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
                Order ID
              </label>
              <input
                type="text"
                value={invoice}
                onChange={(e) => setInvoice(e.target.value)}
                placeholder="e.g., ORD-2026-001"
                required
                className="w-full px-4 py-3.5 rounded-sm outline-none transition-all duration-300"
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
                Contact Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g., 01712345678"
                required
                className="w-full px-4 py-3.5 rounded-sm outline-none transition-all duration-300"
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

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="relative z-10 w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-sm transition-all duration-300 disabled:opacity-60"
            style={{
              background: T.ink,
              border: `1px solid ${T.gold}60`,
              color: T.goldLeaf,
              fontFamily: "var(--font-fraunces), Georgia, serif",
              fontSize: "11px",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Retrieving details...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" strokeWidth={1.5} />
                Track Acquisition
              </>
            )}
          </motion.button>
        </motion.form>

        {/* ═══════════════════════════════════════════════
            ERROR STATE
            ═══════════════════════════════════════════════ */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: EASE_EXPO }}
              className="max-w-2xl mt-6 p-5 rounded-sm relative"
              style={{
                background: `${T.wine}08`,
                border: `1px solid ${T.wine}30`,
              }}
            >
              <div className="flex items-start gap-3">
                <XCircle
                  className="w-5 h-5 flex-shrink-0 mt-0.5"
                  style={{ color: T.wine }}
                  strokeWidth={1.5}
                />
                <p
                  className="text-[13px] leading-relaxed"
                  style={{
                    color: T.wine,
                    fontFamily: "var(--font-fraunces), Georgia, serif",
                  }}
                >
                  {error}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══════════════════════════════════════════════
            RESULTS
            ═══════════════════════════════════════════════ */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE_EXPO }}
              className="max-w-3xl mt-12 space-y-6"
            >
              {/* Order Summary Card */}
              <div
                className="p-6 md:p-8 rounded-sm relative"
                style={{
                  background: T.bone,
                  border: `1px solid ${T.gold}30`,
                  boxShadow: `0 1px 0 ${T.gold}20, 0 16px 32px -16px rgba(28,22,18,0.15)`,
                }}
              >
                <div
                  className="absolute inset-2 pointer-events-none rounded-sm"
                  style={{ border: `0.5px solid ${T.gold}`, opacity: 0.15 }}
                  aria-hidden
                />

                <div
                  className="relative z-10 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 pb-6"
                  style={{ borderBottom: `1px dashed ${T.gold}30` }}
                >
                  <div>
                    <p
                      className="text-[9px] tracking-[0.35em] uppercase mb-1.5"
                      style={{
                        color: T.inkSoft,
                        fontFamily: "var(--font-fraunces), Georgia, serif",
                      }}
                    >
                      Order Reference
                    </p>
                    <p
                      className="font-medium text-lg tabular-nums"
                      style={{
                        color: T.ink,
                        fontFamily: "var(--font-fraunces), Georgia, serif",
                      }}
                    >
                      {result.order.invoice}
                    </p>
                  </div>
                  <div className="sm:text-right">
                    <p
                      className="text-[9px] tracking-[0.35em] uppercase mb-1.5"
                      style={{
                        color: T.inkSoft,
                        fontFamily: "var(--font-fraunces), Georgia, serif",
                      }}
                    >
                      Total Value
                    </p>
                    <p
                      className="font-medium text-lg tabular-nums"
                      style={{
                        color: T.ink,
                        fontFamily: "var(--font-fraunces), Georgia, serif",
                      }}
                    >
                      {formatBDT(result.order.total)}
                    </p>
                  </div>
                </div>

                <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                  <div>
                    <p
                      className="text-[9px] tracking-[0.35em] uppercase mb-1.5 flex items-center gap-2"
                      style={{
                        color: T.inkSoft,
                        fontFamily: "var(--font-fraunces), Georgia, serif",
                      }}
                    >
                      <User className="w-3.5 h-3.5" strokeWidth={1.5} style={{ color: T.gold }} />
                      Recipient
                    </p>
                    <p
                      className="font-medium"
                      style={{ color: T.ink, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                    >
                      {result.order.customerName}
                    </p>
                  </div>
                  <div>
                    <p
                      className="text-[9px] tracking-[0.35em] uppercase mb-1.5 flex items-center gap-2"
                      style={{
                        color: T.inkSoft,
                        fontFamily: "var(--font-fraunces), Georgia, serif",
                      }}
                    >
                      <Phone className="w-3.5 h-3.5" strokeWidth={1.5} style={{ color: T.gold }} />
                      Contact
                    </p>
                    <p
                      className="font-medium tabular-nums"
                      style={{ color: T.ink, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                    >
                      {result.order.customerPhone}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <p
                      className="text-[9px] tracking-[0.35em] uppercase mb-1.5 flex items-center gap-2"
                      style={{
                        color: T.inkSoft,
                        fontFamily: "var(--font-fraunces), Georgia, serif",
                      }}
                    >
                      <MapPin className="w-3.5 h-3.5" strokeWidth={1.5} style={{ color: T.gold }} />
                      Destination
                    </p>
                    <p
                      className="leading-relaxed"
                      style={{ color: T.inkSoft, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                    >
                      {result.order.address}
                      {result.order.area && `, ${result.order.area}`}
                      {`, ${result.order.district}`}
                    </p>
                  </div>

                  {result.order.courier?.trackingCode && (
                    <div
                      className="sm:col-span-2 p-4 rounded-sm"
                      style={{
                        background: `${T.gold}08`,
                        border: `1px solid ${T.gold}25`,
                      }}
                    >
                      <p
                        className="text-[9px] tracking-[0.35em] uppercase mb-1.5"
                        style={{ color: T.gold, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                      >
                        Courier Tracking Reference
                      </p>
                      <p
                        className="font-medium tabular-nums"
                        style={{
                          color: T.ink,
                          fontFamily: "var(--font-fraunces), Georgia, serif",
                          fontSize: "15px",
                        }}
                      >
                        {result.order.courier.trackingCode}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Timeline Card */}
              <div
                className="p-6 md:p-8 rounded-sm relative"
                style={{
                  background: T.bone,
                  border: `1px solid ${T.gold}30`,
                  boxShadow: `0 1px 0 ${T.gold}20, 0 16px 32px -16px rgba(28,22,18,0.15)`,
                }}
              >
                <div
                  className="absolute inset-2 pointer-events-none rounded-sm"
                  style={{ border: `0.5px solid ${T.gold}`, opacity: 0.15 }}
                  aria-hidden
                />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                    <span className="h-px w-6" style={{ background: T.gold, opacity: 0.5 }} />
                    <h2
                      className="text-[9px] tracking-[0.4em] uppercase"
                      style={{ color: T.gold, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                    >
                      Journey Timeline
                    </h2>
                  </div>

                  <div className="space-y-0">
                    {result.history.map((h, i) => {
                      const Icon = STATUS_ICONS[h.status] || Clock;
                      const isLast = i === result.history.length - 1;
                      const isFirst = i === 0;

                      return (
                        <motion.div
                          key={h._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1, duration: 0.5, ease: EASE_EXPO }}
                          className="relative flex gap-5 pb-8 last:pb-0"
                        >
                          {!isLast && (
                            <div
                              className="absolute left-[19px] top-10 bottom-0 w-px"
                              style={{ background: isFirst ? T.gold : `${T.gold}30` }}
                            />
                          )}

                          <div
                            className="relative z-10 w-10 h-10 rounded-sm flex items-center justify-center flex-shrink-0"
                            style={{
                              background: isFirst ? T.gold : T.bg,
                              border: `1px solid ${isFirst ? T.gold : `${T.gold}40`}`,
                              boxShadow: isFirst ? `0 4px 12px -4px ${T.gold}40` : "none",
                            }}
                          >
                            <Icon
                              className="w-4 h-4"
                              strokeWidth={1.5}
                              style={{ color: isFirst ? T.ink : T.inkSoft }}
                            />
                          </div>

                          <div className="flex-1 pt-1">
                            <p
                              className="font-medium mb-1"
                              style={{
                                color: isFirst ? T.ink : T.inkSoft,
                                fontFamily: "var(--font-fraunces), Georgia, serif",
                                fontSize: "15px",
                              }}
                            >
                              {ORDER_STATUS_LABELS_EN[h.status] || h.status}
                            </p>
                            {h.note && (
                              <p
                                className="text-[13px] mb-1.5 italic"
                                style={{ color: T.inkSoft, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                              >
                                {h.note}
                              </p>
                            )}
                            <p
                              className="text-[11px] tracking-[0.15em] tabular-nums"
                              style={{
                                color: T.inkSoft,
                                opacity: 0.7,
                                fontFamily: "var(--font-fraunces), Georgia, serif",
                              }}
                            >
                              {formatDateTime(h.createdAt)}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ background: "#EFE7D4" }}
        >
          <div className="text-center">
            <div
              className="w-10 h-10 border-2 rounded-full animate-spin mx-auto mb-4"
              style={{
                borderColor: "#B8935A30",
                borderTopColor: "#B8935A",
              }}
            />
            <p
              className="text-[11px] tracking-[0.3em] uppercase"
              style={{
                color: "#5C4F42",
                fontFamily: "var(--font-fraunces), Georgia, serif",
              }}
            >
              Loading tracker
            </p>
          </div>
        </div>
      }
    >
      <TrackClient />
    </Suspense>
  );
}