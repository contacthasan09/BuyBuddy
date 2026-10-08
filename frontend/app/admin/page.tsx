"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  TrendingUp,
  Package,
  Truck,
  Users,
  AlertTriangle,
  Loader2,
  ArrowRight,
  Home,
} from "lucide-react";
import { adminApi } from "@/lib/api";
import { formatBDT } from "@/lib/utils";
import { StatCard } from "@/components/admin/StatCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { SalesChart } from "@/components/admin/SalesChart";
import { staggerFast, fadeUp } from "@/lib/motion";
import { groupOrdersByDay } from "@/lib/admin-helpers";

interface Order {
  _id: string;
  invoice: string;
  customerName: string;
  total: number;
  status: string;
  createdAt: string;
}

interface InventoryItem {
  available: number;
  lowStockThreshold: number;
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [customerCount, setCustomerCount] = useState(0);

  useEffect(() => {
    Promise.all([
      adminApi.listOrders({ page: 1, limit: 100 }).catch(() => null),
      adminApi.listInventory().catch(() => null),
      adminApi.listCustomers().catch(() => null),
    ])
      .then(([ordersRes, invRes, custRes]) => {
        const items: Order[] = (ordersRes as any)?.items || [];
        setOrders(items);
        setInventory(Array.isArray(invRes) ? invRes : []);
        setCustomerCount(Array.isArray(custRes) ? custRes.length : 0);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  // ── Computed stats ──
  const totalOrders = orders.length;
  const delivered = orders.filter((o) => o.status === "DELIVERED");
  const pending = orders.filter(
    (o) => o.status === "PENDING" || o.status === "CONFIRMED"
  );
  const inTransit = orders.filter((o) =>
    ["SHIPMENT_CREATED", "PICKED_UP", "IN_TRANSIT", "OUT_FOR_DELIVERY"].includes(
      o.status
    )
  );
  const cancelled = orders.filter(
    (o) => o.status === "CANCELLED" || o.status === "FAILED_DELIVERY"
  );

  const totalRevenue = delivered.reduce((s, o) => s + (o.total || 0), 0);
  const totalPipeline = [...pending, ...inTransit].reduce(
    (s, o) => s + (o.total || 0),
    0
  );
  const avgOrder =
    totalOrders > 0
      ? orders.reduce((s, o) => s + (o.total || 0), 0) / totalOrders
      : 0;

  const deliveryRate =
    totalOrders > 0 ? (delivered.length / totalOrders) * 100 : 0;

  const lowStock = inventory.filter(
    (i) => i.available <= i.lowStockThreshold
  ).length;

  const recentOrders = orders.slice(0, 6);
  const chartData = groupOrdersByDay(orders, 7);

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-[11px] tracking-[0.25em] uppercase text-gray-500 mb-2">
            Overview
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
            Dashboard
          </h1>
        </div>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          View all orders <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Primary stats */}
      <motion.div
        variants={staggerFast}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        <StatCard
          label="Total orders"
          value={totalOrders}
          icon={ShoppingBag}
          hint={`${pending.length} pending`}
        />
        <StatCard
          label="Delivered revenue"
          value={formatBDT(totalRevenue)}
          icon={TrendingUp}
          accent="success"
          hint={`${delivered.length} orders`}
        />
        <StatCard
          label="In transit"
          value={inTransit.length}
          icon={Truck}
          accent="warn"
          hint={formatBDT(totalPipeline)}
        />
        <StatCard
          label="Avg. order"
          value={formatBDT(Math.round(avgOrder))}
          icon={TrendingUp}
          hint="Across all orders"
        />
      </motion.div>

      {/* Secondary stats */}
      <motion.div
        variants={staggerFast}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <StatCard
          label="Customers"
          value={customerCount}
          icon={Users}
          hint="Total registrations"
        />
        <StatCard
          label="Low stock items"
          value={lowStock}
          icon={AlertTriangle}
          accent={lowStock > 0 ? "danger" : "default"}
          hint={lowStock > 0 ? "Needs restocking" : "All good"}
        />
        <StatCard
          label="Delivery rate"
          value={`${deliveryRate.toFixed(1)}%`}
          icon={Home}
          accent={deliveryRate > 80 ? "success" : "warn"}
        />
        <StatCard
          label="Cancelled"
          value={cancelled.length}
          icon={ShoppingBag}
          accent={cancelled.length > 0 ? "danger" : "default"}
        />
      </motion.div>

      {/* Sales chart */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="p-6 md:p-8 rounded-3xl bg-white border border-gray-100 mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-gray-500 mb-1">
              Revenue
            </p>
            <h2
              className="text-gray-900"
              style={{
                fontFamily: "var(--font-instrument), system-ui, sans-serif",
                fontSize: "17px",
                fontWeight: 600,
                letterSpacing: "-0.02em",
              }}
            >
              Last 7 days
            </h2>
          </div>
          <p
            className="text-2xl font-semibold text-cyan-700 tracking-tight"
            style={{
              fontFamily: "var(--font-instrument), system-ui, sans-serif",
              letterSpacing: "-0.02em",
            }}
          >
            {formatBDT(chartData.reduce((s, d) => s + d.revenue, 0))}
          </p>
        </div>

        <SalesChart data={chartData} />
      </motion.div>

      {/* Recent orders */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="p-6 md:p-8 rounded-3xl bg-white border border-gray-100"
      >
        <div className="flex items-center justify-between mb-6">
          <h2
            className="text-gray-900"
            style={{
              fontFamily: "var(--font-instrument), system-ui, sans-serif",
              fontSize: "17px",
              fontWeight: 600,
              letterSpacing: "-0.02em",
            }}
          >
            Recent orders
          </h2>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            View all
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-sm text-gray-500 py-8 text-center">
            No orders yet.
          </p>
        ) : (
          <div className="overflow-x-auto -mx-2">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
                  <th className="px-2 py-3 font-medium">Invoice</th>
                  <th className="px-2 py-3 font-medium">Customer</th>
                  <th className="px-2 py-3 font-medium">Total</th>
                  <th className="px-2 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
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
                    <td className="px-2 py-3 text-sm text-gray-900">
                      {o.customerName}
                    </td>
                    <td className="px-2 py-3 text-sm font-medium">
                      {formatBDT(o.total)}
                    </td>
                    <td className="px-2 py-3">
                      <StatusBadge status={o.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Quick actions */}
      <motion.div
        variants={staggerFast}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6"
      >
        {[
          { href: "/admin/products/new", label: "Add product", icon: Package },
          {
            href: "/admin/inventory",
            label: "Manage stock",
            icon: AlertTriangle,
          },
          { href: "/admin/shipments", label: "Shipments", icon: Truck },
          { href: "/admin/settings", label: "Settings", icon: Users },
        ].map((a) => (
          <motion.div key={a.href} variants={fadeUp}>
            <Link
              href={a.href}
              className="block p-5 rounded-3xl bg-white border border-gray-100 hover:border-gray-900 transition-colors group"
            >
              <a.icon
                className="w-5 h-5 text-gray-700 mb-3 group-hover:text-cyan-700 transition-colors"
                strokeWidth={1.7}
              />
              <p className="text-sm font-medium text-gray-900">{a.label}</p>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}