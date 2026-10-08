"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { formatBDT, getProductPrice } from "@/lib/utils";
import type { Product } from "@/types";

const RADIUS = 620;
const CARD_W = 200;
const CARD_H = 280;
const CULL_ANGLE = 60; // only show cards within this angle
const SPEED = 0.6; // degrees per second

export function ProductRing({ products }: { products: Product[] }) {
  const ringRef = useRef<HTMLDivElement>(null);
  const phaseRef = useRef(-6);
  const rafRef = useRef<number>();
  const lastRef = useRef<number>(0);

  useEffect(() => {
    const el = ringRef.current;
    if (!el) return;

    const cards = Array.from(
      el.querySelectorAll<HTMLElement>(".ring-card")
    );
    if (cards.length === 0) return;

    const n = cards.length;
    const step = 360 / n;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const place = (phase: number) => {
      for (let i = 0; i < n; i++) {
        const card = cards[i];
        const a = ((((i * step + phase) % 360) + 540) % 360) - 180;
        if (Math.abs(a) > CULL_ANGLE) {
          card.style.visibility = "hidden";
          continue;
        }
        card.style.visibility = "visible";
        const r = (a * Math.PI) / 180;
        const c = Math.cos(r);
        const tx = RADIUS * Math.sin(r);
        const tz = RADIUS * (1 - c);
        card.style.transform = `translate3d(${tx.toFixed(2)}px, 0, ${tz.toFixed(2)}px) rotateY(${(-a).toFixed(2)}deg)`;
        const brightness = 0.72 + 0.55 * (1 / Math.max(c, 0.3) - 1);
        card.style.filter = `brightness(${brightness.toFixed(2)})`;
      }
    };

    const tick = (t: number) => {
      if (!lastRef.current) lastRef.current = t;
      const dt = Math.min((t - lastRef.current) / 1000, 0.1);
      lastRef.current = t;

      if (!reduced) {
        phaseRef.current -= SPEED * dt;
      }
      place(phaseRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };

    place(phaseRef.current);
    rafRef.current = requestAnimationFrame(tick);

    const onVis = () => {
      if (!document.hidden) lastRef.current = 0;
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [products]);

  return (
    <div className="product-ring" ref={ringRef}>
      {products.map((p, i) => {
        const price = getProductPrice(p);
        const image =
          p.images?.[0] ||
          `https://placehold.co/400x560/0d1117/9ad9ec?text=${encodeURIComponent(p.name.slice(0, 12))}`;
        return (
          <Link
            key={p._id}
            href={`/product/${p.slug}`}
            className="ring-card"
          >
            <img
              src={image}
              alt={p.name}
              loading={i < 3 ? "eager" : "lazy"}
            />
            <div className="ring-info">
              <div className="ring-name">{p.name}</div>
              <div className="ring-price">{formatBDT(price)}</div>
            </div>
            <div className="ring-edge" />
          </Link>
        );
      })}
    </div>
  );
}