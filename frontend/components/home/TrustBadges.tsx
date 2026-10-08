"use client";

import { Truck, Shield, RotateCcw, Banknote } from "lucide-react";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";

const BADGES = [
  { icon: Banknote, title: "Cash on Delivery", subtitle: "Pay when it arrives" },
  { icon: Truck, title: "Fast Delivery", subtitle: "2-4 days nationwide" },
  { icon: Shield, title: "Quality Checked", subtitle: "Verified products" },
  { icon: RotateCcw, title: "7-Day Returns", subtitle: "No questions asked" },
];

export function TrustBadges() {
  return (
    <section className="border-b border-gray-100 bg-white">
      <div className="container-x py-8 md:py-10">
        <motion.div
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {BADGES.map((badge) => (
            <motion.div
              key={badge.title}
              variants={fadeUp}
              className="flex items-center gap-3"
            >
              <div className="w-11 h-11 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                <badge.icon
                  className="w-5 h-5 text-gray-900"
                  strokeWidth={1.6}
                />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate tracking-tight">
                  {badge.title}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {badge.subtitle}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}