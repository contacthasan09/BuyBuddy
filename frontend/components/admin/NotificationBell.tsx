"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, AlertTriangle, ShoppingBag, Truck } from "lucide-react";
import { adminApi } from "@/lib/api";
import { EASE } from "@/lib/motion";

interface Notif {
  id: string;
  icon: any;
  label: string;
  sub: string;
  href: string;
  accent: string;
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState<Notif[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [ordersRes, invRes] = await Promise.all([
          adminApi.listOrders({ page: 1, limit: 50 }).catch(() => null),
          adminApi.listInventory().catch(() => null),
        ]);

        const orders = (ordersRes as any)?.items || [];
        const inventory = Array.isArray(invRes) ? invRes : [];

        const items: Notif[] = [];

        const pending = orders.filter((o: any) => o.status === "PENDING");
        if (pending.length > 0) {
          items.push({
            id: "pending",
            icon: ShoppingBag,
            label: `${pending.length} pending order${
              pending.length > 1 ? "s" : ""
            }`,
            sub: "Needs confirmation",
            href: "/admin/orders?status=PENDING",
            accent: "bg-yellow-50 text-yellow-700",
          });
        }

        const inTransit = orders.filter((o: any) =>
          ["SHIPMENT_CREATED", "IN_TRANSIT", "OUT_FOR_DELIVERY"].includes(
            o.status
          )
        );
        if (inTransit.length > 0) {
          items.push({
            id: "transit",
            icon: Truck,
            label: `${inTransit.length} shipment${
              inTransit.length > 1 ? "s" : ""
            } in transit`,
            sub: "Live with courier",
            href: "/admin/shipments",
            accent: "bg-indigo-50 text-indigo-700",
          });
        }

        const lowStock = inventory.filter(
          (i: any) => i.available <= i.lowStockThreshold
        );
        if (lowStock.length > 0) {
          items.push({
            id: "stock",
            icon: AlertTriangle,
            label: `${lowStock.length} low-stock item${
              lowStock.length > 1 ? "s" : ""
            }`,
            sub: "Needs restocking",
            href: "/admin/inventory",
            accent: "bg-red-50 text-red-700",
          });
        }

        setNotifs(items);
      } catch {
        setNotifs([]);
      }
    };

    load();
    const interval = setInterval(load, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, []);

  const count = notifs.length;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative w-9 h-9 rounded-full border border-white/15 bg-white/[0.04] hover:bg-white/[0.1] flex items-center justify-center transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4 text-white" strokeWidth={1.7} />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
            {count}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.2, ease: EASE.expo }}
              className="absolute right-0 top-12 z-50 w-80 rounded-2xl bg-white border border-gray-100 shadow-2xl overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900">
                  Notifications
                </p>
              </div>

              {notifs.length === 0 ? (
                <p className="px-4 py-8 text-sm text-gray-500 text-center">
                  All clear ✨
                </p>
              ) : (
                <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                  {notifs.map((n) => (
                    <Link
                      key={n.id}
                      href={n.href}
                      onClick={() => setOpen(false)}
                      className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${n.accent}`}
                      >
                        <n.icon className="w-4 h-4" strokeWidth={1.7} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {n.label}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {n.sub}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}