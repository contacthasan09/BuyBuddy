"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { X, ShoppingBag, ArrowRight, Truck } from "lucide-react";
import { useCart } from "@/store/cart";
import { useCartDrawer } from "@/store/cart-drawer";
import { CartDrawerItem } from "./CartDrawerItem";
import { EmptyCartState } from "./EmptyCartState";
import { AnimatedNumber } from "./AnimatedNumber";
import { drawerBackdrop, drawerContent, EASE } from "@/lib/motion";

const T = {
  bg: "#EFE7D4",
  ink: "#1C1612",
  inkDeep: "#0E0A07",
  inkSoft: "#5C4F42",
  gold: "#B8935A",
  goldBright: "#D4B478",
  goldLeaf: "#E8D4A0",
  wine: "#5A1A1F",
  bone: "#F7F1E3",
};

export function CartDrawer() {
  const router = useRouter();
  const { isOpen, close } = useCartDrawer();
  const items = useCart((s) => s.items);
  const subtotal = useCart((s) => s.subtotal());
  const itemCount = useCart((s) => s.itemCount());

  const panelRef = useRef<HTMLDivElement>(null);
  const [freeThreshold, setFreeThreshold] = useState(2000);

  // Portals require the DOM to be mounted on the client
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Fetch free-delivery threshold once
  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => {
        const t = d?.data?.freeDeliveryThreshold;
        if (t && Number(t) > 0) setFreeThreshold(Number(t));
      })
      .catch(() => {});
  }, []);

  // Escape to close
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  // Lock body scroll while open
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isOpen]);

  // Focus trap
  useEffect(() => {
    if (!isOpen || !panelRef.current) return;
    const panel = panelRef.current;
    const focusableSelectors =
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
    const focusable = Array.from(
      panel.querySelectorAll<HTMLElement>(focusableSelectors)
    ).filter((el) => el.offsetParent !== null);

    focusable[0]?.focus();

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const currentFocusables = Array.from(
        panel.querySelectorAll<HTMLElement>(focusableSelectors)
      ).filter((el) => el.offsetParent !== null);
      if (currentFocusables.length === 0) return;
      const first = currentFocusables[0];
      const last = currentFocusables[currentFocusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleTab);
    return () => document.removeEventListener("keydown", handleTab);
  }, [isOpen]);

  const goToCheckout = () => {
    close();
    router.push("/checkout");
  };

  const freeDeliveryProgress = Math.min(
    (subtotal / freeThreshold) * 100,
    100
  );
  const remaining = Math.max(freeThreshold - subtotal, 0);
  const hasFreeDelivery = subtotal >= freeThreshold;

  // Don't render anything until mounted (SSR-safe for portals)
  if (!mounted) return null;

  const content = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ─── Backdrop ─── */}
          <motion.div
            key="cart-backdrop"
            variants={drawerBackdrop}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={close}
            className="fixed inset-0 z-[900]"
            style={{ background: `${T.inkDeep}E6` }}
            aria-hidden
          />

          {/* ─── Panel ─── */}
          <motion.aside
            key="cart-panel"
            ref={panelRef}
            variants={drawerContent}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 right-0 z-[901] w-full sm:w-[420px] md:w-[460px] flex flex-col overflow-hidden"
            style={{
              background: T.bone,
              borderLeft: `1px solid ${T.gold}40`,
              boxShadow: `-20px 0 60px -20px rgba(28,22,18,0.5)`,
              height: "100dvh",
              maxHeight: "100dvh",
              paddingTop: "env(safe-area-inset-top)",
              paddingBottom: "env(safe-area-inset-bottom)",
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
          >
            {/* Left-edge gold hairline */}
            <div
              className="absolute inset-y-2 left-2 w-px pointer-events-none"
              style={{
                background: `linear-gradient(180deg, transparent, ${T.gold}40, transparent)`,
              }}
              aria-hidden
            />

            {/* ═════════ HEADER — fixed, never scrolls ═════════ */}
            <header
              className="flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5 relative z-10 flex-shrink-0"
              style={{ borderBottom: `1px solid ${T.gold}20` }}
            >
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <div
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-sm flex items-center justify-center flex-shrink-0"
                  style={{
                    background: T.bg,
                    border: `1px solid ${T.gold}30`,
                  }}
                >
                  <ShoppingBag
                    className="w-4 h-4"
                    strokeWidth={1.5}
                    style={{ color: T.gold }}
                  />
                </div>
                <div className="min-w-0">
                  <h2
                    className="leading-[0.95] tracking-[-0.02em] truncate"
                    style={{
                      color: T.ink,
                      fontFamily: "var(--font-fraunces), Georgia, serif",
                      fontSize: "clamp(18px, 4.5vw, 20px)",
                      fontWeight: 400,
                    }}
                  >
                    Your{" "}
                    <span
                      className="italic font-light"
                      style={{ color: T.wine }}
                    >
                      cart.
                    </span>
                  </h2>
                  <p
                    className="text-[10px] tracking-[0.25em] uppercase mt-1"
                    style={{
                      color: T.inkSoft,
                      fontFamily: "var(--font-fraunces), Georgia, serif",
                    }}
                  >
                    {itemCount} {itemCount === 1 ? "piece" : "pieces"}
                  </p>
                </div>
              </div>

              <motion.button
                type="button"
                onClick={close}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 rounded-sm flex items-center justify-center transition-all duration-300 flex-shrink-0"
                style={{
                  border: `1px solid ${T.gold}30`,
                  background: "transparent",
                }}
                aria-label="Close cart"
              >
                <X
                  className="w-4 h-4"
                  strokeWidth={1.5}
                  style={{ color: T.inkSoft }}
                />
              </motion.button>
            </header>

            {/* ═════════ FREE DELIVERY PROGRESS — fixed ═════════ */}
            {items.length > 0 && (
              <div
                className="px-5 sm:px-6 py-3 sm:py-4 flex-shrink-0 relative z-10"
                style={{ borderBottom: `1px dashed ${T.gold}30` }}
              >
                {hasFreeDelivery ? (
                  <div className="flex items-center gap-3">
                    <div
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-sm flex items-center justify-center flex-shrink-0"
                      style={{
                        background: `${T.gold}15`,
                        border: `1px solid ${T.gold}40`,
                      }}
                    >
                      <Truck
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                        strokeWidth={1.5}
                        style={{ color: T.gold }}
                      />
                    </div>
                    <p
                      className="text-[12px] sm:text-[13px] font-medium"
                      style={{
                        color: T.ink,
                        fontFamily: "var(--font-fraunces), Georgia, serif",
                      }}
                    >
                      Complimentary delivery{" "}
                      <span style={{ color: T.gold }}>unlocked.</span>
                    </p>
                  </div>
                ) : (
                  <div>
                    <p
                      className="text-[11px] sm:text-[12px] mb-2 sm:mb-2.5"
                      style={{
                        color: T.inkSoft,
                        fontFamily: "var(--font-fraunces), Georgia, serif",
                      }}
                    >
                      <span style={{ color: T.ink, fontWeight: 500 }}>
                        ৳{remaining.toLocaleString()}
                      </span>{" "}
                      away from complimentary delivery.
                    </p>
                    <div
                      className="h-1.5 rounded-sm overflow-hidden"
                      style={{ background: `${T.gold}20` }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${freeDeliveryProgress}%` }}
                        transition={{ duration: 0.8, ease: EASE.expo }}
                        className="h-full rounded-sm"
                        style={{
                          background: `linear-gradient(90deg, ${T.goldBright}, ${T.gold})`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ═════════ BODY — the ONLY scrollable region ═════════ */}
            <div
              className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-5 sm:px-6 py-4 relative z-10"
              style={{
                WebkitOverflowScrolling: "touch",
                touchAction: "pan-y",
              }}
            >
              {items.length === 0 ? (
                <EmptyCartState />
              ) : (
                <motion.div layout className="space-y-4">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <CartDrawerItem
                        key={item.productId}
                        item={item}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>

            {/* ═════════ FOOTER — fixed, never scrolls ═════════ */}
            {items.length > 0 && (
              <footer
                className="flex-shrink-0 px-5 sm:px-6 py-4 sm:py-6 relative z-10"
                style={{
                  borderTop: `1px solid ${T.gold}30`,
                  background: T.bone,
                }}
              >
                <div className="space-y-2.5 sm:space-y-3 mb-4 sm:mb-5">
                  <div className="flex justify-between items-baseline">
                    <span
                      className="text-[11px] sm:text-[12px] tracking-[0.15em] uppercase"
                      style={{
                        color: T.inkSoft,
                        fontFamily: "var(--font-fraunces), Georgia, serif",
                      }}
                    >
                      Subtotal
                    </span>
                    <AnimatedNumber
                      value={subtotal}
                      className="text-[13px] sm:text-[14px] font-medium tabular-nums"
                      style={{
                        color: T.ink,
                        fontFamily: "var(--font-fraunces), Georgia, serif",
                      }}
                    />
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span
                      className="text-[11px] sm:text-[12px] tracking-[0.15em] uppercase"
                      style={{
                        color: T.inkSoft,
                        fontFamily: "var(--font-fraunces), Georgia, serif",
                      }}
                    >
                      Delivery
                    </span>
                    <span
                      className="text-[11px] sm:text-[12px] tabular-nums text-right"
                      style={{
                        color: T.inkSoft,
                        fontFamily: "var(--font-fraunces), Georgia, serif",
                      }}
                    >
                      Calculated at checkout
                    </span>
                  </div>
                </div>

                <div
                  className="flex justify-between items-baseline pb-4 sm:pb-6 mb-4 sm:mb-6"
                  style={{ borderBottom: `1px dashed ${T.gold}30` }}
                >
                  <span
                    className="text-[12px] sm:text-[13px] font-medium"
                    style={{
                      color: T.ink,
                      fontFamily: "var(--font-fraunces), Georgia, serif",
                    }}
                  >
                    Estimated total
                  </span>
                  <AnimatedNumber
                    value={subtotal}
                    className="text-[18px] sm:text-[20px] font-medium tabular-nums"
                    style={{
                      color: T.ink,
                      fontFamily: "var(--font-fraunces), Georgia, serif",
                    }}
                  />
                </div>

                <motion.button
                  type="button"
                  onClick={goToCheckout}
                  whileHover={{
                    y: -2,
                    boxShadow: `0 12px 32px -8px ${T.gold}60`,
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.3, ease: EASE.expo }}
                  className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 sm:py-4 rounded-sm transition-all duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${T.goldBright}, ${T.gold})`,
                    color: T.ink,
                    fontFamily: "var(--font-fraunces), Georgia, serif",
                    fontSize: "11px",
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                    boxShadow: `0 8px 24px -8px ${T.gold}40`,
                  }}
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                </motion.button>

                <Link
                  href="/cart"
                  onClick={close}
                  className="group block text-center mt-3 sm:mt-4 transition-colors duration-300"
                  style={{
                    color: T.inkSoft,
                    fontFamily: "var(--font-fraunces), Georgia, serif",
                    fontSize: "10px",
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                  }}
                >
                  View full cart page
                </Link>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );

  // ─── THE KEY: portal to document.body ───
  return createPortal(content, document.body);
}