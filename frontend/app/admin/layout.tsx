"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Truck,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  AlertTriangle,
  History,
} from "lucide-react";
import { adminApi, adminAuth } from "@/lib/api";
import { NotificationBell } from "@/components/admin/NotificationBell";
import { EASE } from "@/lib/motion";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/inventory", label: "Inventory", icon: AlertTriangle },
  { href: "/admin/shipments", label: "Shipments", icon: Truck },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/audit", label: "Audit log", icon: History },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

const INACTIVITY_TIMEOUT_MS = 60 * 60 * 1000;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [authed, setAuthed] = useState<boolean | null>(null);

  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (isLogin) {
      setAuthed(true);
      return;
    }

    if (!adminAuth.isLoggedIn()) {
      router.replace("/admin/login");
      return;
    }

    adminApi
      .me()
      .then(() => setAuthed(true))
      .catch(() => {
        adminAuth.clearHint();
        router.replace("/admin/login?reason=expired");
      });
  }, [pathname, isLogin, router]);

  useEffect(() => {
    if (isLogin || !authed) return;

    let inactivityTimer: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(async () => {
        try {
          await adminApi.logout();
        } catch {}
        router.replace("/admin/login?reason=inactivity");
      }, INACTIVITY_TIMEOUT_MS);
    };

    const events = ["mousedown", "keydown", "touchstart", "scroll"];
    events.forEach((e) => window.addEventListener(e, resetTimer, true));
    resetTimer();

    return () => {
      clearTimeout(inactivityTimer);
      events.forEach((e) => window.removeEventListener(e, resetTimer, true));
    };
  }, [isLogin, authed, router]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const handleLogout = async () => {
    try {
      await adminApi.logout();
    } finally {
      router.replace("/admin/login");
    }
  };

  if (isLogin) {
    return <>{children}</>;
  }

  if (!authed) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#fafafa" }}
      >
        <div className="w-6 h-6 rounded-full border-2 border-gray-300 border-t-cyan-600 animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex"
      style={{
        background: "#fafafa",
        fontFamily: "var(--font-instrument), system-ui, sans-serif",
      }}
    >
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#050810] text-white flex items-center justify-between px-4 py-3 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-[10px] font-black text-[#050810]">
            BD
          </div>
          <span className="font-semibold tracking-tight text-sm">Admin</span>
        </Link>

        <div className="flex items-center gap-2">
          <NotificationBell />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center transition-colors hover:bg-white/10"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen w-64 z-30
          bg-[#050810] text-white border-r border-white/10
          flex flex-col
          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          pt-16 lg:pt-0
        `}
        style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        <div className="hidden lg:flex items-center justify-between gap-2.5 px-6 py-6 border-b border-white/10">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-[11px] font-black text-[#050810] flex-shrink-0">
              BD
            </div>
            <div className="min-w-0">
              <p className="font-bold tracking-tight text-sm truncate">
                BD Store
              </p>
              <p className="text-[10px] tracking-[0.15em] uppercase text-white/40">
                Admin
              </p>
            </div>
          </div>
          <NotificationBell />
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname?.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                  active
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
                style={{ letterSpacing: "-0.01em" }}
              >
                {active && (
                  <motion.div
                    layoutId="admin-nav-active"
                    className="absolute inset-0 bg-white/10 rounded-xl -z-10"
                    transition={{ duration: 0.3, ease: EASE.expo }}
                  />
                )}
                <item.icon
                  className="w-4 h-4 flex-shrink-0"
                  strokeWidth={1.7}
                />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-white/10">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors"
            style={{ letterSpacing: "-0.01em" }}
          >
            <LogOut className="w-4 h-4" strokeWidth={1.7} />
            Log out
          </button>
        </div>
      </aside>

      {open && (
        <div
          className="lg:hidden fixed inset-0 z-20 bg-black/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      <main className="flex-1 min-w-0 pt-16 lg:pt-0">
        <div className="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}