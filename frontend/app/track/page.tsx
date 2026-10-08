"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.06] mix-blend-multiply"
      >
        <filter id="grain-track">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            stitchTiles="stitch"
          />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-track)" />
      </svg>

      <section
        className="relative border-b"
        style={{ borderColor: `${T.gold}30` }}
      >
        <div className="container-x py-16 md:py-24">
          <motion.div
            variants={staggerContainer(0.08)}
            initial="hidden"
            animate="visible"
            className="max-w-2xl"
          >
            <motion.div
              variants={fadeUp}
              className="flex items-center gap-3 mb-5"
            >
              <span
                className="h-px w-8"
                style={{ background: T.gold, opacity: 0.5 }}
              />
              <p
                className="text-[9px] tracking-[0.4em] uppercase"
                style={{
                  color: T.gold,
                  fontFamily: "var(--font-fraunces), Georgia, serif",
                }}
              >
                Concierge · Live Tracking
              </p>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="leading-[0.95] tracking-[-0.02em]"
              style={{
                fontFamily: "var(--font-fraunces), Georgia, serif",
                fontSize: "clamp(36px, 5vw, 64px)",
                fontWeight: 400,
                color: T.ink,
              }}
            >
              Track your{" "}
              <span className="italic font-light" style={{ color: T.wine }}>
                acquisition.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-5 max-w-md"
              style={{
                fontFamily: "var(--font-fraunces), Georgia, serif",
                fontSize: "15px",
                lineHeight: 1.7,
                color: T.inkSoft,
              }}
            >
              Enter your Order ID and the contact number provided during
              checkout to view real-time status.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="container-x py-12 md:py-16 relative z-10">
        <motion.form
          initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE.expo }}
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

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
              transition={{ duration: 0.4, ease: EASE.expo }}
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

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.7, ease: EASE.expo }}
              className="max-w-3xl mt-12 space-y-6"
            >
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
                      <User
                        className="w-3.5 h-3.5"
                        strokeWidth={1.5}
                        style={{ color: T.gold }}
                      />
                      Recipient
                    </p>
                    <p
                      className="font-medium"
                      style={{
                        color: T.ink,
                        fontFamily: "var(--font-fraunces), Georgia, serif",
                      }}
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
                      <Phone
                        className="w-3.5 h-3.5"
                        strokeWidth={1.5}
                        style={{ color: T.gold }}
                      />
                      Contact
                    </p>
                    <p
                      className="font-medium tabular-nums"
                      style={{
                        color: T.ink,
                        fontFamily: "var(--font-fraunces), Georgia, serif",
                      }}
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
                      <MapPin
                        className="w-3.5 h-3.5"
                        strokeWidth={1.5}
                        style={{ color: T.gold }}
                      />
                      Destination
                    </p>
                    <p
                      className="leading-relaxed"
                      style={{
                        color: T.inkSoft,
                        fontFamily: "var(--font-fraunces), Georgia, serif",
                      }}
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
                        style={{
                          color: T.gold,
                          fontFamily: "var(--font-fraunces), Georgia, serif",
                        }}
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
                    <span
                      className="h-px w-6"
                      style={{ background: T.gold, opacity: 0.5 }}
                    />
                    <h2
                      className="text-[9px] tracking-[0.4em] uppercase"
                      style={{
                        color: T.gold,
                        fontFamily: "var(--font-fraunces), Georgia, serif",
                      }}
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
                          initial={{ opacity: 0, x: -16, filter: "blur(4px)" }}
                          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                          transition={{
                            delay: i * 0.1,
                            duration: 0.5,
                            ease: EASE.expo,
                          }}
                          className="relative flex gap-5 pb-8 last:pb-0"
                        >
                          {!isLast && (
                            <div
                              className="absolute left-[19px] top-10 bottom-0 w-px"
                              style={{
                                background: isFirst ? T.gold : `${T.gold}30`,
                              }}
                            />
                          )}

                          <div
                            className="relative z-10 w-10 h-10 rounded-sm flex items-center justify-center flex-shrink-0"
                            style={{
                              background: isFirst ? T.gold : T.bg,
                              border: `1px solid ${
                                isFirst ? T.gold : `${T.gold}40`
                              }`,
                              boxShadow: isFirst
                                ? `0 4px 12px -4px ${T.gold}40`
                                : "none",
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
                                fontFamily:
                                  "var(--font-fraunces), Georgia, serif",
                                fontSize: "15px",
                              }}
                            >
                              {ORDER_STATUS_LABELS_EN[h.status] || h.status}
                            </p>
                            {h.note && (
                              <p
                                className="text-[13px] mb-1.5 italic"
                                style={{
                                  color: T.inkSoft,
                                  fontFamily:
                                    "var(--font-fraunces), Georgia, serif",
                                }}
                              >
                                {h.note}
                              </p>
                            )}
                            <p
                              className="text-[11px] tracking-[0.15em] tabular-nums"
                              style={{
                                color: T.inkSoft,
                                opacity: 0.7,
                                fontFamily:
                                  "var(--font-fraunces), Georgia, serif",
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