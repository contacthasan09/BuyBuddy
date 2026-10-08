"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Plus,
  Package,
  AlertTriangle,
  CheckCircle2,
  X,
  Search,
} from "lucide-react";
import { adminApi } from "@/lib/api";
import { fadeUp, staggerFast, EASE } from "@/lib/motion";

interface InventoryItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    sku: string;
    sellingPrice: number;
  };
  physical: number;
  reserved: number;
  available: number;
  lowStockThreshold: number;
}

export default function AdminInventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [addStockOpen, setAddStockOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [quantity, setQuantity] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // New: search + low-stock filter
  const [search, setSearch] = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(false);

  const load = async () => {
    try {
      const res = await adminApi.listInventory();
      setItems(Array.isArray(res) ? res : []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openAddStock = (item: InventoryItem) => {
    setSelectedItem(item);
    setQuantity("");
    setNote("");
    setError("");
    setAddStockOpen(true);
  };

  const handleAddStock = async () => {
    if (!selectedItem || !quantity) return;
    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      setError("Enter a positive number");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await adminApi.addStock(
        selectedItem.product._id,
        qty,
        note || undefined
      );
      await load();
      setAddStockOpen(false);
    } catch (err: any) {
      setError(err?.message || "Failed to add stock");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Derived ──
  const totalPhysical = items.reduce((s, i) => s + (i.physical || 0), 0);
  const totalReserved = items.reduce((s, i) => s + (i.reserved || 0), 0);
  const totalAvailable = items.reduce((s, i) => s + (i.available || 0), 0);
  const lowStockCount = items.filter(
    (i) => i.available <= i.lowStockThreshold
  ).length;

  // ── Filtered list ──
  const filtered = items.filter((i) => {
    if (lowStockOnly && i.available > i.lowStockThreshold) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      i.product?.name?.toLowerCase().includes(q) ||
      i.product?.sku?.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      {/* ══════════════════════════════════════════════════
          Header
         ══════════════════════════════════════════════════ */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
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
            Inventory
          </h1>
        </div>
        <p className="text-sm text-gray-500">
          {items.length} product{items.length !== 1 ? "s" : ""} tracked
        </p>
      </div>

      {/* ══════════════════════════════════════════════════
          Summary stats
         ══════════════════════════════════════════════════ */}
      <motion.div
        variants={staggerFast}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <motion.div
          variants={fadeUp}
          className="p-5 rounded-3xl bg-white border border-gray-100"
        >
          <div className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center mb-3">
            <Package className="w-4 h-4 text-gray-700" strokeWidth={1.7} />
          </div>
          <p className="text-xs text-gray-500 mb-1">Total physical</p>
          <p className="text-2xl font-semibold tracking-tight">
            {totalPhysical}
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="p-5 rounded-3xl bg-white border border-gray-100"
        >
          <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center mb-3">
            <Package className="w-4 h-4 text-amber-700" strokeWidth={1.7} />
          </div>
          <p className="text-xs text-gray-500 mb-1">Reserved</p>
          <p className="text-2xl font-semibold tracking-tight">
            {totalReserved}
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="p-5 rounded-3xl bg-white border border-gray-100"
        >
          <div className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center mb-3">
            <CheckCircle2
              className="w-4 h-4 text-green-700"
              strokeWidth={1.7}
            />
          </div>
          <p className="text-xs text-gray-500 mb-1">Available</p>
          <p className="text-2xl font-semibold tracking-tight">
            {totalAvailable}
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="p-5 rounded-3xl bg-white border border-gray-100"
        >
          <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center mb-3">
            <AlertTriangle
              className="w-4 h-4 text-red-700"
              strokeWidth={1.7}
            />
          </div>
          <p className="text-xs text-gray-500 mb-1">Low stock</p>
          <p className="text-2xl font-semibold tracking-tight">
            {lowStockCount}
          </p>
        </motion.div>
      </motion.div>

      {/* ══════════════════════════════════════════════════
          Search + filter bar
         ══════════════════════════════════════════════════ */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="flex flex-col md:flex-row gap-3 mb-6"
      >
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name or SKU..."
            className="input-ltx pl-11"
          />
        </div>

        <button
          type="button"
          onClick={() => setLowStockOnly((v) => !v)}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
            lowStockOnly
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          Low stock only
          {lowStockCount > 0 && (
            <span
              className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                lowStockOnly
                  ? "bg-white/20 text-white"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {lowStockCount}
            </span>
          )}
        </button>
      </motion.div>

      {/* ══════════════════════════════════════════════════
          Table
         ══════════════════════════════════════════════════ */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="p-6 md:p-8 rounded-3xl bg-white border border-gray-100"
      >
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-gray-500 py-8 text-center">
            {search || lowStockOnly
              ? "No items match your filters."
              : "No inventory records."}
          </p>
        ) : (
          <div className="overflow-x-auto -mx-2">
            <table className="w-full min-w-[760px]">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
                  <th className="px-2 py-3 font-medium">Product</th>
                  <th className="px-2 py-3 font-medium">SKU</th>
                  <th className="px-2 py-3 font-medium text-right">
                    Physical
                  </th>
                  <th className="px-2 py-3 font-medium text-right">
                    Reserved
                  </th>
                  <th className="px-2 py-3 font-medium text-right">
                    Available
                  </th>
                  <th className="px-2 py-3 font-medium">Status</th>
                  <th className="px-2 py-3 font-medium text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => {
                  const isLow =
                    item.available <= item.lowStockThreshold &&
                    item.available > 0;
                  const isOut = item.available <= 0;

                  return (
                    <tr
                      key={item._id}
                      className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td
                        className="px-2 py-3 text-sm text-gray-900"
                        style={{
                          fontFamily:
                            "var(--font-instrument), system-ui, sans-serif",
                        }}
                      >
                        {item.product?.name || "—"}
                      </td>
                      <td
                        className="px-2 py-3 text-xs text-gray-500"
                        style={{ fontFamily: "monospace" }}
                      >
                        {item.product?.sku || "—"}
                      </td>
                      <td className="px-2 py-3 text-sm text-right font-medium">
                        {item.physical}
                      </td>
                      <td className="px-2 py-3 text-sm text-right text-amber-700">
                        {item.reserved}
                      </td>
                      <td
                        className={`px-2 py-3 text-sm text-right font-semibold ${
                          isOut
                            ? "text-red-600"
                            : isLow
                            ? "text-amber-600"
                            : "text-green-700"
                        }`}
                      >
                        {item.available}
                      </td>
                      <td className="px-2 py-3">
                        {isOut ? (
                          <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider bg-red-50 text-red-700 border border-red-200">
                            OUT
                          </span>
                        ) : isLow ? (
                          <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                            LOW
                          </span>
                        ) : (
                          <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider bg-green-50 text-green-800 border border-green-200">
                            OK
                          </span>
                        )}
                      </td>
                      <td className="px-2 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => openAddStock(item)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-900 text-white hover:bg-gray-800 transition-colors"
                          style={{
                            fontFamily:
                              "var(--font-instrument), system-ui, sans-serif",
                          }}
                        >
                          <Plus className="w-3 h-3" />
                          Add stock
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* ══════════════════════════════════════════════════
          Add stock modal
         ══════════════════════════════════════════════════ */}
      <AnimatePresence>
        {addStockOpen && selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => !submitting && setAddStockOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, ease: EASE.expo }}
              className="w-full max-w-md p-6 rounded-3xl bg-white border border-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-5">
                <div className="flex-1 min-w-0 pr-4">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-gray-500 mb-1">
                    Add stock
                  </p>
                  <h2
                    className="text-gray-900 line-clamp-2"
                    style={{
                      fontFamily:
                        "var(--font-instrument), system-ui, sans-serif",
                      fontSize: "18px",
                      fontWeight: 600,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {selectedItem.product?.name}
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    SKU: {selectedItem.product?.sku}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAddStockOpen(false)}
                  disabled={submitting}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors flex-shrink-0"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Current stock summary */}
              <div className="grid grid-cols-3 gap-3 mb-5 p-3 rounded-2xl bg-gray-50">
                <div>
                  <p className="text-[10px] tracking-wider uppercase text-gray-500 mb-0.5">
                    Physical
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {selectedItem.physical}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] tracking-wider uppercase text-gray-500 mb-0.5">
                    Reserved
                  </p>
                  <p className="text-sm font-semibold text-amber-700">
                    {selectedItem.reserved}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] tracking-wider uppercase text-gray-500 mb-0.5">
                    Available
                  </p>
                  <p className="text-sm font-semibold text-green-700">
                    {selectedItem.available}
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">
                    Quantity to add *
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="50"
                    autoFocus
                    className="input-ltx"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">
                    Note (optional)
                  </label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Received from supplier"
                    className="input-ltx"
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-xs">{error}</p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setAddStockOpen(false)}
                  disabled={submitting}
                  className="flex-1 px-5 py-3 rounded-full border border-gray-200 text-gray-900 font-medium hover:border-gray-900 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddStock}
                  disabled={submitting || !quantity}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-gray-900 text-white font-medium hover:bg-gray-800 disabled:opacity-60 transition-colors text-sm"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      Add stock
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}