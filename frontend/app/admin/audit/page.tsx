"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  History,
  Search,
  ChevronDown,
  ChevronRight,
  User,
  Package,
  ShoppingBag,
  Truck,
  Settings,
  AlertTriangle,
  X,
} from "lucide-react";
import { adminApi } from "@/lib/api";
import { formatDateTime } from "@/lib/utils";
import { fadeUp, staggerFast, EASE } from "@/lib/motion";

/* ═══════════════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════════════ */
interface AuditEntry {
  _id: string;
  admin?: string;
  adminEmail?: string;
  action: string;
  resource: string;
  resourceId?: string;
  status: "success" | "failure";
  ip?: string;
  userAgent?: string;
  method?: string;
  path?: string;
  before?: any;
  after?: any;
  error?: string;
  createdAt: string;
}

/* ═══════════════════════════════════════════════════════
   Resource metadata — icon + color per resource type
   ═══════════════════════════════════════════════════════ */
const RESOURCE_META: Record<
  string,
  { icon: any; color: string; label: string }
> = {
  order: {
    icon: ShoppingBag,
    color: "bg-blue-50 text-blue-700 border-blue-200",
    label: "Order",
  },
  product: {
    icon: Package,
    color: "bg-cyan-50 text-cyan-700 border-cyan-200",
    label: "Product",
  },
  inventory: {
    icon: Package,
    color: "bg-amber-50 text-amber-700 border-amber-200",
    label: "Inventory",
  },
  settings: {
    icon: Settings,
    color: "bg-purple-50 text-purple-700 border-purple-200",
    label: "Settings",
  },
  shipment: {
    icon: Truck,
    color: "bg-indigo-50 text-indigo-700 border-indigo-200",
    label: "Shipment",
  },
  auth: {
    icon: User,
    color: "bg-gray-100 text-gray-700 border-gray-200",
    label: "Auth",
  },
};

const RESOURCE_FILTERS = [
  { value: "", label: "All" },
  { value: "order", label: "Orders" },
  { value: "product", label: "Products" },
  { value: "inventory", label: "Inventory" },
  { value: "shipment", label: "Shipments" },
  { value: "settings", label: "Settings" },
  { value: "auth", label: "Auth" },
];

/* ═══════════════════════════════════════════════════════
   Page
   ═══════════════════════════════════════════════════════ */
