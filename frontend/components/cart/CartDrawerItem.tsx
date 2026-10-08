"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { formatBDT } from "@/lib/utils";
import { useCart } from "@/store/cart";
import { useCartDrawer } from "@/store/cart-drawer";
import { EASE } from "@/lib/motion";
import type { CartItem } from "@/types";

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

interface CartDrawerItemProps {
  item: CartItem;
}

export function CartDrawerItem({ item }: CartDrawerItemProps) {
  const updateQuantity = useCart((s) => s.updateQuantity);
  const removeItem = useCart((s) => s.removeItem);
  const closeDrawer = useCartDrawer((s) => s.close);

  const handleClose = () => closeDrawer();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20, filter: "blur(4px)" }}
      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, x: -20, filter: "blur(4px)", height: 0, marginTop: 0 }}
      transition={{
        duration: 0.4,
        ease: EASE.expo,
        layout: { duration: 0.3 },
      }}
      className="relative flex gap-4 p-4 rounded-sm transition-all duration-300"
      style={{
        background: T.bg,
        border: `1px solid ${T.gold}25`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${T.gold}40`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = `${T.gold}25`;
      }}
    >
      {/* Inner gold hairline */}
      <div
        className="absolute inset-2 pointer-events-none rounded-sm"
        style={{ border: `0.5px solid ${T.gold}`, opacity: 0.15 }}
        aria-hidden
      />

      {/* Image */}
      <Link
        href={`/product/${item.slug}`}
        onClick={handleClose}
        className="w-20 h-20 rounded-sm overflow-hidden flex-shrink-0 relative z-10"
        style={{ border: `1px solid ${T.gold}30` }}
      >
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center"
            style={{ color: T.inkSoft, fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "11px" }}
          >
            No image
          </div>
        )}
      </Link>

      {/* Middle */}
      <div className="flex-1 min-w-0 relative z-10">
        <Link
          href={`/product/${item.slug}`}
          onClick={handleClose}
          className="block text-[13px] font-medium leading-snug line-clamp-2 transition-colors duration-300 hover:text-[color:var(--gold)]"
          style={{ color: T.ink, fontFamily: "var(--font-fraunces), Georgia, serif" }}
        >
          {item.name}
        </Link>

        <div className="flex items-baseline gap-2 mt-1.5">
          <span
            className="text-[14px] font-medium tabular-nums"
            style={{ color: T.ink, fontFamily: "var(--font-fraunces), Georgia, serif" }}
          >
            {formatBDT(item.price)}
          </span>
          {item.originalPrice && item.originalPrice > item.price && (
            <span 
              className="text-[11px] line-through tabular-nums"
              style={{ color: T.inkSoft, opacity: 0.6 }}
            >
              {formatBDT(item.originalPrice)}
            </span>
          )}
        </div>

        {/* Quantity controls */}
        <div className="flex items-center justify-between mt-3">
          <div 
            className="inline-flex items-center rounded-sm overflow-hidden"
            style={{ border: `1px solid ${T.gold}40`, background: T.bone }}
          >
            <motion.button
              type="button"
              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
              whileTap={item.quantity > 1 ? { scale: 0.92 } : undefined}
              disabled={item.quantity <= 1}
              className="w-8 h-8 flex items-center justify-center transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ borderRight: `1px solid ${T.gold}25` }}
              onMouseEnter={(e) => { if(item.quantity > 1) e.currentTarget.style.background = `${T.gold}10`; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" strokeWidth={1.5} style={{ color: T.ink }} />
            </motion.button>
            
            <motion.span
              key={item.quantity}
              initial={{ y: -8, opacity: 0, filter: "blur(4px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              exit={{ y: 8, opacity: 0, filter: "blur(4px)" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="w-8 text-center text-[12px] font-medium tabular-nums"
              style={{ color: T.ink, fontFamily: "var(--font-fraunces), Georgia, serif" }}
            >
              {item.quantity}
            </motion.span>
            
            <motion.button
              type="button"
              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
              whileTap={item.quantity < item.stockAvailable ? { scale: 0.92 } : undefined}
              disabled={item.quantity >= item.stockAvailable}
              className="w-8 h-8 flex items-center justify-center transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ borderLeft: `1px solid ${T.gold}25` }}
              onMouseEnter={(e) => { if(item.quantity < item.stockAvailable) e.currentTarget.style.background = `${T.gold}10`; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" strokeWidth={1.5} style={{ color: T.ink }} />
            </motion.button>
          </div>

          <motion.button
            type="button"
            onClick={() => removeItem(item.productId)}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 rounded-sm flex items-center justify-center transition-all duration-300"
            style={{ border: `1px solid ${T.gold}30` }}
            onMouseEnter={(e) => { 
              e.currentTarget.style.background = `${T.wine}10`; 
              e.currentTarget.style.borderColor = `${T.wine}40`; 
            }}
            onMouseLeave={(e) => { 
              e.currentTarget.style.background = "transparent"; 
              e.currentTarget.style.borderColor = `${T.gold}30`; 
            }}
            aria-label="Remove"
          >
            <Trash2 className="w-4 h-4" strokeWidth={1.5} style={{ color: T.inkSoft }} />
          </motion.button>
        </div>
      </div>

      {/* Right — line total */}
      <div
        className="text-[14px] font-medium tabular-nums self-start relative z-10 pt-1"
        style={{ color: T.ink, fontFamily: "var(--font-fraunces), Georgia, serif" }}
      >
        {formatBDT(item.price * item.quantity)}
      </div>
    </motion.div>
  );
}