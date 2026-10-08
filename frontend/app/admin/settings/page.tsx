"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Loader2,
  Save,
  Check,
  LogOut,
  Monitor,
  Smartphone,
  AlertCircle,
} from "lucide-react";
import { adminApi } from "@/lib/api";
import { BD_DISTRICTS } from "@/lib/constants";
import { fadeUp, staggerContainer, EASE } from "@/lib/motion";
import { TwoFactorSection } from "@/components/admin/TwoFactorSection";

const PUBLIC_KEYS = [
  { key: "announcement", label: "Announcement bar text", type: "text" },
  {
    key: "freeDeliveryThreshold",
    label: "Free delivery threshold (৳)",
    type: "number",
  },
  { key: "storeName", label: "Store name", type: "text" },
  { key: "storePhone", label: "Store phone", type: "text" },
  { key: "storeEmail", label: "Store email", type: "text" },
  { key: "storeAddress", label: "Store address", type: "text" },
] as const;

interface SessionInfo {
  _id: string;
  ip?: string;
  userAgent?: string;
  lastUsedAt: string;
  expiresAt: string;
  createdAt: string;
}

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [values, setValues] = useState<Record<string, any>>({});
  const [deliveryCharges, setDeliveryCharges] = useState<
    Record<string, number>
  >({});
  const [error, setError] = useState("");

  // Sessions
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);

  /* ═══════════════════════════════════════════════════
     Load settings
     ═══════════════════════════════════════════════════ */
  useEffect(() => {
    adminApi
      .getSettings()
      .then((res: any) => {
        setValues(res || {});
        if (res?.deliveryCharges) {
          setDeliveryCharges(res.deliveryCharges);
        }
      })
      .catch(() => setValues({}))
      .finally(() => setLoading(false));
  }, []);

  /* ═══════════════════════════════════════════════════
     Load active sessions
     ═══════════════════════════════════════════════════ */
  const loadSessions = () => {
    setLoadingSessions(true);
    adminApi
      .listSessions()
      .then((res: any) => setSessions(Array.isArray(res) ? res : []))
      .catch(() => setSessions([]))
      .finally(() => setLoadingSessions(false));
  };

  useEffect(() => {
    loadSessions();
  }, []);

  /* ═══════════════════════════════════════════════════
     Update helpers
     ═══════════════════════════════════════════════════ */
  const updateValue = (key: string, value: any) => {
    setValues((v) => ({ ...v, [key]: value }));
  };

  const updateCharge = (district: string, value: string) => {
    const n = Number(value);
    setDeliveryCharges((c) => ({
      ...c,
      [district]: isNaN(n) ? 0 : n,
    }));
  };

  /* ═══════════════════════════════════════════════════
     Save settings
     ═══════════════════════════════════════════════════ */
  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await adminApi.updateSettings({
        ...values,
        deliveryCharges,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      setError(err?.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  /* ═══════════════════════════════════════════════════
     Session actions
     ═══════════════════════════════════════════════════ */
  const handleRevokeSession = async (sessionId: string) => {
    if (!confirm("Revoke this session? That device will be logged out.")) {
      return;
    }
    try {
      await adminApi.revokeSession(sessionId);
      loadSessions();
    } catch (err: any) {
      alert(err?.message || "Failed to revoke session");
    }
  };

  const handleRevokeAll = async () => {
    if (
      !confirm(
        "This will log you out from ALL devices, including this one. Continue?"
      )
    ) {
      return;
    }
    try {
      await adminApi.revokeAllSessions();
      await adminApi.logout();
      window.location.href = "/admin/login";
    } catch (err: any) {
      alert(err?.message || "Failed to revoke sessions");
    }
  };

  /* ═══════════════════════════════════════════════════
     Render
     ═══════════════════════════════════════════════════ */
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <p
          className="text-[11px] tracking-[0.25em] uppercase text-gray-500 mb-2"
          style={{
            fontFamily: "var(--font-instrument), system-ui, sans-serif",
          }}
        >
          Configure
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
          Settings
        </h1>
      </div>

      <motion.div
        variants={staggerContainer(0.06)}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* ═══════════════════════════════════════════════
            Store information
            ═══════════════════════════════════════════════ */}
        <motion.div
          variants={fadeUp}
          className="p-6 md:p-7 rounded-3xl bg-white border border-gray-100 space-y-5"
        >
          <h2
            className="text-gray-900"
            style={{
              fontFamily: "var(--font-instrument), system-ui, sans-serif",
              fontSize: "15px",
              fontWeight: 600,
              letterSpacing: "-0.015em",
            }}
          >
            Store information
          </h2>

          {PUBLIC_KEYS.map((item) => (
            <div key={item.key}>
              <label
                className="block text-xs font-semibold text-gray-700 mb-2"
                style={{
                  fontFamily:
                    "var(--font-instrument), system-ui, sans-serif",
                }}
              >
                {item.label}
              </label>
              <input
                type={item.type}
                value={values[item.key] ?? ""}
                onChange={(e) =>
                  updateValue(
                    item.key,
                    item.type === "number"
                      ? Number(e.target.value)
                      : e.target.value
                  )
                }
                className="input-ltx"
                style={{
                  fontFamily:
                    "var(--font-instrument), system-ui, sans-serif",
                }}
              />
            </div>
          ))}
        </motion.div>

        {/* ═══════════════════════════════════════════════
            Delivery charges
            ═══════════════════════════════════════════════ */}
        <motion.div
          variants={fadeUp}
          className="p-6 md:p-7 rounded-3xl bg-white border border-gray-100 space-y-5"
        >
          <div>
            <h2
              className="text-gray-900"
              style={{
                fontFamily: "var(--font-instrument), system-ui, sans-serif",
                fontSize: "15px",
                fontWeight: 600,
                letterSpacing: "-0.015em",
              }}
            >
              Delivery charges (৳)
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Set per-district. Leave blank to use the default (
              {deliveryCharges._default ?? 130}).
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {BD_DISTRICTS.slice(0, 12).map((d) => (
              <div key={d}>
                <label
                  className="block text-xs font-medium text-gray-600 mb-1.5"
                  style={{
                    fontFamily:
                      "var(--font-instrument), system-ui, sans-serif",
                  }}
                >
                  {d}
                </label>
                <input
                  type="number"
                  value={deliveryCharges[d] ?? ""}
                  onChange={(e) => updateCharge(d, e.target.value)}
                  placeholder="130"
                  className="input-ltx"
                  style={{
                    fontFamily:
                      "var(--font-instrument), system-ui, sans-serif",
                  }}
                />
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-gray-100">
            <label
              className="block text-xs font-medium text-gray-600 mb-1.5"
              style={{
                fontFamily:
                  "var(--font-instrument), system-ui, sans-serif",
              }}
            >
              Default (all other districts)
            </label>
            <input
              type="number"
              value={deliveryCharges._default ?? ""}
              onChange={(e) => updateCharge("_default", e.target.value)}
              placeholder="130"
              className="input-ltx max-w-xs"
              style={{
                fontFamily:
                  "var(--font-instrument), system-ui, sans-serif",
              }}
            />
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════
            Error
            ═══════════════════════════════════════════════ */}
        {error && (
          <motion.div
            variants={fadeUp}
            className="flex items-start gap-2 p-4 rounded-2xl bg-red-50 border border-red-200"
          >
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 text-sm flex-1">{error}</p>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════
            Save button
            ═══════════════════════════════════════════════ */}
        <motion.div variants={fadeUp} className="sticky bottom-6 z-10">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gray-900 text-white font-medium hover:bg-gray-800 disabled:opacity-60 transition-colors text-sm shadow-lg"
            style={{
              fontFamily: "var(--font-instrument), system-ui, sans-serif",
              letterSpacing: "-0.01em",
            }}
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : saved ? (
              <>
                <Check className="w-4 h-4" />
                Saved
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save settings
              </>
            )}
          </button>
        </motion.div>

        {/* ═══════════════════════════════════════════════
            2FA — Two Factor Authentication
            ═══════════════════════════════════════════════ */}
        <TwoFactorSection />

        {/* ═══════════════════════════════════════════════
            Active sessions
            ═══════════════════════════════════════════════ */}
        <motion.div
          variants={fadeUp}
          className="p-6 md:p-7 rounded-3xl bg-white border border-gray-100 space-y-5"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2
                className="text-gray-900"
                style={{
                  fontFamily:
                    "var(--font-instrument), system-ui, sans-serif",
                  fontSize: "15px",
                  fontWeight: 600,
                  letterSpacing: "-0.015em",
                }}
              >
                Active sessions
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Devices currently logged in with your account.
              </p>
            </div>
            {sessions.length > 1 && (
              <button
                type="button"
                onClick={handleRevokeAll}
                className="text-xs text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-full transition-colors whitespace-nowrap"
                style={{
                  fontFamily:
                    "var(--font-instrument), system-ui, sans-serif",
                }}
              >
                Log out everywhere
              </button>
            )}
          </div>

          {loadingSessions ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
            </div>
          ) : sessions.length === 0 ? (
            <p className="text-xs text-gray-500 py-2">
              No active sessions found.
            </p>
          ) : (
            <div className="space-y-2">
              {sessions.map((s, idx) => {
                const isCurrent = idx === 0;
                const device = parseDevice(s.userAgent);

                return (
                  <div
                    key={s._id}
                    className={`flex items-center gap-3 p-3 rounded-2xl border transition-colors ${
                      isCurrent
                        ? "border-cyan-200 bg-cyan-50/50"
                        : "border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                        device.isMobile
                          ? "bg-purple-50 text-purple-700"
                          : "bg-gray-50 text-gray-700"
                      }`}
                    >
                      {device.isMobile ? (
                        <Smartphone className="w-4 h-4" strokeWidth={1.7} />
                      ) : (
                        <Monitor className="w-4 h-4" strokeWidth={1.7} />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p
                          className="text-sm font-medium text-gray-900 truncate"
                          style={{
                            fontFamily:
                              "var(--font-instrument), system-ui, sans-serif",
                          }}
                        >
                          {device.label}
                        </p>
                        {isCurrent && (
                          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 flex-shrink-0">
                            This device
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 truncate">
                        {s.ip || "unknown IP"} · last used{" "}
                        {formatRelativeTime(s.lastUsedAt)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRevokeSession(s._id)}
                      className="inline-flex items-center gap-1 text-xs text-red-600 hover:bg-red-50 px-2.5 py-1.5 rounded-full transition-colors whitespace-nowrap flex-shrink-0"
                      style={{
                        fontFamily:
                          "var(--font-instrument), system-ui, sans-serif",
                      }}
                    >
                      <LogOut className="w-3 h-3" />
                      Revoke
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Utilities
   ═══════════════════════════════════════════════════════ */

function parseDevice(userAgent?: string): {
  label: string;
  isMobile: boolean;
} {
  if (!userAgent) return { label: "Unknown device", isMobile: false };

  const ua = userAgent.toLowerCase();

  // OS
  let os = "Unknown";
  if (ua.includes("windows")) os = "Windows";
  else if (ua.includes("mac")) os = "macOS";
  else if (ua.includes("linux")) os = "Linux";
  else if (ua.includes("android")) os = "Android";
  else if (ua.includes("iphone") || ua.includes("ipad")) os = "iOS";

  // Browser
  let browser = "Browser";
  if (ua.includes("edg/")) browser = "Edge";
  else if (ua.includes("chrome") && !ua.includes("edg")) browser = "Chrome";
  else if (ua.includes("safari") && !ua.includes("chrome")) browser = "Safari";
  else if (ua.includes("firefox")) browser = "Firefox";

  const isMobile =
    ua.includes("mobile") || ua.includes("android") || ua.includes("iphone");

  return {
    label: `${browser} on ${os}`,
    isMobile,
  };
}

function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const diff = Date.now() - then;
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}