"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, Truck, ExternalLink } from "lucide-react";
import { adminApi } from "@/lib/api";
import { formatBDT, formatDateTime } from "@/lib/utils";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { fadeUp, staggerFast } from "@/lib/motion";

interface ShipmentOrder {
  _id: string;
  invoice: string;
  customerName: string;
  customerPhone: string;
  total: number;
  status: string;
  courier?: {
    provider?: string;
    consignmentId?: string;
    trackingCode?: string;
  };
  createdAt: string;
}

export default function AdminShipmentsPage() {
  const [orders, setOrders] = useState<ShipmentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    adminApi
      .listOrders({ page: 1, limit: 100 })
      .then((res: any) => {
        const items: ShipmentOrder[] = res?.items || [];
        setOrders(items.filter((o) => o.courier?.consignmentId));
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div>
      <div className="mb-8">
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
          Shipments
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          {orders.length} consignment{orders.length !== 1 ? "s" : ""} created
          via Steadfast
        </p>
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
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4">
              <Truck className="w-6 h-6 text-gray-400" strokeWidth={1.5} />
            </div>
            <p className="text-sm text-gray-500">
              No shipments yet. Create one from an order detail page.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-2">
            <table className="w-full min-w-[760px]">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
                  <th className="px-2 py-3 font-medium">Invoice</th>
                  <th className="px-2 py-3 font-medium">Customer</th>
                  <th className="px-2 py-3 font-medium">Courier</th>
                  <th className="px-2 py-3 font-medium">Tracking</th>
                  <th className="px-2 py-3 font-medium">Status</th>
                  <th className="px-2 py-3 font-medium">COD</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr
                    key={o._id}
                    className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                  >
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
                    <td className="px-2 py-3">
                      <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider bg-indigo-50 text-indigo-800 border border-indigo-200">
                        {o.courier?.provider || "STEADFAST"}
                      </span>
                    </td>
                    <td className="px-2 py-3">
                      <button
                        type="button"
                        onClick={() =>
                          copy(o.courier?.trackingCode || "", o._id)
                        }
                        className="font-mono text-xs text-gray-700 hover:text-cyan-700 inline-flex items-center gap-1"
                        style={{ fontFamily: "monospace" }}
                        title="Click to copy"
                      >
                        {copiedId === o._id
                          ? "Copied ✓"
                          : o.courier?.trackingCode}
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </td>
                    <td className="px-2 py-3">
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="px-2 py-3 text-sm font-medium">
                      {formatBDT(o.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}