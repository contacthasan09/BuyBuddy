"use client";

import { motion } from "framer-motion";
import { formatBDT } from "@/lib/utils";
import { EASE } from "@/lib/motion";

interface DayBucket {
  date: string;
  count: number;
  revenue: number;
}

interface SalesChartProps {
  data: DayBucket[];
}

export function SalesChart({ data }: SalesChartProps) {
  if (data.length === 0) return null;

  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1);
  const W = 720;
  const H = 220;
  const PAD_TOP = 24;
  const PAD_BOTTOM = 44;
  const PAD_LEFT = 8;
  const PAD_RIGHT = 8;

  const usableW = W - PAD_LEFT - PAD_RIGHT;
  const usableH = H - PAD_TOP - PAD_BOTTOM;
  const stepX = usableW / Math.max(data.length - 1, 1);

  // Build points
  const points = data.map((d, i) => {
    const x = PAD_LEFT + i * stepX;
    const ratio = d.revenue / maxRevenue;
    const y = PAD_TOP + (1 - ratio) * usableH;
    return { x, y, ...d };
  });

  // Build smooth path (Catmull-Rom → Cubic Bezier)
  const pathD = buildSmoothPath(points);

  // Build area fill path
  const areaD =
    pathD +
    ` L ${points[points.length - 1].x} ${H - PAD_BOTTOM} L ${
      points[0].x
    } ${H - PAD_BOTTOM} Z`;

  return (
    <div className="w-full">
      <div className="relative w-full">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto"
          style={{ overflow: "visible" }}
        >
          <defs>
            <linearGradient id="revenue-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3ec8e4" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#3ec8e4" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="revenue-line" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#8ef4ff" />
              <stop offset="50%" stopColor="#3ec8e4" />
              <stop offset="100%" stopColor="#0b859d" />
            </linearGradient>
          </defs>

          {/* Horizontal grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((r) => {
            const y = PAD_TOP + r * usableH;
            return (
              <line
                key={r}
                x1={PAD_LEFT}
                x2={W - PAD_RIGHT}
                y1={y}
                y2={y}
                stroke="rgba(11,26,38,0.06)"
                strokeDasharray="3 3"
              />
            );
          })}

          {/* Area fill */}
          <motion.path
            d={areaD}
            fill="url(#revenue-area)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: EASE.expo }}
          />

          {/* Line */}
          <motion.path
            d={pathD}
            fill="none"
            stroke="url(#revenue-line)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.4, ease: EASE.expo }}
          />

          {/* Dots + labels */}
          {points.map((p, i) => (
            <g key={i}>
              {/* Dot */}
              <motion.circle
                cx={p.x}
                cy={p.y}
                r="4"
                fill="#ffffff"
                stroke="#3ec8e4"
                strokeWidth="2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.6 + i * 0.08,
                  duration: 0.4,
                  ease: EASE.expo,
                }}
              />
              {/* Value label */}
              <motion.text
                x={p.x}
                y={p.y - 14}
                textAnchor="middle"
                fontSize="10"
                fontWeight="600"
                fill="#0b1a26"
                initial={{ opacity: 0, y: p.y - 8 }}
                animate={{ opacity: 1, y: p.y - 14 }}
                transition={{
                  delay: 0.7 + i * 0.08,
                  duration: 0.4,
                  ease: EASE.expo,
                }}
                style={{
                  fontFamily: "var(--font-instrument), system-ui, sans-serif",
                }}
              >
                {p.revenue > 0 ? formatBDT(p.revenue).replace("৳", "৳") : ""}
              </motion.text>
              {/* X-axis date */}
              <text
                x={p.x}
                y={H - PAD_BOTTOM + 20}
                textAnchor="middle"
                fontSize="10"
                fill="#6b7280"
                style={{
                  fontFamily: "var(--font-instrument), system-ui, sans-serif",
                }}
              >
                {formatDayLabel(p.date)}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

function buildSmoothPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  const path: string[] = [`M ${points[0].x} ${points[0].y}`];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    path.push(
      `C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(
        2
      )} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`
    );
  }
  return path.join(" ");
}

function formatDayLabel(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en", { weekday: "short" });
}