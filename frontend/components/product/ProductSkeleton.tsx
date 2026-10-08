"use client";

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
  boneDeep: "#E8DFCB",
};

/* ——————————————————————————————————————————————
   Shimmer block — warm gold sweep
—————————————————————————————————————————————— */
function ShimmerBlock({
  className = "",
  delay = "0s",
}: {
  className?: string;
  delay?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        background: T.boneDeep,
        border: `0.5px solid ${T.gold}25`,
      }}
    >
      <div
        className="absolute inset-0 -translate-x-full animate-[shimmer_2.4s_infinite]"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${T.goldLeaf}80 50%, transparent 100%)`,
          animationDelay: delay,
        }}
      />
    </div>
  );
}

/* ——————————————————————————————————————————————
   Product card skeleton
—————————————————————————————————————————————— */
export function ProductCardSkeleton() {
  return (
    <div
      className="relative overflow-hidden rounded-sm"
      style={{
        background: T.bone,
        border: `1px solid ${T.gold}30`,
        boxShadow: `0 1px 0 ${T.gold}20, 0 12px 24px -12px rgba(28,22,18,0.15)`,
      }}
    >
      {/* Inner gold hairline */}
      <div
        className="absolute inset-1.5 pointer-events-none z-20 rounded-sm"
        style={{ border: `0.5px solid ${T.gold}`, opacity: 0.2 }}
        aria-hidden
      />

      {/* Corner ornaments */}
      {[
        { top: 5, left: 5, rotate: 0 },
        { top: 5, right: 5, rotate: 90 },
        { bottom: 5, right: 5, rotate: 180 },
        { bottom: 5, left: 5, rotate: 270 },
      ].map(({ rotate, ...pos }, idx) => (
        <div
          key={idx}
          className="absolute z-20 w-2.5 h-2.5 pointer-events-none"
          style={{ ...pos, transform: `rotate(${rotate}deg)` }}
          aria-hidden
        >
          <svg viewBox="0 0 10 10" fill="none">
            <path d="M0 0 L10 0 L10 10" stroke={T.gold} strokeWidth="0.7" opacity="0.5" />
            <circle cx="0.8" cy="0.8" r="0.6" fill={T.gold} opacity="0.7" />
          </svg>
        </div>
      ))}

      {/* Image area */}
      <div className="relative aspect-square">
        <ShimmerBlock className="absolute inset-0" />

        {/* Wax seal placeholder */}
        <div
          className="absolute top-2.5 right-2.5 z-20 h-9 w-9 rounded-full"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${T.goldBright}60, ${T.gold}40 70%, #8A6B3A40 100%)`,
            border: `0.5px solid ${T.gold}40`,
          }}
          aria-hidden
        />
      </div>

      {/* Body */}
      <div className="p-3 flex items-start justify-between gap-2">
        {/* Left: name + tag */}
        <div className="flex-1 min-w-0 space-y-2">
          <ShimmerBlock className="h-3.5 w-4/5" delay="0.1s" />
          <ShimmerBlock className="h-3.5 w-3/5" delay="0.2s" />
          <ShimmerBlock className="h-2.5 w-1/3 mt-1.5" delay="0.3s" />
        </div>

        {/* Right: price */}
        <div className="shrink-0 space-y-1.5 text-right">
          <ShimmerBlock className="h-4 w-14 ml-auto" delay="0.15s" />
          <ShimmerBlock className="h-2.5 w-10 ml-auto" delay="0.25s" />
        </div>
      </div>
    </div>
  );
}

/* ——————————————————————————————————————————————
   Product grid skeleton
—————————————————————————————————————————————— */
export function ProductGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-8 md:gap-x-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}