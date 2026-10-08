"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WishlistItem {
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  originalPrice?: number;
  addedAt: number;
}

interface WishlistState {
  items: WishlistItem[];
  addItem: (item: Omit<WishlistItem, "addedAt">) => void;
  removeItem: (productId: string) => void;
  toggleItem: (item: Omit<WishlistItem, "addedAt">) => void;
  clear: () => void;
  hasItem: (productId: string) => boolean;
  count: () => number;
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const items = get().items;
        if (items.some((i) => i.productId === item.productId)) return;
        set({
          items: [{ ...item, addedAt: Date.now() }, ...items],
        });
      },

      removeItem: (productId) =>
        set({
          items: get().items.filter((i) => i.productId !== productId),
        }),

      toggleItem: (item) => {
        if (get().hasItem(item.productId)) {
          get().removeItem(item.productId);
        } else {
          get().addItem(item);
        }
      },

      clear: () => set({ items: [] }),

      hasItem: (productId) =>
        get().items.some((i) => i.productId === productId),

      count: () => get().items.length,
    }),
    {
      name: "bd-wishlist-v1",
      version: 1,
    }
  )
);