"use client";

import { useRef, useState, type MouseEvent } from "react";

/* ——————————————————————————————————————————————
   Palette — Maison edition
—————————————————————————————————————————————— */
const T = {
  bg: "#EFE7D4",
  ink: "#1C1612",
  inkSoft: "#5C4F42",
  gold: "#B8935A",
  goldBright: "#D4B478",
  goldLeaf: "#E8D4A0",
  wine: "#5A1A1F",
  bone: "#F7F1E3",
};

interface ImageZoomProps {
  src: string;
  alt: string;
  zoomLevel?: number;
}

export function ImageZoom({ src, alt, zoomLevel = 2 }: ImageZoomProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [zooming, setZooming] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPosition({ x, y });
  };

  return (
    <div
      ref={ref}
      className="absolute inset-0 cursor-zoom-in overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setZooming(true)}
      onMouseLeave={() => setZooming(false)}
    >
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover select-none"
        draggable={false}
        style={{
          transform: zooming ? `scale(${zoomLevel})` : "scale(1)",
          transformOrigin: `${position.x}% ${position.y}%`,
          transition: "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      />

      {/* Elegant Zoom Hint */}
      <div
        className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm pointer-events-none transition-all duration-500"
        style={{
          background: zooming ? "transparent" : `${T.bone}E6`,
          backdropFilter: zooming ? "none" : "blur(8px)",
          border: zooming ? "1px solid transparent" : `1px solid ${T.gold}40`,
          opacity: zooming ? 0 : 1,
          transform: zooming ? "translateY(8px)" : "translateY(0)",
        }}
        aria-hidden
      >
        {/* Minimal magnifying glass icon */}
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          style={{ color: T.gold }}
        >
          <circle cx="4" cy="4" r="3" stroke="currentColor" strokeWidth="1" />
          <path d="M6.5 6.5 L9 9" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        </svg>
        <span
          className="text-[9px] tracking-[0.25em] uppercase font-medium"
          style={{ color: T.ink, fontFamily: "var(--font-fraunces), Georgia, serif" }}
        >
          Inspect
        </span>
      </div>
    </div>
  );
}