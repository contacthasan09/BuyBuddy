"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Zap } from "lucide-react";
import { useCart } from "@/store/cart";
import { useCartDrawer } from "@/store/cart-drawer";
import { useToast } from "@/components/providers/ToastProvider";
import { formatBDT, getProductPrice } from "@/lib/utils";
import { flyToCart } from "@/lib/fly-to-cart";
import { EASE } from "@/lib/motion";
import type { Product } from "@/types";

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

interface StickyBuyBarProps {
  product: Product;
  quantity: number;
  triggerAfterPx?: number;
}

export function StickyBuyBar({
  product,
  quantity,
  triggerAfterPx = 600,
}: StickyBuyBarProps) {
  const [visible, setVisible] = useState(false);
  const addItem = useCart((s) => s.addItem);
  const openDrawer = useCartDrawer((s) => s.open);
  const { toast } = useToast();

  const price = getProductPrice(product);
  const stock = product.stock?.available ?? 0;
  const primaryImage =
    product.images?.[0] || "https://placehold.co/600x600?text=Product";

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > triggerAfterPx);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [triggerAfterPx]);

  if (stock === 0) return null;

  const handleAdd = () => {
    const cartBtn = document.querySelector<HTMLElement>("[data-cart-icon]");
    if (cartBtn) {
      flyToCart({ from: cartBtn });
    }

    addItem(
      {
        productId: product._id,
        name: product.name,
        slug: product.slug,
        image: primaryImage,
        price,
        originalPrice: product.sellingPrice,
        stockAvailable: stock,
      },
      quantity
    );
    toast(`Added ${quantity} × ${product.name}`, "success");
    setTimeout(() => openDrawer(), 250);
  };

  const handleBuyNow = () => {
    const cartBtn = document.querySelector<HTMLElement>("[data-cart-icon]");
    if (cartBtn) {
      flyToCart({ from: cartBtn });
    }
    addItem(
      {
        productId: product._id,
        name: product.name,
        slug: product.slug,
        image: primaryImage,
        price,
        originalPrice: product.sellingPrice,
        stockAvailable: stock,
      },
      quantity
    );
    setTimeout(() => window.location.href = "/checkout", 300);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="lg:hidden fixed bottom-0 left-0 right-0 z-[80]"
          style={{
            paddingBottom: "env(safe-area-inset-bottom)",
          }}
        >
          {/* Top gold rule */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background: `linear-gradient(90deg, transparent, ${T.gold}60 20%, ${T.gold}60 80%, transparent)`,
            }}
          />

          {/* Bar Container */}
          <div
            className="px-4 py-3.5"
            style={{
              background: `${T.bone}F5`,
              backdropFilter: "blur(20px) saturate(140%)",
              boxShadow: `0 -8px 32px -12px rgba(28,22,18,0.25)`,
            }}
          >
            <div className="flex items-center gap-3">
              {/* Price Info */}
              <div className="flex-1 min-w-0">
                <p
                  className="text-[9px] tracking-[0.35em] uppercase mb-0.5"
                  style={{ color: T.inkSoft, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                >
                  Total Allocation
                </p>
                <p
                  className="text-[18px] font-medium tabular-nums truncate"
                  style={{ color: T.ink, fontFamily: "var(--font-fraunces), Georgia, serif" }}
                >
                  {formatBDT(price * quantity)}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <motion.button
                  type="button"
                  onClick={handleAdd}
                  whileTap={{ scale: 0.96 }}
                  className="h-11 px-4 rounded-sm inline-flex items-center justify-center gap-1.5 transition-all duration-300"
                  style={{
                    background: "transparent",
                    border: `1px solid ${T.gold}50`,
                    color: T.ink,
                    fontFamily: "var(--font-fraunces), Georgia, serif",
                    fontSize: "10px",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    fontWeight: 500,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `${T.gold}15`;
                    e.currentTarget.style.borderColor = T.gold;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.borderColor = `${T.gold}50`;
                  }}
                >
                  <ShoppingBag className="w-3.5 h-3.5" strokeWidth={1.5} />
                  <span className="hidden sm:inline">Add</span>
                </motion.button>

                <motion.button
                  type="button"
                  onClick={handleBuyNow}
                  whileHover={{ y: -1, boxShadow: `0 6px 16px -4px ${T.gold}70` }}
                  whileTap={{ scale: 0.96 }}
                  className="h-11 px-5 rounded-sm inline-flex items-center justify-center gap-1.5 transition-all duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${T.goldBright}, ${T.gold})`,
                    color: T.ink,
                    fontFamily: "var(--font-fraunces), Georgia, serif",
                    fontSize: "10px",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                    boxShadow: `0 4px 12px -4px ${T.gold}50`,
                  }}
                >
                  <Zap className="w-3.5 h-3.5 fill-current" strokeWidth={0} />
                  Buy Now
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}