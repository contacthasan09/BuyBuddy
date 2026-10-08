"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Search,
  Download,
  CheckSquare,
  Square,
  X,
} from "lucide-react";
import { adminApi } from "@/lib/api";
import { formatBDT, formatDateTime } from "@/lib/utils";
import { ORDER_STATUS_LABELS_EN } from "@/lib/constants";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { fadeUp, staggerFast, EASE } from "@/lib/motion";

interface Order {
  _id: string;
  invoice: string;
  customerName: string;
  customerPhone: string;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

const STATUSES = [
  "ALL",
  "PENDING",
  "CONFIRMED",
  "SHIPMENT_CREATED",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkUpdating, setBulkUpdating] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);

  const load = () => {
    setLoading(true);
    adminApi
      .listOrders({
        page: 1,
        limit: 100,
        ...(filterStatus !== "ALL" && { status: filterStatus }),
        ...(search && { search }),
      })
      .then((res: any) => setOrders(res?.items || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus, search]);

  const toggleSelect = (id: string) => {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === orders.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(orders.map((o) => o._id)));
    }
  };

  const clearSelection = () => {
    setSelected(new Set());
    setBulkOpen(false);
  };

  const handleBulkStatusChange = async (newStatus: string) => {
    setBulkUpdating(true);
    try {
      await Promise.all(
        Array.from(selected).map((id) =>
          adminApi.updateOrderStatus(id, newStatus).catch(() => null)
        )
      );
      clearSelection();
      load();
    } finally {
      setBulkUpdating(false);
    }
  };

  const handleExportCSV = () => {
    const rows = orders.map((o) => ({
      Invoice: o.invoice,
      Customer: o.customerName,
      Phone: o.customerPhone,
      Total: o.total,
      Status: o.status,
      Payment: o.paymentStatus,
      Date: o.createdAt,
    }));

    const headers = Object.keys(rows[0] || {});
    const csv = [
      headers.join(","),
      ...rows.map((r) =>
        headers
          .map((h) => {
            const val = (r as any)[h];
            return typeof val === "string" && val.includes(",")
              ? `"${val}"`
              : val;
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-[11px] tracking-[0.25em] uppercase text-gray-500 mb-2">
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
            Orders
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            disabled={orders.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-gray-200 text-sm font-medium hover:border-gray-900 transition-colors disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by invoice, name, or phone..."
            className="input-ltx pl-11"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`flex-shrink-0 px-3.5 py-2 rounded-full text-xs font-medium transition-colors ${
                filterStatus === s
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {s === "ALL" ? "All" : ORDER_STATUS_LABELS_EN[s] || s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
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
        ) : orders.length === 0 ? (
          <p className="text-sm text-gray-500 py-8 text-center">
            No orders found.
          </p>
        ) : (
          <div className="overflow-x-auto -mx-2">
            <table className="w-full min-w-[720px]">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
                  <th className="px-2 py-3 w-10">
                    <button
                      type="button"
                      onClick={toggleAll}
                      className="text-gray-400 hover:text-gray-900"
                      aria-label="Select all"
                    >
                      {selected.size === orders.length &&
                      orders.length > 0 ? (
                        <CheckSquare className="w-4 h-4" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="px-2 py-3 font-medium">Invoice</th>
                  <th className="px-2 py-3 font-medium">Customer</th>
                  <th className="px-2 py-3 font-medium">Total</th>
                  <th className="px-2 py-3 font-medium">Status</th>
                  <th className="px-2 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <motion.tr
                    key={o._id}
                    variants={fadeUp}
                    className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-2 py-3">
                      <button
                        type="button"
                        onClick={() => toggleSelect(o._id)}
                        className="text-gray-400 hover:text-gray-900"
                        aria-label="Select row"
                      >
                        {selected.has(o._id) ? (
                          <CheckSquare className="w-4 h-4 text-cyan-600" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                    <td className="px-2 py-3">
                      <Link
                        href={`/admin/orders/${o._id}`}
                        className="font-mono text-xs text-cyan-700 hover:underline"
                        style={{ fontFamily: "monospace" }}
                      >
                        {o.invoice}
                      </Link>
                    </td>
                    <td className="px-2 py-3">
                      <p className="text-sm font-medium text-gray-900">
                        {o.customerName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {o.customerPhone}
                      </p>
                    </td>
                    <td className="px-2 py-3 text-sm font-medium">
                      {formatBDT(o.total)}
                    </td>
                    <td className="px-2 py-3">
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="px-2 py-3 text-xs text-gray-500">
                      {formatDateTime(o.createdAt)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Bulk action bar */}
      <AnimatePresence>
        {selected.size > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE.expo }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-5 py-3 rounded-full bg-gray-900 text-white shadow-2xl"
          >
            <span className="text-sm font-medium whitespace-nowrap">
              {selected.size} selected
            </span>
            <div className="w-px h-6 bg-white/20" />
            <button
              type="button"
              onClick={() => setBulkOpen(true)}
              className="text-sm font-medium hover:text-cyan-300 transition-colors whitespace-nowrap"
            >
              Update status
            </button>
            <button
              type="button"
              onClick={clearSelection}
              className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
              aria-label="Clear"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bulk status modal */}
      <AnimatePresence>
        {bulkOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => !bulkUpdating && setBulkOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.96, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 12 }}
              className="w-full max-w-sm p-6 rounded-3xl bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Update {selected.size} orders
              </h2>
              <p className="text-sm text-gray-500 mb-5">
                Choose a new status for all selected orders.
              </p>
              <div className="space-y-2">
                {["CONFIRMED", "PROCESSING", "CANCELLED", "DELIVERED"].map(
                  (s) => (
                    <button
                      key={s}
                      type="button"
                      disabled={bulkUpdating}
                      onClick={() => handleBulkStatusChange(s)}
                      className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 hover:border-gray-900 hover:bg-gray-50 transition-colors text-sm font-medium disabled:opacity-50"
                    >
                      {ORDER_STATUS_LABELS_EN[s] || s}
                    </button>
                  )
                )}
              </div>
              {bulkUpdating && (
                <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating...
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}