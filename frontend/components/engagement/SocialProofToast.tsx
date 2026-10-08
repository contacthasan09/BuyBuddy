"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { randomNotification, formatMinutesAgo } from "@/lib/mock-social-proof";
import { EASE } from "@/lib/motion";

interface Notification {
  id: string;
  name: string;
  city: string;
  minutesAgo: number;
  product?: { name: string; slug: string; image: string };
}

interface SocialProofToastProps {
  /** Products to randomly pick from */
  products?: { name: string; slug: string; image: string }[];
  /** Minimum delay between toasts (ms) */
  minDelay?: number;
  /** Maximum delay between toasts (ms) */
  maxDelay?: number;
}

export function SocialProofToast({
  products = [],
  minDelay = 20000,
  maxDelay = 45000,
}: SocialProofToastProps) {
  const [current, setCurrent] = useState<Notification | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed || typeof window === "undefined") return;

    let timeout: ReturnType<typeof setTimeout>;

    const scheduleNext = () => {
      const delay = minDelay + Math.random() * (maxDelay - minDelay);
      timeout = setTimeout(() => {
        const { name, city, minutesAgo } = randomNotification();
        const product =
          products.length > 0
            ? products[Math.floor(Math.random() * products.length)]
            : undefined;

        setCurrent({
          id: Math.random().toString(36).slice(2),
          name,
          city,
          minutesAgo,
          product,
        });

        // Auto-hide after 6s
        setTimeout(() => {
          setCurrent(null);
          scheduleNext();
        }, 6000);
      }, delay);
    };

    scheduleNext();

    return () => clearTimeout(timeout);
  }, [dismissed, products, minDelay, maxDelay]);

  const handleDismiss = () => {
    setCurrent(null);
    setDismissed(true);
  };

  return (
    <AnimatePresence>
      {current && (
        <motion.div
          key={current.id}
          initial={{ opacity: 0, x: -100, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -100, y: 20 }}
          transition={{ duration: 0.5, ease: EASE.expo }}
          className="fixed bottom-6 left-4 md:left-6 z-[90] max-w-[320px] rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden"
        >
          <div className="flex items-start gap-3 p-3">
            {/* Product image or icon */}
            {current.product?.image ? (
              <Link
                href={`/product/${current.product.slug}`}
                className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0"
              >
                <img
                  src={current.product.image}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </Link>
            ) : (
              <div className="w-12 h-12 rounded-xl bg-cyan-50 flex items-center justify-center flex-shrink-0">
                <ShoppingBag
                  className="w-5 h-5 text-cyan-600"
                  strokeWidth={1.7}
                />
              </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0 pr-6">
              <p
                className="text-xs text-gray-500 mb-1"
                style={{
                  fontFamily:
                    "var(--font-instrument), system-ui, sans-serif",
                }}
              >
                {formatMinutesAgo(current.minutesAgo)} · {current.city}
              </p>
              <p
                className="text-sm text-gray-900 leading-snug"
                style={{
                  fontFamily:
                    "var(--font-instrument), system-ui, sans-serif",
                  letterSpacing: "-0.01em",
                }}
              >
                <strong>{current.name}</strong>
                {current.product ? (
                  <>
                    {" "}
                    just ordered{" "}
                    <strong className="text-cyan-700">
                      {current.product.name.slice(0, 24)}
                    </strong>
                  </>
                ) : (
                  " just placed an order"
                )}
              </p>
            </div>

            {/* Dismiss */}
            <button
              type="button"
              onClick={handleDismiss}
              className="absolute top-2 right-2 w-6 h-6 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          {/* Bottom accent line */}
          <div className="h-0.5 bg-gradient-to-r from-cyan-400 via-cyan-500 to-transparent" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}