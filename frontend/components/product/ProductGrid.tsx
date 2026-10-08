"use client";

import { motion } from "framer-motion";
import { ProductCard } from "./ProductCard";
import { staggerFast, viewportOnce } from "@/lib/motion";
import type { Product } from "@/types";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <motion.div
      variants={staggerFast}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-8 md:gap-x-4"
    >
      {products.map((product, i) => (
        <ProductCard key={product._id} product={product} index={i} />
      ))}
    </motion.div>
  );
}