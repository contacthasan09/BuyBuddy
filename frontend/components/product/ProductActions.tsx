"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Zap, Check } from "lucide-react";
import { useCart } from "@/store/cart";
import { useCartDrawer } from "@/store/cart-drawer";
import { useToast } from "@/components/providers/ToastProvider";
import { getProductPrice } from "@/lib/utils";
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

interface ProductActionsProps {
  product: Product;
  quantity: number;
  imageRef?: React.RefObject<HTMLElement>;
}

export function ProductActions({
  product,
  quantity,
  imageRef,
}: ProductActionsProps) {
  const router = useRouter();
  const { toast } = useToast();
  const addItem = useCart((s) => s.addItem);
  const openDrawer = useCartDrawer((s) => s.open);

  const [adding, setAdding] = useState(false);

  const stock = product.stock?.available ?? 0;
  const price = getProductPrice(product);
  const primaryImage =
    product.images?.[0] || "https://placehold.co/600x600?text=Product";

  const buildCartItem = () => ({
    productId: product._id,
    name: product.name,
    slug: product.slug,
    image: primaryImage,
    price,
    originalPrice: product.sellingPrice,
    stockAvailable: stock,
  });

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (stock === 0 || adding) return;

    if (imageRef?.current) {
      flyToCart({ from: imageRef.current });
    }

    setAdding(true);
    try {
      addItem(buildCartItem(), quantity);
      toast(`Added ${quantity} × ${product.name}`, "success");
      setTimeout(() => openDrawer(), 250);
    } catch {
      toast("Failed to add to cart", "error");
    } finally {
      setTimeout(() => setAdding(false), 1200);
    }
  };

  const handleBuyNow = () => {
    if (stock === 0) return;

    if (imageRef?.current) {
      flyToCart({ from: imageRef.current });
    }

    addItem(buildCartItem(), quantity);
    setTimeout(() => router.push("/checkout"), 400);
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

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Add to cart */}
      <motion.button
        type="button"
        onClick={handleAddToCart}
        disabled={adding}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.3, ease: EASE.expo }}
        className="flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-sm transition-all duration-300 disabled:opacity-60"
        style={{
          background: adding ? `${T.wine}15` : T.ink,
          border: `1px solid ${adding ? T.wine : T.gold}60`,
          color: adding ? T.wine : T.goldLeaf,
          fontFamily: "var(--font-fraunces), Georgia, serif",
          fontSize: "11px",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          fontWeight: 500,
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {adding ? (
            <motion.span
              key="check"
              initial={{ scale: 0, opacity: 0, y: 8 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: EASE.expo }}
              className="flex items-center gap-2"
            >
              <Check className="w-4 h-4" strokeWidth={2} />
              Added to cart
            </motion.span>
          ) : (
            <motion.span
              key="add"
              initial={{ scale: 0, opacity: 0, y: 8 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: EASE.expo }}
              className="flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
              Add to cart
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Buy now */}
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
        Buy now · COD
      </motion.button>
    </div>
  );
}