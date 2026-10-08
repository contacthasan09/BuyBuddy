"use client";

import { ReactNode } from "react";

// Cart state is managed by Zustand store (useCart).
// This provider exists only to keep the app shell organized.
// Add cart-related side effects here if needed later.

export function CartProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}