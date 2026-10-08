"use client";

import { useEffect, useRef, useState } from "react";
import { formatBDT } from "@/lib/utils";

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function AnimatedNumber({
  value,
  duration = 600, // Slightly longer for a weighty, premium deceleration
  className,
  style,
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const startValueRef = useRef(value);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number>();

  useEffect(() => {
    startValueRef.current = displayValue;
    startTimeRef.current = null;

    const start = startValueRef.current;
    const end = value;
    const diff = end - start;

    // If no change, don't animate
    if (diff === 0) return;

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // easeOutExpo for a premium, weighty deceleration
      const eased =
        progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      const current = Math.round(start + diff * eased);
      setDisplayValue(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  return (
    <span 
      className={`tabular-nums ${className || ""}`} 
      style={{
        fontFamily: "var(--font-fraunces), Georgia, serif",
        ...style,
      }}
    >
      {formatBDT(displayValue)}
    </span>
  );
}