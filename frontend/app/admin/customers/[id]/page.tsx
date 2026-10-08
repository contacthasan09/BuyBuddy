"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Loader2,
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import { adminApi } from "@/lib/api";
import { formatBDT, formatDateTime } from "@/lib/utils";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { fadeUp, staggerFast } from "@/lib/motion";

interface Customer {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  addresses: {
    label?: string;
    district: string;
    area?: string;
    fullAddress: string;
    isDefault?: boolean;
  }[];
  totalOrders: number;
  totalSpent: number;
  firstOrderAt?: string;
  lastOrderAt?: string;
  tags: string[];
  notes?: string;
}

interface Order {
  _id: string;
  invoice: string;
  total: number;
  status: string;
  createdAt: string;
}

export default function AdminCustomerDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    adminApi
      .getCustomer(id)
      .then((c: any) => {
        setCustomer(c);
        // Fetch their orders by phone
        if (c?.phone) {
          adminApi
            .listOrders({ phone: c.phone, limit: 50, page: 1 })
            .then((res: any) => setOrders(res?.items || []))
            .catch(() => {});
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 mb-4">Customer not found</p>
        <Link
          href="/admin/customers"
          className="text-cyan-700 hover:underline"
        >
          ← Back to customers
        </Link>
      </div>
    );
  }

  const defaultAddress =
    customer.addresses?.find((a) => a.isDefault) || customer.addresses?.[0];

  return (
    <div>
      <Link
        href="/admin/customers"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to customers
      </Link>

      {/* Header */}
      <div className="mb-8">
        <p className="text-[11px] tracking-[0.25em] uppercase text-gray-500 mb-2">
          Customer
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
          {customer.name}
        </h1>
      </div>

      {/* Stats */}
      <motion.div
        variants={staggerFast}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
      >
        <motion.div
          variants={fadeUp}
          className="p-5 rounded-3xl bg-white border border-gray-100"
        >
          <div className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center mb-3">
            <ShoppingBag className="w-4 h-4 text-gray-700" />
          </div>
          <p className="text-xs text-gray-500 mb-1">Total orders</p>
          <p className="text-2xl font-semibold tracking-tight">
            {customer.totalOrders}
          </p>
        </motion.div>
        <motion.div
          variants={fadeUp}
          className="p-5 rounded-3xl bg-white border border-gray-100"
        >
          <div className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center mb-3">
            <TrendingUp className="w-4 h-4 text-green-700" />
          </div>
          <p className="text-xs text-gray-500 mb-1">Lifetime value</p>
          <p className="text-2xl font-semibold tracking-tight">
            {formatBDT(customer.totalSpent)}
          </p>
        </motion.div>
        <motion.div
          variants={fadeUp}
          className="p-5 rounded-3xl bg-white border border-gray-100"
        >
          <div className="w-9 h-9 rounded-full bg-cyan-50 flex items-center justify-center mb-3">
            <TrendingUp className="w-4 h-4 text-cyan-700" />
          </div>
          <p className="text-xs text-gray-500 mb-1">Avg. order</p>
          <p className="text-2xl font-semibold tracking-tight">
            {formatBDT(
              customer.totalOrders > 0
                ? Math.round(customer.totalSpent / customer.totalOrders)
                : 0
            )}
          </p>
        </motion.div>
      </motion.div>

      <div className="grid lg:grid-cols-[380px_1fr] gap-6">
        {/* Left: contact + addresses */}
        <div className="space-y-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="p-6 rounded-3xl bg-white border border-gray-100"
          >
            <h2 className="text-sm font-semibold text-gray-900 mb-4">
              Contact
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900">{customer.name}</span>
              </div>
              <a
                href={`tel:${customer.phone}`}
                className="flex items-center gap-3 text-sm text-gray-700 hover:text-cyan-700 transition-colors"
              >
                <Phone className="w-4 h-4 text-gray-400" />
                {customer.phone}
              </a>
              {customer.email && (
                <a
                  href={`mailto:${customer.email}`}
                  className="flex items-center gap-3 text-sm text-gray-700 hover:text-cyan-700 transition-colors"
                >
                  <Mail className="w-4 h-4 text-gray-400" />
                  {customer.email}
                </a>
              )}
            </div>
          </motion.div>

          {defaultAddress && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="p-6 rounded-3xl bg-white border border-gray-100"
            >
              <h2 className="text-sm font-semibold text-gray-900 mb-4">
                Default address
              </h2>
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700 leading-relaxed">
                  {defaultAddress.fullAddress}
                  {defaultAddress.area && `, ${defaultAddress.area}`},{" "}
                  {defaultAddress.district}
                </p>
              </div>
            </motion.div>
          )}

          {customer.tags && customer.tags.length > 0 && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="p-6 rounded-3xl bg-white border border-gray-100"
            >
              <h2 className="text-sm font-semibold text-gray-900 mb-4">
                Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {customer.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded-full bg-gray-100 text-xs text-gray-700"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Right: order history */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="p-6 md:p-8 rounded-3xl bg-white border border-gray-100"
        >
          <h2 className="text-sm font-semibold text-gray-900 mb-5">
            Order history ({orders.length})
          </h2>

          {orders.length === 0 ? (
            <p className="text-sm text-gray-500 py-8 text-center">
              No orders on record.
            </p>
          ) : (
            <div className="overflow-x-auto -mx-2">
              <table className="w-full min-w-[520px]">
                <thead>
                  <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
                    <th className="px-2 py-3 font-medium">Invoice</th>
                    <th className="px-2 py-3 font-medium text-right">
                      Total
                    </th>
                    <th className="px-2 py-3 font-medium">Status</th>
                    <th className="px-2 py-3 font-medium">Date</th>
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
                      <td className="px-2 py-3 text-sm font-medium text-right">
                        {formatBDT(o.total)}
                      </td>
                      <td className="px-2 py-3">
                        <StatusBadge status={o.status} />
                      </td>
                      <td className="px-2 py-3 text-xs text-gray-500">
                        {formatDateTime(o.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}