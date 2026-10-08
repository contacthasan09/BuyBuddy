"use client";

import { useState, useEffect, useCallback } from "react";

export interface ViewedProduct {
  _id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  viewedAt: number;
}

const STORAGE_KEY = "bd_recently_viewed_v1";
const MAX_ITEMS = 8;

export function useRecentlyViewed() {
  const [items, setItems] = useState<ViewedProduct[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setItems(parsed.slice(0, MAX_ITEMS));
      }
    } catch {}
  }, []);

  const track = useCallback((product: ViewedProduct) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      let current: ViewedProduct[] = [];
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) current = parsed;
      }

      // Remove existing entry for this product
      const filtered = current.filter((p) => p._id !== product._id);

      // Add to front
      const next = [{ ...product, viewedAt: Date.now() }, ...filtered].slice(
        0,
        MAX_ITEMS
      );

      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setItems(next);
    } catch {}
  }, []);

  const clear = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setItems([]);
  }, []);

  return { items, track, clear, mounted };
}