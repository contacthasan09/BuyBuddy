"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useWishlist } from "@/store/wishlist";
import { useToast } from "@/components/providers/ToastProvider";
import { EASE } from "@/lib/motion";

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

interface WishlistButtonProps {
  product: {
    _id: string;
    name: string;
    slug: string;
    image: string;
    price: number;
    originalPrice?: number;
  };
  variant?: "icon" | "full";
  className?: string;
}

export function WishlistButton({
  product,
  variant = "icon",
  className = "",
}: WishlistButtonProps) {
  const { toast } = useToast();
  const items = useWishlist((s) => s.items);
  const toggleItem = useWishlist((s) => s.toggleItem);

  const isWishlisted = items.some((i) => i.productId === product._id);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    toggleItem({
      productId: product._id,
      name: product.name,
      slug: product.slug,
      image: product.image,
      price: product.price,
      originalPrice: product.originalPrice,
    });

    toast(
      isWishlisted ? "Removed from collection" : "Added to collection",
      "success"
    );
  };

  if (variant === "full") {
    return (
      <motion.button
        type="button"
        onClick={handleToggle}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.3, ease: EASE.expo }}
        className={`inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-sm transition-all duration-300 ${className}`}
        style={{
          background: isWishlisted ? `${T.wine}10` : "transparent",
          border: `1px solid ${isWishlisted ? T.wine : `${T.gold}50`}`,
          color: isWishlisted ? T.wine : T.ink,
          fontFamily: "var(--font-fraunces), Georgia, serif",
          fontSize: "10px",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          fontWeight: 500,
        }}
        onMouseEnter={(e) => {
          if (!isWishlisted) {
            e.currentTarget.style.background = `${T.gold}10`;
            e.currentTarget.style.borderColor = T.gold;
          }
        }}
        onMouseLeave={(e) => {
          if (!isWishlisted) {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = `${T.gold}50`;
          }
        }}
      >
        <motion.div
          animate={{ scale: isWishlisted ? 1.1 : 1 }}
          transition={{ duration: 0.3, ease: EASE.expo }}
        >
          <Heart
            className="w-4 h-4 transition-colors duration-300"
            strokeWidth={1.5}
            style={{
              fill: isWishlisted ? T.wine : "transparent",
              color: isWishlisted ? T.wine : "currentColor",
            }}
          />
        </motion.div>
        {isWishlisted ? "Saved to Collection" : "Save to Collection"}
      </motion.button>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={handleToggle}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.92 }}
      transition={{ duration: 0.3, ease: EASE.expo }}
      className={`relative w-9 h-9 rounded-sm flex items-center justify-center transition-all duration-300 ${className}`}
      style={{
        background: isWishlisted ? `${T.wine}15` : `${T.bone}E6`,
        backdropFilter: "blur(8px)",
        border: `1px solid ${isWishlisted ? T.wine : `${T.gold}40`}`,
      }}
      aria-label={isWishlisted ? "Remove from collection" : "Add to collection"}
    >
      <motion.div
        animate={{
          scale: isWishlisted ? [1, 1.3, 1] : 1,
        }}
        transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <Heart
          className="w-4 h-4 transition-colors duration-300"
          strokeWidth={1.5}
          style={{
            fill: isWishlisted ? T.wine : "transparent",
            color: isWishlisted ? T.goldLeaf : T.inkSoft,
          }}
        />
      </motion.div>
    </motion.button>
  );
}