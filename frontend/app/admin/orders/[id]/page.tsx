"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  ArrowLeft,
  Truck,
  CheckCircle2,
  Package,
  MapPin,
  Phone,
  User,
  Banknote,
  Copy,
  Check,
  ExternalLink,
  Clock,
  Home,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { adminApi } from "@/lib/api";
import { formatBDT, formatDateTime } from "@/lib/utils";
import { ORDER_STATUS_LABELS_EN } from "@/lib/constants";
import { EASE } from "@/lib/motion";

/* ═══════════════════════════════════════════════════════
   Status → icon map for timeline
   ═══════════════════════════════════════════════════════ */
const STATUS_ICONS: Record<string, any> = {
  PENDING: Clock,
  CONFIRMED: CheckCircle2,
  PROCESSING: Package,
  SHIPMENT_CREATED: Truck,
  PICKED_UP: Truck,
  IN_TRANSIT: Truck,
  OUT_FOR_DELIVERY: MapPin,
  DELIVERED: Home,
  CANCELLED: XCircle,
  FAILED_DELIVERY: XCircle,
  RETURN_REQUESTED: Package,
  RETURNED: Package,
};

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [order, setOrder] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingShipment, setCreatingShipment] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const load = async () => {
    try {
      const res = await adminApi.getOrder(id);
      setOrder(res.order);
      setHistory(res.history || []);
    } catch (err: any) {
      setError(err?.message || "Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleCreateShipment = async () => {
    setCreatingShipment(true);
    setError("");
    setSuccessMsg("");
    try {
      const result = await adminApi.createShipment(id);
      setSuccessMsg(
        `Shipment created · Tracking: ${
          (result as any)?.shipment?.trackingCode || "—"
        }`
      );
      await load();
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err: any) {
      setError(err?.message || "Failed to create shipment");
    } finally {
      setCreatingShipment(false);
    }
  };

  const handleRefreshShipment = async () => {
    setRefreshing(true);
    setError("");
    try {
      await adminApi.refreshShipment(id);
      await load();
    } catch (err: any) {
      setError(err?.message || "Failed to refresh shipment status");
    } finally {
      setRefreshing(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!newStatus) return;
    setUpdatingStatus(true);
    setError("");
    try {
      await adminApi.updateOrderStatus(id, newStatus);
      await load();
    } catch (err: any) {
      setError(err?.message || "Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 mb-4">Order not found</p>
        <Link
          href="/admin/orders"
          className="text-cyan-700 hover:underline text-sm"
        >
          ← Back to orders
        </Link>
      </div>
    );
  }

  const canCreateShipment =
    !order.courier?.consignmentId &&
    (order.status === "CONFIRMED" || order.status === "PENDING" || order.status === "PROCESSING");

  const statusIcon =
    STATUS_ICONS[order.status] || Clock;

  return (
    <div>
      {/* ══════════════════════════════════════════════════
          Back link
         ══════════════════════════════════════════════════ */}
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to orders
      </Link>

      {/* ══════════════════════════════════════════════════
          Header
         ══════════════════════════════════════════════════ */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
        <div>
          <p
            className="text-[11px] tracking-[0.25em] uppercase text-gray-500 mb-2"
            style={{
              fontFamily: "var(--font-instrument), system-ui, sans-serif",
            }}
          >
            Order
          </p>
          <h1
            className="text-gray-900"
            style={{
              fontFamily: "monospace",
              fontSize: "clamp(20px, 2.5vw, 28px)",
              fontWeight: 600,
              letterSpacing: "-0.01em",
            }}
          >
            {order.invoice}
          </h1>
          <p className="text-xs text-gray-500 mt-2">
            Placed {formatDateTime(order.createdAt)}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <StatusBadge status={order.status} />
          <button
            type="button"
            onClick={load}
            disabled={refreshing}
            className="w-9 h-9 rounded-full border border-gray-200 hover:border-gray-900 flex items-center justify-center transition-colors disabled:opacity-50"
            title="Refresh order"
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
              strokeWidth={1.7}
            />
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          Alerts
         ══════════════════════════════════════════════════ */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm"
          >
            {error}
          </motion.div>
        )}
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6 p-4 rounded-2xl bg-green-50 border border-green-200 text-green-700 text-sm flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            {successMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════
          Main grid: content + actions sidebar
         ══════════════════════════════════════════════════ */}
      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        {/* ── LEFT COLUMN ── */}
        <div className="space-y-6">
          {/* Customer & delivery */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE.expo }}
            className="p-6 rounded-3xl bg-white border border-gray-100"
          >
            <h2
              className="text-gray-900 mb-5"
              style={{
                fontFamily: "var(--font-instrument), system-ui, sans-serif",
                fontSize: "15px",
                fontWeight: 600,
              }}
            >
              Customer & delivery
            </h2>

            <div className="grid sm:grid-cols-2 gap-5 text-sm">
              <div>
                <p className="text-[10px] tracking-wider uppercase text-gray-500 mb-1 flex items-center gap-1">
                  <User className="w-3 h-3" /> Customer
                </p>
                <p className="font-medium text-gray-900">
                  {order.customerName}
                </p>
                {order.customerEmail && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    {order.customerEmail}
                  </p>
                )}
              </div>

              <div>
                <p className="text-[10px] tracking-wider uppercase text-gray-500 mb-1 flex items-center gap-1">
                  <Phone className="w-3 h-3" /> Phone
                </p>
                <a
                  href={`tel:${order.customerPhone}`}
                  className="font-medium text-gray-900 hover:text-cyan-700"
                >
                  {order.customerPhone}
                </a>
              </div>

              <div className="sm:col-span-2">
                <p className="text-[10px] tracking-wider uppercase text-gray-500 mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Delivery address
                </p>
                <p className="text-gray-700 leading-relaxed">
                  {order.address}
                  {order.area && `, ${order.area}`}, {order.district}
                </p>
              </div>

              {order.note && (
                <div className="sm:col-span-2 p-3 rounded-xl bg-amber-50 border border-amber-100">
                  <p className="text-[10px] tracking-wider uppercase text-amber-700 mb-1">
                    Delivery note
                  </p>
                  <p className="text-sm text-amber-900">{order.note}</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Items */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: EASE.expo }}
            className="p-6 rounded-3xl bg-white border border-gray-100"
          >
            <h2
              className="text-gray-900 mb-5"
              style={{
                fontFamily: "var(--font-instrument), system-ui, sans-serif",
                fontSize: "15px",
                fontWeight: 600,
              }}
            >
              Items ({order.items?.length || 0})
            </h2>

            <div className="space-y-3">
              {order.items?.map((item: any, i: number) => (
                <div key={i} className="flex gap-3">
                  {item.image && (
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                      <img
                        src={item.image}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium text-gray-900 line-clamp-2"
                      style={{
                        fontFamily:
                          "var(--font-instrument), system-ui, sans-serif",
                      }}
                    >
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {item.sku} · {item.quantity} ×{" "}
                      {formatBDT(item.unitPrice)}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                    {formatBDT(item.subtotal)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-5 pt-5 border-t border-gray-100 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">
                  {formatBDT(order.subtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery</span>
                <span className="font-medium">
                  {formatBDT(order.deliveryCharge)}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount</span>
                  <span className="font-medium text-green-700">
                    −{formatBDT(order.discount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-base pt-2 border-t border-gray-100">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-cyan-700">
                  {formatBDT(order.total)}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: EASE.expo }}
            className="p-6 rounded-3xl bg-white border border-gray-100"
          >
            <h2
              className="text-gray-900 mb-5"
              style={{
                fontFamily: "var(--font-instrument), system-ui, sans-serif",
                fontSize: "15px",
                fontWeight: 600,
              }}
            >
              Timeline
            </h2>

            {history.length === 0 ? (
              <p className="text-sm text-gray-500 py-4">
                No status changes yet.
              </p>
            ) : (
              <div className="space-y-4">
                {history.map((h, i) => {
                  const Icon = STATUS_ICONS[h.status] || Clock;
                  const isLast = i === history.length - 1;
                  return (
                    <motion.div
                      key={h._id || i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.4 }}
                      className="relative flex gap-4"
                    >
                      {!isLast && (
                        <div className="absolute left-5 top-11 bottom-0 w-px bg-gray-200" />
                      )}

                      <div
                        className={`relative w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isLast
                            ? "bg-cyan-500 text-white"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        <Icon className="w-4 h-4" strokeWidth={1.7} />
                      </div>

                      <div className="flex-1 pb-2">
                        <p
                          className="font-medium text-gray-900"
                          style={{
                            fontFamily:
                              "var(--font-instrument), system-ui, sans-serif",
                            fontSize: "14px",
                            letterSpacing: "-0.01em",
                          }}
                        >
                          {ORDER_STATUS_LABELS_EN[h.status] || h.status}
                        </p>
                        {h.note && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            {h.note}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDateTime(h.createdAt)} · by {h.changedBy}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>

        {/* ── RIGHT COLUMN: Actions ── */}
        <div className="space-y-4 lg:sticky lg:top-24 h-fit">
          {/* Courier / Shipment */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: EASE.expo }}
            className="p-6 rounded-3xl bg-white border border-gray-100"
          >
            <h2
              className="text-gray-900 mb-4 flex items-center gap-2"
              style={{
                fontFamily: "var(--font-instrument), system-ui, sans-serif",
                fontSize: "15px",
                fontWeight: 600,
              }}
            >
              <Truck className="w-4 h-4" />
              Courier
            </h2>

            {order.courier?.consignmentId ? (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-green-50 border border-green-100">
                  <p className="text-[10px] tracking-wider uppercase text-green-700 mb-1">
                    Shipment created
                  </p>
                  <div className="flex items-center gap-2">
                    <p
                      className="text-sm font-mono font-semibold text-green-900"
                      style={{ fontFamily: "monospace" }}
                    >
                      {order.courier.trackingCode || "—"}
                    </p>
                    {order.courier.trackingCode && (
                      <button
                        type="button"
                        onClick={() =>
                          copyToClipboard(order.courier.trackingCode)
                        }
                        className="text-green-700 hover:text-green-900 transition-colors"
                        aria-label="Copy tracking code"
                      >
                        {copied ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-gray-500">
                  Consignment ID: {order.courier.consignmentId}
                </p>
                <p className="text-xs text-gray-500">
                  Provider: {order.courier.provider || "STEADFAST"}
                </p>

                <div className="flex flex-col gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleRefreshShipment}
                    disabled={refreshing}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-gray-200 text-sm font-medium hover:border-gray-900 transition-colors disabled:opacity-60"
                  >
                    <RefreshCw
                      className={`w-3.5 h-3.5 ${
                        refreshing ? "animate-spin" : ""
                      }`}
                    />
                    Refresh status
                  </button>

                  {order.courier.trackingCode && (
                    <a
                      href={`https://portal.packzy.com/tracking/${order.courier.trackingCode}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 text-xs text-cyan-700 hover:underline py-1"
                    >
                      Track on Steadfast
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ) : canCreateShipment ? (
              <>
                <p className="text-xs text-gray-500 mb-3">
                  Ready to create shipment via Steadfast. Auto-retry runs
                  every 15 minutes if this fails.
                </p>
                <button
                  type="button"
                  onClick={handleCreateShipment}
                  disabled={creatingShipment}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-gray-900 text-white font-medium text-sm hover:bg-gray-800 disabled:opacity-60 transition-colors"
                >
                  {creatingShipment ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Truck className="w-4 h-4" />
                      Create shipment
                    </>
                  )}
                </button>
              </>
            ) : (
              <p className="text-xs text-gray-500">
                Shipment cannot be created from status &quot;
                {ORDER_STATUS_LABELS_EN[order.status] || order.status}&quot;.
              </p>
            )}
          </motion.div>

          {/* Payment */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: EASE.expo }}
            className="p-6 rounded-3xl bg-white border border-gray-100"
          >
            <h2
              className="text-gray-900 mb-4 flex items-center gap-2"
              style={{
                fontFamily: "var(--font-instrument), system-ui, sans-serif",
                fontSize: "15px",
                fontWeight: 600,
              }}
            >
              <Banknote className="w-4 h-4" />
              Payment
            </h2>

            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Method</span>
                <span className="font-medium text-gray-900">
                  {order.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span
                  className={`font-medium ${
                    order.paymentStatus === "PAID"
                      ? "text-green-700"
                      : "text-gray-900"
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount</span>
                <span className="font-semibold text-cyan-700">
                  {formatBDT(order.total)}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Update status */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25, ease: EASE.expo }}
            className="p-6 rounded-3xl bg-white border border-gray-100"
          >
            <h2
              className="text-gray-900 mb-4 flex items-center gap-2"
              style={{
                fontFamily: "var(--font-instrument), system-ui, sans-serif",
                fontSize: "15px",
                fontWeight: 600,
              }}
            >
              <CheckCircle2 className="w-4 h-4" />
              Update status
            </h2>

            <p className="text-xs text-gray-500 mb-3">
              Current:{" "}
              <span className="font-medium text-gray-700">
                {ORDER_STATUS_LABELS_EN[order.status] || order.status}
              </span>
            </p>

            <select
              onChange={(e) => {
                const val = e.target.value;
                if (val) handleStatusChange(val);
                e.target.value = "";
              }}
              disabled={updatingStatus}
              defaultValue=""
              className="input-ltx"
            >
              <option value="" disabled>
                {updatingStatus ? "Updating..." : "Choose new status"}
              </option>
              {[
                "CONFIRMED",
                "PROCESSING",
                "SHIPMENT_CREATED",
                "IN_TRANSIT",
                "OUT_FOR_DELIVERY",
                "DELIVERED",
                "CANCELLED",
                "FAILED_DELIVERY",
                "RETURN_REQUESTED",
                "RETURNED",
              ].map((s) => (
                <option key={s} value={s}>
                  {ORDER_STATUS_LABELS_EN[s] || s}
                </option>
              ))}
            </select>

            {updatingStatus && (
              <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                <Loader2 className="w-3 h-3 animate-spin" />
                Applying change...
              </div>
            )}

            <p className="text-[10px] text-gray-400 mt-3 leading-relaxed">
              Status changes trigger automatic notifications and history
              entries. Courier-driven updates come through webhooks.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   StatusBadge
   ═══════════════════════════════════════════════════════ */
function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    PENDING: "bg-yellow-50 text-yellow-800 border-yellow-200",
    CONFIRMED: "bg-blue-50 text-blue-800 border-blue-200",
    PROCESSING: "bg-blue-50 text-blue-800 border-blue-200",
    SHIPMENT_CREATED: "bg-indigo-50 text-indigo-800 border-indigo-200",
    PICKED_UP: "bg-indigo-50 text-indigo-800 border-indigo-200",
    IN_TRANSIT: "bg-indigo-50 text-indigo-800 border-indigo-200",
    OUT_FOR_DELIVERY: "bg-purple-50 text-purple-800 border-purple-200",
    DELIVERED: "bg-green-50 text-green-800 border-green-200",
    CANCELLED: "bg-red-50 text-red-800 border-red-200",
    FAILED_DELIVERY: "bg-red-50 text-red-800 border-red-200",
    RETURN_REQUESTED: "bg-orange-50 text-orange-800 border-orange-200",
    RETURNED: "bg-gray-100 text-gray-800 border-gray-200",
  };

  return (
    <span
      className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider border ${
        colors[status] || "bg-gray-50 text-gray-700 border-gray-200"
      }`}
      style={{
        fontFamily: "var(--font-instrument), system-ui, sans-serif",
      }}
    >
      {ORDER_STATUS_LABELS_EN[status] || status}
    </span>
  );
}