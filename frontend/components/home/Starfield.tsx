"use client";

import { useEffect, useRef } from "react";

export function Starfield() {
  const aRef = useRef<HTMLDivElement>(null);
  const bRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const gen = (count: number, blur: number, minA: number, maxA: number) =>
      Array.from({ length: count }, () => {
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const alpha = minA + Math.random() * (maxA - minA);
        return `${x.toFixed(2)}vw ${y.toFixed(2)}vh ${blur}px 0 rgba(255,255,255,${alpha.toFixed(2)})`;
      }).join(", ");

    if (aRef.current) {
      aRef.current.style.boxShadow = gen(120, 0, 0.05, 0.3);
    }
    if (bRef.current) {
      bRef.current.style.boxShadow = gen(18, 1.2, 0.35, 0.7);
    }
  }, []);

  // Server renders empty divs; client fills box-shadow after mount
  return (
    <>
      <div ref={aRef} className="stars" aria-hidden="true" />
      <div ref={bRef} className="stars" aria-hidden="true" />
    </>
  );
}