"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, Plus } from "lucide-react";
import { adminApi } from "@/lib/api";
import { formatBDT, getProductPrice } from "@/lib/utils";
import { fadeUp, staggerFast } from "@/lib/motion";

interface Product {
  _id: string;
  name: string;
  sku: string;
  images: string[];
  sellingPrice: number;
  discountPrice?: number;
  status: string;
  isFeatured: boolean;
  stock?: { available: number };
  category?: { name: string } | string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .listProducts({ page: 1, limit: 50 })
      .then((res: any) => setProducts(res?.items || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-end justify-between mb-8">
        <div>
          <p
            className="text-[11px] tracking-[0.25em] uppercase text-gray-500 mb-2"
            style={{
              fontFamily: "var(--font-instrument), system-ui, sans-serif",
            }}
          >
            Manage
          </p>
          <h1
            className="text-gray-900"
            style={{
              fontFamily: "var(--font-instrument), system-ui, sans-serif",
              fontSize: "clamp(28px, 3vw, 40px)",
              fontWeight: 500,
              letterSpacing: "-0.03em",
            }}
          >
            Products
          </h1>
        </div>
        <span className="text-sm text-gray-500">
          {products.length} total
        </span>
      </div>

      <motion.div
        variants={staggerFast}
        initial="hidden"
        animate="visible"
        className="p-6 md:p-8 rounded-3xl bg-white border border-gray-100"
      >
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
          </div>
        ) : products.length === 0 ? (
          <p className="text-sm text-gray-500 py-8 text-center">
            No products yet.
          </p>
        ) : (
          <div className="overflow-x-auto -mx-2">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
                  <th className="px-2 py-3 font-medium">Product</th>
                  <th className="px-2 py-3 font-medium">SKU</th>
                  <th className="px-2 py-3 font-medium">Price</th>
                  <th className="px-2 py-3 font-medium">Stock</th>
                  <th className="px-2 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <motion.tr
                    key={p._id}
                    variants={fadeUp}
                    className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-2 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 overflow-hidden flex-shrink-0">
                          {p.images?.[0] && (
                            <img
                              src={p.images[0]}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <span
                          className="text-sm font-medium text-gray-900 line-clamp-1"
                          style={{
                            fontFamily:
                              "var(--font-instrument), system-ui, sans-serif",
                          }}
                        >
                          {p.name}
                        </span>
                      </div>
                    </td>
                    <td
                      className="px-2 py-3 text-xs text-gray-500 font-mono"
                      style={{ fontFamily: "monospace" }}
                    >
                      {p.sku}
                    </td>
                    <td
                      className="px-2 py-3 text-sm font-medium"
                      style={{
                        fontFamily:
                          "var(--font-instrument), system-ui, sans-serif",
                      }}
                    >
                      {formatBDT(getProductPrice(p as any))}
                    </td>
                    <td className="px-2 py-3 text-sm text-gray-700">
                      {p.stock?.available ?? 0}
                    </td>
                    <td className="px-2 py-3">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider ${
                          p.status === "active"
                            ? "bg-green-50 text-green-800"
                            : "bg-gray-100 text-gray-700"
                        }`}
                        style={{
                          fontFamily:
                            "var(--font-instrument), system-ui, sans-serif",
                        }}
                      >
                        {p.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}