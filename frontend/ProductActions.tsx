"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/store/cart";
import { useToast } from "@/components/providers/ToastProvider";
import { getProductPrice } from "@/lib/utils";
import type { Product } from "@/types";

export function ProductActions({ product }: { product: Product }) {
  const router = useRouter();
  const { toast } = useToast();
  const addItem = useCart((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);
  const stock = product.stock?.available ?? 0;
  const price = getProductPrice(product);

  const addToCart = () => addItem({
    productId: product._id, name: product.name, slug: product.slug,
    image: product.images?.[0], price, originalPrice: product.sellingPrice, stockAvailable: stock,
  }, quantity);

  const handleAddToCart = () => {
    addToCart();
    toast(`Added ${quantity} x ${product.name} to cart`, "success");
  };

  const handleBuyNow = () => {
    addToCart();
    router.push("/checkout");
  };

  if (stock === 0) {
    return <div className="p-4 rounded-xl bg-gray-100 text-center text-gray-500 font-semibold">Out of stock</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity</label>
        <div className="inline-flex items-center border border-gray-200 rounded-full">
          <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-11 h-11 flex items-center justify-center hover:bg-gray-50 rounded-l-full" aria-label="Decrease">
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-12 text-center font-semibold">{quantity}</span>
          <button type="button" onClick={() => setQuantity((q) => Math.min(stock, q + 1))} className="w-11 h-11 flex items-center justify-center hover:bg-gray-50 rounded-r-full" aria-label="Increase">
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button type="button" onClick={handleAddToCart} className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full border-2 border-gray-900 text-gray-900 font-semibold hover:bg-gray-900 hover:text-white transition-colors">
          <ShoppingBag className="w-4 h-4" />Add to Cart
        </button>
        <button type="button" onClick={handleBuyNow} className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors">
          Buy Now - COD
        </button>
      </div>
    </div>
  );
}
