"use client";

import { ReactNode } from "react";
import { CartDrawer } from "@/components/cart/CartDrawer";

export function CartDrawerProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <CartDrawer />
    </>
  );
}