"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, Search, Users, Phone } from "lucide-react";
import { adminApi } from "@/lib/api";
import { formatBDT, formatDate } from "@/lib/utils";
import { fadeUp, staggerFast } from "@/lib/motion";

interface Customer {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  addresses: { district: string; fullAddress: string }[];
  totalOrders: number;
  totalSpent: number;
  lastOrderAt?: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    adminApi
      .listCustomers()
      .then((res: any) => setCustomers(Array.isArray(res) ? res : []))
      .catch(() => setCustomers([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = customers.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      (c.email && c.email.toLowerCase().includes(q))
    );
  });

  const totalRevenue = customers.reduce((s, c) => s + (c.totalSpent || 0), 0);
  const repeatCustomers = customers.filter((c) => c.totalOrders > 1).length;

  return (
    <div>
      {/* Header */}
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
          Customers
        </h1>
      </div>

      {/* Summary */}
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
            <Users className="w-4 h-4 text-gray-700" />
          </div>
          <p className="text-xs text-gray-500 mb-1">Total customers</p>
          <p className="text-2xl font-semibold tracking-tight">
            {customers.length}
          </p>
        </motion.div>
        <motion.div
          variants={fadeUp}
          className="p-5 rounded-3xl bg-white border border-gray-100"
        >
          <div className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center mb-3">
            <Users className="w-4 h-4 text-green-700" />
          </div>
          <p className="text-xs text-gray-500 mb-1">Repeat customers</p>
          <p className="text-2xl font-semibold tracking-tight">
            {repeatCustomers}
          </p>
        </motion.div>
        <motion.div
          variants={fadeUp}
          className="p-5 rounded-3xl bg-white border border-gray-100"
        >
          <div className="w-9 h-9 rounded-full bg-cyan-50 flex items-center justify-center mb-3">
            <Users className="w-4 h-4 text-cyan-700" />
          </div>
          <p className="text-xs text-gray-500 mb-1">Lifetime value</p>
          <p className="text-2xl font-semibold tracking-tight">
            {formatBDT(totalRevenue)}
          </p>
        </motion.div>
      </motion.div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, phone, or email..."
          className="input-ltx pl-11"
        />
      </div>

      {/* List */}
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
            {search ? "No matches." : "No customers yet."}
          </p>
        ) : (
          <div className="overflow-x-auto -mx-2">
            <table className="w-full min-w-[720px]">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
                  <th className="px-2 py-3 font-medium">Customer</th>
                  <th className="px-2 py-3 font-medium">Phone</th>
                  <th className="px-2 py-3 font-medium">District</th>
                  <th className="px-2 py-3 font-medium text-right">
                    Orders
                  </th>
                  <th className="px-2 py-3 font-medium text-right">
                    Spent
                  </th>
                  <th className="px-2 py-3 font-medium">Last order</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr
                    key={c._id}
                    className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-2 py-3">
                      <Link
                        href={`/admin/customers/${c._id}`}
                        className="text-sm font-medium text-gray-900 hover:text-cyan-700"
                      >
                        {c.name}
                      </Link>
                      {c.email && (
                        <p className="text-xs text-gray-500">{c.email}</p>
                      )}
                    </td>
                    <td className="px-2 py-3 text-sm text-gray-700">
                      <a
                        href={`tel:${c.phone}`}
                        className="inline-flex items-center gap-1 hover:text-cyan-700"
                      >
                        <Phone className="w-3 h-3" />
                        {c.phone}
                      </a>
                    </td>
                    <td className="px-2 py-3 text-sm text-gray-700">
                      {c.addresses?.[0]?.district || "—"}
                    </td>
                    <td className="px-2 py-3 text-sm text-right font-medium">
                      {c.totalOrders}
                    </td>
                    <td className="px-2 py-3 text-sm text-right font-medium">
                      {formatBDT(c.totalSpent)}
                    </td>
                    <td className="px-2 py-3 text-xs text-gray-500">
                      {c.lastOrderAt ? formatDate(c.lastOrderAt) : "—"}
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