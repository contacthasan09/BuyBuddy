"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX_COMPARE = 4;

export interface CompareItem {
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  originalPrice?: number;
  specifications: { key: string; value: string }[];
  stock: number;
  addedAt: number;
}

interface CompareState {
  items: CompareItem[];
  addItem: (item: Omit<CompareItem, "addedAt">) => boolean;
  removeItem: (productId: string) => void;
  toggleItem: (item: Omit<CompareItem, "addedAt">) => boolean;
  clear: () => void;
  hasItem: (productId: string) => boolean;
  count: () => number;
  isFull: () => boolean;
}

export const useCompare = create<CompareState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const items = get().items;
        if (items.some((i) => i.productId === item.productId)) return false;
        if (items.length >= MAX_COMPARE) return false;
        set({
          items: [...items, { ...item, addedAt: Date.now() }],
        });
        return true;
      },

      removeItem: (productId) =>
        set({
          items: get().items.filter((i) => i.productId !== productId),
        }),

      toggleItem: (item) => {
        if (get().hasItem(item.productId)) {
          get().removeItem(item.productId);
          return true;
        }
        return get().addItem(item);
      },

      clear: () => set({ items: [] }),

      hasItem: (productId) =>
        get().items.some((i) => i.productId === productId),

      count: () => get().items.length,

      isFull: () => get().items.length >= MAX_COMPARE,
    }),
    {
      name: "bd-compare-v1",
      version: 1,
    }
  )
);