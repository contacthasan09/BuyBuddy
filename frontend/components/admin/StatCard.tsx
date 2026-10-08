"use client";

import { motion } from "framer-motion";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { fadeUp } from "@/lib/motion";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  hint?: string;
  accent?: "default" | "success" | "warn" | "danger";
}

const ACCENT_COLORS = {
  default: "bg-gray-50 text-gray-700",
  success: "bg-green-50 text-green-700",
  warn: "bg-amber-50 text-amber-700",
  danger: "bg-red-50 text-red-700",
};

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  hint,
  accent = "default",
}: StatCardProps) {
  return (
    <motion.div
      variants={fadeUp}
      className="p-5 rounded-3xl bg-white border border-gray-100"
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            ACCENT_COLORS[accent]
          }`}
        >
          <Icon className="w-4 h-4" strokeWidth={1.7} />
        </div>
        {typeof trend === "number" && (
          <div
            className={`flex items-center gap-1 text-xs font-medium ${
              trend >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {trend >= 0 ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {Math.abs(trend)}%
          </div>
        )}
      </div>

      <p
        className="text-xs text-gray-500 mb-1"
        style={{ fontFamily: "var(--font-instrument), system-ui, sans-serif" }}
      >
        {label}
      </p>
      <p
        className="font-semibold text-gray-900"
        style={{
          fontFamily: "var(--font-instrument), system-ui, sans-serif",
          fontSize: "clamp(22px, 2.2vw, 28px)",
          letterSpacing: "-0.025em",
        }}
      >
        {value}
      </p>

      {hint && (
        <p className="text-[11px] text-gray-400 mt-2 tracking-wide">
          {hint}
        </p>
      )}
    </motion.div>
  );
}