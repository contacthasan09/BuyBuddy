"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Loader2,
  Check,
  ArrowRight,
  Banknote,
  Shield,
  Truck,
  Lock,
  ShoppingBag,
} from "lucide-react";
import { useCart } from "@/store/cart";
import { api } from "@/lib/api";
import { formatBDT } from "@/lib/utils";
import {
  BD_DISTRICTS,
  DEFAULT_DELIVERY_CHARGES,
} from "@/lib/constants";
import { normalizeBDPhone, isValidBDPhone } from "@/lib/validations";
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

/* ——————————————————————————————————————————————
   SVG noise — organic paper grain
—————————————————————————————————————————————— */
function Grain() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07] mix-blend-multiply"
    >
      <filter id="grain-checkout">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain-checkout)" />
    </svg>
  );
}

interface FormState {
  customerName: string;
  customerPhone: string;
  district: string;
  area: string;
  address: string;
  note: string;
}

const initialForm: FormState = {
  customerName: "",
  customerPhone: "",
  district: "Dhaka",
  area: "",
  address: "",
  note: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const subtotal = useCart((s) => s.subtotal());
  const clearCart = useCart((s) => s.clear);

  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [lookingUp, setLookingUp] = useState(false);
  const [autofilled, setAutofilled] = useState(false);

  const deliveryCharge =
    DEFAULT_DELIVERY_CHARGES[form.district] ??
    DEFAULT_DELIVERY_CHARGES._default;
  const total = subtotal + deliveryCharge;

  useEffect(() => {
    const phone = form.customerPhone.trim();
    if (!isValidBDPhone(phone)) {
      setAutofilled(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLookingUp(true);
      try {
        const result = await api.lookupCustomer(normalizeBDPhone(phone));
        if (result && result.name) {
          setForm((f) => ({
            ...f,
            customerName: f.customerName || result.name,
            address: f.address || result.address?.fullAddress || "",
            district: f.district || result.address?.district || f.district,
            area: f.area || result.address?.area || "",
          }));
          setAutofilled(true);
        }
      } catch {
        // ignore — no autofill, user types manually
      } finally {
        setLookingUp(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [form.customerPhone]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!form.customerName.trim() || form.customerName.trim().length < 2) {
      errs.customerName = "Name is required";
    }
    if (!form.customerPhone.trim()) {
      errs.customerPhone = "Phone is required";
    } else if (!isValidBDPhone(form.customerPhone)) {
      errs.customerPhone = "Enter a valid number (e.g., 01712345678)";
    }
    if (!form.district.trim()) {
      errs.district = "District is required";
    }
    if (!form.address.trim() || form.address.trim().length < 5) {
      errs.address = "Full address is required";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (items.length === 0) {
      router.push("/cart");
      return;
    }

    setLoading(true);
    try {
      const order = await api.createOrder({
        customerName: form.customerName.trim(),
        customerPhone: normalizeBDPhone(form.customerPhone.trim()),
        district: form.district,
        area: form.area.trim() || undefined,
        address: form.address.trim(),
        note: form.note.trim() || undefined,
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
        paymentMethod: "COD",
      });

      clearCart();
      router.push(`/order-success?invoice=${order.invoice}`);
    } catch (err: any) {
      setErrors({
        submit: err?.message || "Order failed. Please try again.",
      });
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="relative min-h-[70vh] flex items-center justify-center" style={{ background: T.bg }}>
        <Grain />
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, ease: EASE.expo }}
          className="relative text-center max-w-md px-6 z-10"
        >
          <div 
            className="w-20 h-20 rounded-sm flex items-center justify-center mx-auto mb-8"
            style={{ background: T.bone, border: `1px solid ${T.gold}30` }}
          >
            <ShoppingBag className="w-8 h-8" strokeWidth={1.5} style={{ color: T.gold }} />
          </div>
          <h1
            className="mb-4 leading-[0.95] tracking-[-0.02em]"
            style={{
              fontFamily: "var(--font-fraunces), Georgia, serif",
              fontSize: "clamp(32px, 5vw, 48px)",
              fontWeight: 400,
              color: T.ink,
            }}
          >
            Nothing to{" "}
            <span className="italic font-light" style={{ color: T.wine }}>
              checkout.
            </span>
          </h1>
          <p 
            className="mb-10 text-[14px] leading-relaxed"
            style={{ color: T.inkSoft, fontFamily: "var(--font-fraunces), Georgia, serif" }}
          >
            Please add pieces to your cart before proceeding.
          </p>
          <Link 
            href="/products"
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
            Explore Collection
            <motion.svg width="14" height="10" viewBox="0 0 14 10" fill="none" className="group-hover:translate-x-1 transition-transform duration-300" aria-hidden>
              <path d="M1 5 H13 M9 1 L13 5 L9 9" stroke="currentColor" strokeWidth="1.5" />
            </motion.svg>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen" style={{ background: T.bg, color: T.ink }}>
      <Grain />

      {/* ── Header ── */}
      <section className="relative border-b" style={{ borderColor: `${T.gold}30` }}>
        <div className="container-x py-16 md:py-24">
          <motion.div
            variants={staggerContainer(0.08)}
            initial="hidden"
            animate="visible"
            className="max-w-4xl"
          >
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-5">
              <span className="h-px w-8" style={{ background: T.gold, opacity: 0.5 }} />
              <p
                className="text-[9px] tracking-[0.4em] uppercase"
                style={{ color: T.gold, fontFamily: "var(--font-fraunces), Georgia, serif" }}
              >
                Checkout · Guest · Cash on Delivery
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
              Almost <span className="italic font-light" style={{ color: T.wine }}>there.</span>
            </motion.h1>
          </motion.div>
        </div>
      </section>

      {/* ── Form + summary ── */}
      <section className="container-x py-12 md:py-16 relative z-10">
        <form onSubmit={handleSubmit} className="grid lg:grid-cols-[1fr_400px] gap-10 lg:gap-14">
          {/* FORM */}
          <div className="space-y-6">
            {/* Contact */}
            <motion.div
              initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.5, ease: EASE.expo }}
              className="relative p-6 md:p-8 rounded-sm"
              style={{
                background: T.bone,
                border: `1px solid ${T.gold}30`,
              }}
            >
              <div className="absolute inset-2 pointer-events-none rounded-sm" style={{ border: `0.5px solid ${T.gold}`, opacity: 0.2 }} aria-hidden />
              <div className="relative z-10">
                <h2
                  className="mb-6"
                  style={{
                    fontFamily: "var(--font-fraunces), Georgia, serif",
                    fontSize: "16px",
                    fontWeight: 500,
                    color: T.ink,
                  }}
                >
                  1. Contact Information
                </h2>

                <div className="space-y-5">
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
                      Phone Number <span style={{ color: T.wine }}>*</span>
                    </label>
                    <input
                      type="tel"
                      name="customerPhone"
                      value={form.customerPhone}
                      onChange={handleChange}
                      placeholder="01712345678"
                      className="w-full px-4 py-3 rounded-sm outline-none transition-all duration-300"
                      style={{
                        color: T.ink,
                        fontFamily: "var(--font-fraunces), Georgia, serif",
                        fontSize: "14px",
                        background: "transparent",
                        border: `1px solid ${errors.customerPhone ? T.wine : `${T.gold}40`}`,
                      }}
                      onFocus={(e) => {
                        if (!errors.customerPhone) {
                          e.target.style.borderColor = T.gold;
                          e.target.style.boxShadow = `0 0 0 2px ${T.gold}20`;
                        }
                      }}
                      onBlur={(e) => {
                        if (!errors.customerPhone) {
                          e.target.style.borderColor = `${T.gold}40`;
                          e.target.style.boxShadow = "none";
                        }
                      }}
                    />
                    {errors.customerPhone ? (
                      <p className="text-[11px] mt-1.5" style={{ color: T.wine, fontFamily: "var(--font-fraunces), Georgia, serif" }}>
                        {errors.customerPhone}
                      </p>
                    ) : hint_text(lookingUp, autofilled) ? (
                      <p
                        className="text-[11px] mt-1.5"
                        style={{ 
                          color: autofilled ? T.gold : T.inkSoft, 
                          fontFamily: "var(--font-fraunces), Georgia, serif" 
                        }}
                      >
                        {hint_text(lookingUp, autofilled)}
                      </p>
                    ) : null}
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
                      Full Name <span style={{ color: T.wine }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      value={form.customerName}
                      onChange={handleChange}
                      placeholder="Rahim Ahmed"
                      className="w-full px-4 py-3 rounded-sm outline-none transition-all duration-300"
                      style={{
                        color: T.ink,
                        fontFamily: "var(--font-fraunces), Georgia, serif",
                        fontSize: "14px",
                        background: "transparent",
                        border: `1px solid ${errors.customerName ? T.wine : `${T.gold}40`}`,
                      }}
                      onFocus={(e) => {
                        if (!errors.customerName) {
                          e.target.style.borderColor = T.gold;
                          e.target.style.boxShadow = `0 0 0 2px ${T.gold}20`;
                        }
                      }}
                      onBlur={(e) => {
                        if (!errors.customerName) {
                          e.target.style.borderColor = `${T.gold}40`;
                          e.target.style.boxShadow = "none";
                        }
                      }}
                    />
                    {errors.customerName && (
                      <p className="text-[11px] mt-1.5" style={{ color: T.wine, fontFamily: "var(--font-fraunces), Georgia, serif" }}>
                        {errors.customerName}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Address */}
            <motion.div
              initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.5, delay: 0.1, ease: EASE.expo }}
              className="relative p-6 md:p-8 rounded-sm"
              style={{
                background: T.bone,
                border: `1px solid ${T.gold}30`,
              }}
            >
              <div className="absolute inset-2 pointer-events-none rounded-sm" style={{ border: `0.5px solid ${T.gold}`, opacity: 0.2 }} aria-hidden />
              <div className="relative z-10">
                <h2
                  className="mb-6"
                  style={{
                    fontFamily: "var(--font-fraunces), Georgia, serif",
                    fontSize: "16px",
                    fontWeight: 500,
                    color: T.ink,
                  }}
                >
                  2. Delivery Address
                </h2>

                <div className="space-y-5">
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
                      District <span style={{ color: T.wine }}>*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="district"
                        value={form.district}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-sm outline-none transition-all duration-300 appearance-none cursor-pointer"
                        style={{
                          color: T.ink,
                          fontFamily: "var(--font-fraunces), Georgia, serif",
                          fontSize: "14px",
                          background: "transparent",
                          border: `1px solid ${errors.district ? T.wine : `${T.gold}40`}`,
                        }}
                        onFocus={(e) => {
                          if (!errors.district) {
                            e.target.style.borderColor = T.gold;
                            e.target.style.boxShadow = `0 0 0 2px ${T.gold}20`;
                          }
                        }}
                        onBlur={(e) => {
                          if (!errors.district) {
                            e.target.style.borderColor = `${T.gold}40`;
                            e.target.style.boxShadow = "none";
                          }
                        }}
                      >
                        {BD_DISTRICTS.map((d) => (
                          <option key={d} value={d} className="bg-[#F7F1E3] text-[#1C1612]">
                            {d}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                          <path d="M1 1 L5 5 L9 1" stroke={T.gold} strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </div>
                    </div>
                    {errors.district && (
                      <p className="text-[11px] mt-1.5" style={{ color: T.wine, fontFamily: "var(--font-fraunces), Georgia, serif" }}>
                        {errors.district}
                      </p>
                    )}
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
                      Area (Optional)
                    </label>
                    <input
                      type="text"
                      name="area"
                      value={form.area}
                      onChange={handleChange}
                      placeholder="Dhanmondi"
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
                      Full Address <span style={{ color: T.wine }}>*</span>
                    </label>
                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      rows={3}
                      placeholder="House 12, Road 5, Dhanmondi, Dhaka-1209"
                      className="w-full px-4 py-3 rounded-sm outline-none resize-none transition-all duration-300"
                      style={{
                        color: T.ink,
                        fontFamily: "var(--font-fraunces), Georgia, serif",
                        fontSize: "14px",
                        background: "transparent",
                        border: `1px solid ${errors.address ? T.wine : `${T.gold}40`}`,
                      }}
                      onFocus={(e) => {
                        if (!errors.address) {
                          e.target.style.borderColor = T.gold;
                          e.target.style.boxShadow = `0 0 0 2px ${T.gold}20`;
                        }
                      }}
                      onBlur={(e) => {
                        if (!errors.address) {
                          e.target.style.borderColor = `${T.gold}40`;
                          e.target.style.boxShadow = "none";
                        }
                      }}
                    />
                    {errors.address && (
                      <p className="text-[11px] mt-1.5" style={{ color: T.wine, fontFamily: "var(--font-fraunces), Georgia, serif" }}>
                        {errors.address}
                      </p>
                    )}
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
                      Delivery Note (Optional)
                    </label>
                    <input
                      type="text"
                      name="note"
                      value={form.note}
                      onChange={handleChange}
                      placeholder="Call before delivery"
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
              </div>
            </motion.div>

            {/* Payment */}
            <motion.div
              initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.5, delay: 0.2, ease: EASE.expo }}
              className="relative p-6 md:p-8 rounded-sm"
              style={{
                background: T.bone,
                border: `1px solid ${T.gold}30`,
              }}
            >
              <div className="absolute inset-2 pointer-events-none rounded-sm" style={{ border: `0.5px solid ${T.gold}`, opacity: 0.2 }} aria-hidden />
              <div className="relative z-10">
                <h2
                  className="mb-6"
                  style={{
                    fontFamily: "var(--font-fraunces), Georgia, serif",
                    fontSize: "16px",
                    fontWeight: 500,
                    color: T.ink,
                  }}
                >
                  3. Payment
                </h2>

                <div 
                  className="flex items-center gap-4 p-4 rounded-sm"
                  style={{
                    background: `${T.gold}08`,
                    border: `1px solid ${T.gold}30`,
                  }}
                >
                  <div 
                    className="w-11 h-11 rounded-sm flex items-center justify-center flex-shrink-0"
                    style={{ background: `${T.gold}15`, border: `1px solid ${T.gold}40` }}
                  >
                    <Banknote className="w-5 h-5" strokeWidth={1.5} style={{ color: T.gold }} />
                  </div>
                  <div className="flex-1">
                    <p
                      className="text-[13px] font-medium"
                      style={{ color: T.ink, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                    >
                      Cash on Delivery
                    </p>
                    <p 
                      className="text-[11px] mt-0.5"
                      style={{ color: T.inkSoft, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                    >
                      Settle payment securely upon arrival
                    </p>
                  </div>
                  <Check className="w-5 h-5" strokeWidth={1.5} style={{ color: T.gold }} />
                </div>

                <p 
                  className="text-[11px] mt-4 flex items-center gap-2"
                  style={{ color: T.inkSoft, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                >
                  <Lock className="w-3.5 h-3.5" strokeWidth={1.5} style={{ color: T.gold }} />
                  No account required. No online payment.
                </p>
              </div>
            </motion.div>

            {errors.submit && (
              <motion.div 
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative p-4 rounded-sm"
                style={{ background: `${T.wine}08`, border: `1px solid ${T.wine}30` }}
              >
                <p className="text-[13px]" style={{ color: T.wine, fontFamily: "var(--font-fraunces), Georgia, serif" }}>
                  {errors.submit}
                </p>
              </motion.div>
            )}
          </div>

          {/* SUMMARY */}
          <aside className="lg:sticky lg:top-24 h-fit">
            <motion.div
              initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.6, delay: 0.15, ease: EASE.expo }}
              className="relative p-7 rounded-sm"
              style={{
                background: T.bone,
                border: `1px solid ${T.gold}30`,
                boxShadow: `0 1px 0 ${T.gold}20, 0 16px 32px -16px rgba(28,22,18,0.15)`,
              }}
            >
              <div className="absolute inset-2 pointer-events-none rounded-sm" style={{ border: `0.5px solid ${T.gold}`, opacity: 0.2 }} aria-hidden />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="h-px w-6" style={{ background: T.gold, opacity: 0.5 }} />
                  <h2
                    className="text-[9px] tracking-[0.4em] uppercase"
                    style={{ color: T.gold, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                  >
                    Order Summary
                  </h2>
                </div>

                <div className="space-y-4 pb-5 mb-5" style={{ borderBottom: `1px dashed ${T.gold}30` }}>
                  {items.map((item) => (
                    <div key={item.productId} className="flex gap-3">
                      {item.image && (
                        <div 
                          className="w-14 h-14 rounded-sm overflow-hidden flex-shrink-0"
                          style={{ border: `1px solid ${T.gold}30`, background: T.bg }}
                        >
                          <img src={item.image} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-[13px] leading-snug line-clamp-2"
                          style={{ color: T.ink, fontFamily: "var(--font-fraunces), Georgia, serif", fontWeight: 500 }}
                        >
                          {item.name}
                        </p>
                        <p 
                          className="text-[11px] mt-1"
                          style={{ color: T.inkSoft, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                        >
                          {item.quantity} × {formatBDT(item.price)}
                        </p>
                      </div>
                      <span
                        className="text-[13px] font-medium tabular-nums whitespace-nowrap"
                        style={{ color: T.ink, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                      >
                        {formatBDT(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 pb-5 mb-5" style={{ borderBottom: `1px solid ${T.gold}20` }}>
                  <div className="flex justify-between items-baseline">
                    <span
                      className="text-[12px] tracking-[0.15em] uppercase"
                      style={{ color: T.inkSoft, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                    >
                      Subtotal
                    </span>
                    <span
                      className="text-[14px] font-medium tabular-nums"
                      style={{ color: T.ink, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                    >
                      {formatBDT(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span
                      className="text-[12px] tracking-[0.15em] uppercase"
                      style={{ color: T.inkSoft, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                    >
                      Delivery ({form.district})
                    </span>
                    <span
                      className="text-[14px] font-medium tabular-nums"
                      style={{ color: T.ink, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                    >
                      {formatBDT(deliveryCharge)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-baseline pb-6 mb-6">
                  <span
                    className="text-[13px] font-medium"
                    style={{ color: T.ink, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                  >
                    Estimated Total
                  </span>
                  <span
                    className="text-[20px] font-medium tabular-nums"
                    style={{ color: T.ink, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                  >
                    {formatBDT(total)}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-sm transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-8px_rgba(184,147,90,0.6)] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
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
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Place Order · {formatBDT(total)}
                      <motion.svg width="14" height="10" viewBox="0 0 14 10" fill="none" className="group-hover:translate-x-1 transition-transform duration-300" aria-hidden>
                        <path d="M1 5 H13 M9 1 L13 5 L9 9" stroke="currentColor" strokeWidth="1.5" />
                      </motion.svg>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-5 mt-6">
                  {[
                    { icon: Shield, label: "Secure" },
                    { icon: Truck, label: "Expedited" },
                    { icon: Banknote, label: "COD" },
                  ].map((badge) => (
                    <span 
                      key={badge.label}
                      className="flex items-center gap-1.5 text-[9px] tracking-[0.25em] uppercase"
                      style={{ color: T.inkSoft, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                    >
                      <badge.icon className="w-3.5 h-3.5" strokeWidth={1.5} style={{ color: T.gold }} />
                      {badge.label}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </aside>
        </form>
      </section>
    </div>
  );
}

function hint_text(lookingUp: boolean, autofilled: boolean): string | null {
  if (lookingUp) return "Retrieving details...";
  if (autofilled) return "Welcome back. Details populated.";
  return "We will call to confirm your acquisition.";
}