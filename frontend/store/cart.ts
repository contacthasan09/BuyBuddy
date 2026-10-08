"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types";
import { STORAGE_KEYS } from "@/lib/constants";

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  subtotal: () => number;
  itemCount: () => number;
  hasItem: (productId: string) => boolean;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item, quantity = 1) => {
        const items = get().items;
        const existing = items.find((i) => i.productId === item.productId);

        if (existing) {
          set({
            items: items.map((i) =>
              i.productId === item.productId
                ? {
                    ...i,
                    quantity: Math.min(i.quantity + quantity, i.stockAvailable),
                  }
                : i
            ),
          });
        } else {
          set({
            items: [
              ...items,
              {
                ...item,
                quantity: Math.min(quantity, item.stockAvailable),
              },
            ],
          });
        }
      },

      removeItem: (productId) =>
        set({ items: get().items.filter((i) => i.productId !== productId) }),

      updateQuantity: (productId, quantity) =>
        set({
          items: get()
            .items.map((i) =>
              i.productId === productId
                ? {
                    ...i,
                    quantity: Math.max(1, Math.min(quantity, i.stockAvailable)),
                  }
                : i
            )
            .filter((i) => i.quantity > 0),
        }),

      clear: () => set({ items: [] }),

      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      itemCount: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),

      hasItem: (productId) =>
        get().items.some((i) => i.productId === productId),
    }),
    {
      name: STORAGE_KEYS.CART,
      version: 1,
    }
  )
);