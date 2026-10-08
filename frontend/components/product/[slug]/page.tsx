"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, ShoppingBag, Zap } from "lucide-react";
import { useCart } from "@/store/cart";
import { useToast } from "@/components/providers/ToastProvider";
import { getProductPrice } from "@/lib/utils";
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

export function ProductActions({ product }: { product: Product }) {
  const router = useRouter();
  const { toast } = useToast();
  const addItem = useCart((s) => s.addItem);

  const [quantity, setQuantity] = useState(1);
  const stock = product.stock?.available ?? 0;
  const price = getProductPrice(product);

  const handleAddToCart = () => {
    addItem(
      {
        productId: product._id,
        name: product.name,
        slug: product.slug,
        image: product.images?.[0],
        price,
        originalPrice: product.sellingPrice,
        stockAvailable: stock,
      },
      quantity
    );
    toast(`Added ${quantity} × ${product.name} to cart`, "success");
  };

  const handleBuyNow = () => {
    addItem(
      {
        productId: product._id,
        name: product.name,
        slug: product.slug,
        image: product.images?.[0],
        price,
        originalPrice: product.sellingPrice,
        stockAvailable: stock,
      },
      quantity
    );
    router.push("/checkout");
  };

  if (stock === 0) {
    return (
      <div
        className="p-4 rounded-sm text-center"
        style={{
          background: T.bone,
          border: `1px solid ${T.gold}40`,
        }}
      >
        <span
          className="text-[10px] tracking-[0.3em] uppercase"
          style={{ color: T.inkSoft, fontFamily: "var(--font-fraunces), Georgia, serif" }}
        >
          Currently out of stock
        </span>
      </div>
    );
  }

  const canDecrease = quantity > 1;
  const canIncrease = quantity < stock;

  return (
    <div className="space-y-6">
      {/* Quantity Selector */}
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
          Quantity
        </label>

        <div
          className="inline-flex items-center rounded-sm overflow-hidden"
          style={{
            border: `1px solid ${T.gold}40`,
            background: T.bone,
            boxShadow: `0 1px 0 ${T.gold}20`,
          }}
        >
          {/* Decrease */}
          <motion.button
            type="button"
            onClick={() => canDecrease && setQuantity((q) => q - 1)}
            whileTap={canDecrease ? { scale: 0.92 } : undefined}
            disabled={!canDecrease}
            className="w-11 h-11 flex items-center justify-center transition-all duration-300 disabled:cursor-not-allowed"
            style={{
              color: canDecrease ? T.ink : T.inkSoft,
              opacity: canDecrease ? 1 : 0.35,
              borderRight: `1px solid ${T.gold}25`,
            }}
            onMouseEnter={(e) => {
              if (canDecrease) e.currentTarget.style.background = `${T.gold}10`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
            aria-label="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" strokeWidth={1.5} />
          </motion.button>

          {/* Value */}
          <div className="w-14 h-11 flex items-center justify-center relative overflow-hidden">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={quantity}
                initial={{ y: -12, opacity: 0, filter: "blur(4px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                exit={{ y: 12, opacity: 0, filter: "blur(4px)" }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="absolute tabular-nums font-medium"
                style={{
                  color: T.ink,
                  fontFamily: "var(--font-fraunces), Georgia, serif",
                  fontSize: "15px",
                }}
              >
                {quantity}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Increase */}
          <motion.button
            type="button"
            onClick={() => canIncrease && setQuantity((q) => q + 1)}
            whileTap={canIncrease ? { scale: 0.92 } : undefined}
            disabled={!canIncrease}
            className="w-11 h-11 flex items-center justify-center transition-all duration-300 disabled:cursor-not-allowed"
            style={{
              color: canIncrease ? T.ink : T.inkSoft,
              opacity: canIncrease ? 1 : 0.35,
              borderLeft: `1px solid ${T.gold}25`,
            }}
            onMouseEnter={(e) => {
              if (canIncrease) e.currentTarget.style.background = `${T.gold}10`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
            aria-label="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={1.5} />
          </motion.button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <motion.button
          type="button"
          onClick={handleAddToCart}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.3, ease: EASE.expo }}
          className="flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-sm transition-all duration-300"
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
          <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
          Add to Cart
        </motion.button>

        <motion.button
          type="button"
          onClick={handleBuyNow}
          whileHover={{ 
            y: -2, 
            boxShadow: `0 12px 32px -8px ${T.gold}70` 
          }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.3, ease: EASE.expo }}
          className="flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-sm transition-all duration-300"
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
          <Zap className="w-4 h-4 fill-current" strokeWidth={0} />
          Buy Now · COD
        </motion.button>
      </div>
    </div>
  );
}