export default function AdminAuditLogPage() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterResource, setFilterResource] = useState("");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  /* ── Load ── */
  useEffect(() => {
    setLoading(true);
    adminApi
      .listAuditLogs({
        limit: 200,
        ...(filterResource && { resource: filterResource }),
      })
      .then((res: any) => setEntries(res?.items || []))
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, [filterResource]);

  /* ── Filter by search ── */
  const filtered = useMemo(() => {
    if (!search) return entries;
    const q = search.toLowerCase();
    return entries.filter(
      (e) =>
        e.action.toLowerCase().includes(q) ||
        e.adminEmail?.toLowerCase().includes(q) ||
        e.resourceId?.toLowerCase().includes(q) ||
        e.ip?.toLowerCase().includes(q)
    );
  }, [entries, search]);

  /* ── Toggle expand row ── */
  const toggleExpand = (id: string) => {
    setExpanded((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div>
      {/* ══════════════════════════════════════════════
          Header
         ══════════════════════════════════════════════ */}
      <div className="mb-8">
        <p
          className="text-[11px] tracking-[0.25em] uppercase text-gray-500 mb-2"
          style={{
            fontFamily: "var(--font-instrument), system-ui, sans-serif",
          }}
        >
          Security
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
          Audit log
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Every admin action, timestamped and attributed. Retained for 1 year.
        </p>
      </div>

      {/* ══════════════════════════════════════════════
          Filters
         ══════════════════════════════════════════════ */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by action, admin, resource ID, or IP..."
            className="input-ltx pl-11"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Resource filter chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
          {RESOURCE_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilterResource(f.value)}
              className={`flex-shrink-0 px-3.5 py-2 rounded-full text-xs font-medium transition-colors ${
                filterResource === f.value
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              style={{
                fontFamily:
                  "var(--font-instrument), system-ui, sans-serif",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          Entries
         ══════════════════════════════════════════════ */}
      <motion.div
        variants={staggerFast}
        initial="hidden"
        animate="visible"
        className="p-6 md:p-8 rounded-3xl bg-white border border-gray-100"
      >
        {/* Summary bar */}
        <div className="flex items-center justify-between mb-5 pb-5 border-b border-gray-100">
          <p
            className="text-xs text-gray-500"
            style={{
              fontFamily: "var(--font-instrument), system-ui, sans-serif",
            }}
          >
            {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
            {search && " matching search"}
          </p>
          {filtered.some((e) => e.status === "failure") && (
            <span className="flex items-center gap-1.5 text-xs text-red-600">
              <AlertTriangle className="w-3 h-3" />
              {filtered.filter((e) => e.status === "failure").length} failed
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4">
              <History className="w-6 h-6 text-gray-300" strokeWidth={1.5} />
            </div>
            <p className="text-sm text-gray-500">
              {search || filterResource
                ? "No entries match your filters."
                : "No audit entries yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((entry) => {
              const meta =
                RESOURCE_META[entry.resource] || RESOURCE_META.auth;
              const Icon = meta.icon;
              const isExpanded = expanded.has(entry._id);
              const hasDetails =
                entry.before !== undefined || entry.after !== undefined;

              return (
                <motion.div
                  key={entry._id}
                  variants={fadeUp}
                  className="rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors overflow-hidden"
                >
                  {/* Row header */}
                  <button
                    type="button"
                    onClick={() =>
                      hasDetails && toggleExpand(entry._id)
                    }
                    className={`w-full flex items-center gap-3 p-4 text-left ${
                      hasDetails
                        ? "cursor-pointer hover:bg-gray-50"
                        : "cursor-default"
                    } transition-colors`}
                  >
                    {/* Resource icon */}
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 border ${meta.color}`}
                    >
                      <Icon className="w-4 h-4" strokeWidth={1.7} />
                    </div>

                    {/* Middle */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase border ${meta.color}`}
                          style={{
                            fontFamily:
                              "var(--font-instrument), system-ui, sans-serif",
                          }}
                        >
                          {meta.label}
                        </span>
                        <span
                          className="text-sm font-medium text-gray-900"
                          style={{
                            fontFamily:
                              "var(--font-instrument), system-ui, sans-serif",
                            letterSpacing: "-0.01em",
                          }}
                        >
                          {entry.action}
                        </span>
                        {entry.status === "failure" && (
                          <span className="text-[10px] font-bold text-red-600">
                            FAILED
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-gray-500 truncate">
                        <span className="font-medium text-gray-700">
                          {entry.adminEmail || "unknown"}
                        </span>{" "}
                        · {entry.ip || "no ip"} ·{" "}
                        {formatDateTime(entry.createdAt)}
                      </p>

                      {entry.resourceId && (
                        <p
                          className="text-[11px] text-gray-400 mt-0.5 font-mono truncate"
                          style={{ fontFamily: "monospace" }}
                        >
                          {entry.resourceId}
                        </p>
                      )}

                      {entry.status === "failure" && entry.error && (
                        <p className="text-xs text-red-600 mt-1 truncate">
                          {entry.error}
                        </p>
                      )}
                    </div>

                    {/* Chevron */}
                    {hasDetails && (
                      <div className="text-gray-400 flex-shrink-0">
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </div>
                    )}
                  </button>

                  {/* Expanded details */}
                  <AnimatePresence initial={false}>
                    {isExpanded && hasDetails && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: EASE.expo }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 pt-0 border-t border-gray-100 bg-gray-50/50">
                          <div className="grid sm:grid-cols-2 gap-4 pt-4">
                            {entry.before !== undefined && (
                              <DetailBlock
                                label="Before"
                                value={entry.before}
                                tone="neutral"
                              />
                            )}
                            {entry.after !== undefined && (
                              <DetailBlock
                                label="After"
                                value={entry.after}
                                tone="cyan"
                              />
                            )}
                          </div>

                          {/* Meta row */}
                          <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-x-6 gap-y-2 text-[11px] text-gray-500">
                            {entry.method && entry.path && (
                              <span>
                                <span className="font-medium text-gray-700">
                                  {entry.method}
                                </span>{" "}
                                {entry.path}
                              </span>
                            )}
                            {entry.userAgent && (
                              <span className="truncate max-w-md">
                                {entry.userAgent}
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   DetailBlock — renders a before/after JSON snapshot
   ═══════════════════════════════════════════════════════ */
function DetailBlock({
  label,
  value,
  tone,
}: {
  label: string;
  value: any;
  tone: "neutral" | "cyan";
}) {
  return (
    <div>
      <p
        className="text-[10px] tracking-[0.2em] uppercase text-gray-500 mb-2"
        style={{
          fontFamily: "var(--font-instrument), system-ui, sans-serif",
        }}
      >
        {label}
      </p>
      <pre
        className={`p-3 rounded-xl text-[11px] leading-relaxed overflow-x-auto ${
          tone === "cyan"
            ? "bg-cyan-50 border border-cyan-100 text-cyan-900"
            : "bg-white border border-gray-200 text-gray-700"
        }`}
        style={{ fontFamily: "monospace" }}
      >
        {JSON.stringify(value, null, 2)}
      </pre>
    </div>
  );
}