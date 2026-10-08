"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  ShieldCheck,
  ShieldOff,
  Copy,
  Check,
  AlertTriangle,
  X,
  Download,
  QrCode,
} from "lucide-react";
import { adminApi } from "@/lib/api";
import { useToast } from "@/components/providers/ToastProvider";
import { EASE } from "@/lib/motion";

type Stage =
  | "idle"
  | "setup"
  | "backup-codes"
  | "disable"
  | "loading";

export function TwoFactorSection() {
  const { toast } = useToast();

  const [stage, setStage] = useState<Stage>("loading");
  const [enabled, setEnabled] = useState(false);

  // Setup flow
  const [secret, setSecret] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);

  // Disable flow
  const [disablePassword, setDisablePassword] = useState("");
  const [disableCode, setDisableCode] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [codesCopied, setCodesCopied] = useState(false);

  /* ═══════════════════════════════════════════════════
     Load current status
     ═══════════════════════════════════════════════════ */
  useEffect(() => {
    adminApi
      .me()
      .then((me: any) => {
        setEnabled(!!me.twoFactorEnabled);
        setStage("idle");
      })
      .catch(() => setStage("idle"));
  }, []);

  /* ═══════════════════════════════════════════════════
     Start setup — fetch secret + QR
     ═══════════════════════════════════════════════════ */
  const handleStartSetup = async () => {
    setSubmitting(true);
    setError("");
    try {
      const result = await adminApi.setup2FA();
      setSecret(result.secret);
      setQrCode(result.qrCode);
      setVerificationCode("");
      setStage("setup");
    } catch (err: any) {
      setError(err?.message || "Failed to start 2FA setup");
    } finally {
      setSubmitting(false);
    }
  };

  /* ═══════════════════════════════════════════════════
     Enable — verify code + get backup codes
     ═══════════════════════════════════════════════════ */
  const handleEnable = async () => {
    if (verificationCode.length < 6) {
      setError("Enter the 6-digit code from your authenticator app");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const result = await adminApi.enable2FA(secret, verificationCode);
      setBackupCodes(result.backupCodes);
      setEnabled(true);
      setStage("backup-codes");
      toast("2FA enabled successfully", "success");
    } catch (err: any) {
      setError(err?.message || "Invalid code");
    } finally {
      setSubmitting(false);
    }
  };

  /* ═══════════════════════════════════════════════════
     Disable — requires password + current code
     ═══════════════════════════════════════════════════ */
  const handleDisable = async () => {
    if (!disablePassword || disableCode.length < 6) {
      setError("Password and 6-digit code are required");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await adminApi.disable2FA(disablePassword, disableCode);
      setEnabled(false);
      setStage("idle");
      setDisablePassword("");
      setDisableCode("");
      toast("2FA disabled", "success");
    } catch (err: any) {
      setError(err?.message || "Failed to disable 2FA");
    } finally {
      setSubmitting(false);
    }
  };

  /* ═══════════════════════════════════════════════════
     Copy helpers
     ═══════════════════════════════════════════════════ */
  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const copyAllBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join("\n"));
    setCodesCopied(true);
    toast("Backup codes copied to clipboard", "success");
    setTimeout(() => setCodesCopied(false), 2000);
  };

  const downloadBackupCodes = () => {
    const content = [
      "BD STORE — 2FA BACKUP CODES",
      "================================",
      `Generated: ${new Date().toISOString()}`,
      "",
      "Each code works ONCE. Keep them safe.",
      "If you lose your phone, use one of these to log in.",
      "",
      ...backupCodes,
      "",
      "================================",
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bdstore-2fa-backup-codes-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast("Backup codes downloaded", "success");
  };

  /* ═══════════════════════════════════════════════════
     Loading state
     ═══════════════════════════════════════════════════ */
  if (stage === "loading") {
    return (
      <div className="p-6 md:p-7 rounded-3xl bg-white border border-gray-100">
        <div className="flex items-center justify-center py-6">
          <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE.expo }}
      className="p-6 md:p-7 rounded-3xl bg-white border border-gray-100 space-y-5"
    >
      {/* ═══════════════════════════════════════════════
          Header
          ═══════════════════════════════════════════════ */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h2
            className="text-gray-900 flex items-center gap-2"
            style={{
              fontFamily: "var(--font-instrument), system-ui, sans-serif",
              fontSize: "15px",
              fontWeight: 600,
              letterSpacing: "-0.015em",
            }}
          >
            {enabled ? (
              <ShieldCheck className="w-4 h-4 text-green-600" />
            ) : (
              <ShieldOff className="w-4 h-4 text-gray-400" />
            )}
            Two-factor authentication
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            {enabled
              ? "Enabled — you'll need an authenticator code on every login."
              : "Add an extra layer of security to your admin account."}
          </p>
        </div>

        {/* Status badge */}
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase border ${
            enabled
              ? "bg-green-50 text-green-800 border-green-200"
              : "bg-gray-50 text-gray-600 border-gray-200"
          }`}
          style={{
            fontFamily: "var(--font-instrument), system-ui, sans-serif",
          }}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              enabled ? "bg-green-500" : "bg-gray-400"
            }`}
          />
          {enabled ? "Active" : "Disabled"}
        </span>
      </div>

      {/* ═══════════════════════════════════════════════
          Error
          ═══════════════════════════════════════════════ */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200"
          >
            <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 text-sm flex-1">{error}</p>
            <button
              type="button"
              onClick={() => setError("")}
              className="text-red-500 hover:text-red-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════
          STAGE: IDLE
          ═══════════════════════════════════════════════ */}
      {stage === "idle" && !enabled && (
        <button
          type="button"
          onClick={handleStartSetup}
          disabled={submitting}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gray-900 text-white font-medium text-sm hover:bg-gray-800 disabled:opacity-60 transition-colors"
          style={{
            fontFamily: "var(--font-instrument), system-ui, sans-serif",
          }}
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Starting...
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              Enable 2FA
            </>
          )}
        </button>
      )}

      {stage === "idle" && enabled && (
        <button
          type="button"
          onClick={() => {
            setStage("disable");
            setDisablePassword("");
            setDisableCode("");
            setError("");
          }}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-red-200 text-red-600 font-medium text-sm hover:bg-red-50 transition-colors"
          style={{
            fontFamily: "var(--font-instrument), system-ui, sans-serif",
          }}
        >
          <ShieldOff className="w-4 h-4" />
          Disable 2FA
        </button>
      )}

      {/* ═══════════════════════════════════════════════
          STAGE: SETUP — Show QR + secret + verify
          ═══════════════════════════════════════════════ */}
      {stage === "setup" && (
        <div className="space-y-5 pt-2">
          {/* Step 1 — scan */}
          <div>
            <p
              className="text-[11px] tracking-[0.2em] uppercase text-gray-500 mb-3"
              style={{
                fontFamily: "var(--font-instrument), system-ui, sans-serif",
              }}
            >
              Step 1 · Scan this QR code
            </p>
            <p className="text-xs text-gray-600 mb-4">
              Open <strong>Google Authenticator</strong> (or any TOTP app),
              tap <strong>+</strong>, and scan the code below.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 items-start">
              {/* QR code */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex-shrink-0">
                {qrCode ? (
                  <img
                    src={qrCode}
                    alt="2FA QR code"
                    className="w-44 h-44"
                    style={{ imageRendering: "pixelated" }}
                  />
                ) : (
                  <div className="w-44 h-44 flex items-center justify-center">
                    <QrCode className="w-12 h-12 text-gray-300" />
                  </div>
                )}
              </div>

              {/* Manual secret */}
              <div className="flex-1 min-w-0">
                <p
                  className="text-[11px] tracking-[0.2em] uppercase text-gray-500 mb-2"
                  style={{
                    fontFamily:
                      "var(--font-instrument), system-ui, sans-serif",
                  }}
                >
                  Can't scan? Enter this key manually
                </p>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 border border-gray-200 font-mono text-xs break-all">
                  <span className="flex-1">{secret}</span>
                  <button
                    type="button"
                    onClick={() => copy(secret, "secret")}
                    className="w-7 h-7 rounded-lg hover:bg-gray-200 flex items-center justify-center flex-shrink-0 transition-colors"
                    aria-label="Copy secret"
                  >
                    {copied === "secret" ? (
                      <Check className="w-3.5 h-3.5 text-green-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-gray-500" />
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-gray-500 mt-2">
                  In Google Authenticator: <strong>+</strong> →{" "}
                  <strong>Enter a setup key</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Step 2 — verify */}
          <div className="pt-4 border-t border-gray-100">
            <p
              className="text-[11px] tracking-[0.2em] uppercase text-gray-500 mb-3"
              style={{
                fontFamily: "var(--font-instrument), system-ui, sans-serif",
              }}
            >
              Step 2 · Verify
            </p>
            <p className="text-xs text-gray-600 mb-3">
              Enter the 6-digit code shown in your authenticator app.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                inputMode="numeric"
                value={verificationCode}
                onChange={(e) =>
                  setVerificationCode(
                    e.target.value.replace(/[^0-9A-Za-z]/g, "").toUpperCase()
                  )
                }
                placeholder="000000"
                maxLength={10}
                autoFocus
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-center font-mono text-2xl tracking-[0.4em] outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition"
                style={{ fontFamily: "monospace" }}
              />
              <button
                type="button"
                onClick={handleEnable}
                disabled={submitting || verificationCode.length < 6}
                className="px-6 py-3 rounded-full bg-gray-900 text-white font-medium text-sm hover:bg-gray-800 disabled:opacity-60 transition-colors inline-flex items-center justify-center gap-2"
                style={{
                  fontFamily:
                    "var(--font-instrument), system-ui, sans-serif",
                }}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Enable 2FA"
                )}
              </button>
            </div>
          </div>

          {/* Cancel */}
          <button
            type="button"
            onClick={() => {
              setStage("idle");
              setSecret("");
              setQrCode("");
              setVerificationCode("");
              setError("");
            }}
            className="text-xs text-gray-500 hover:text-gray-900 transition-colors"
          >
            ← Cancel setup
          </button>
        </div>
      )}

      {/* ═══════════════════════════════════════════════
          STAGE: BACKUP CODES
          ═══════════════════════════════════════════════ */}
      {stage === "backup-codes" && (
        <div className="space-y-5 pt-2">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p
                className="text-sm font-semibold text-amber-900 mb-1"
                style={{
                  fontFamily:
                    "var(--font-instrument), system-ui, sans-serif",
                }}
              >
                Save these backup codes
              </p>
              <p className="text-xs text-amber-800 leading-relaxed">
                Each code works <strong>once</strong>. Use them if you lose
                your phone. They will <strong>not</strong> be shown again.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {backupCodes.map((code, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-center font-mono text-sm font-medium tracking-wider"
                style={{ fontFamily: "monospace" }}
              >
                {code}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={copyAllBackupCodes}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gray-900 text-white font-medium text-sm hover:bg-gray-800 transition-colors"
              style={{
                fontFamily:
                  "var(--font-instrument), system-ui, sans-serif",
              }}
            >
              {codesCopied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy all
                </>
              )}
            </button>

            <button
              type="button"
              onClick={downloadBackupCodes}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-gray-200 text-gray-900 font-medium text-sm hover:border-gray-900 transition-colors"
              style={{
                fontFamily:
                  "var(--font-instrument), system-ui, sans-serif",
              }}
            >
              <Download className="w-4 h-4" />
              Download .txt
            </button>

            <button
              type="button"
              onClick={() => setStage("idle")}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-gray-500 font-medium text-sm hover:text-gray-900 transition-colors ml-auto"
              style={{
                fontFamily:
                  "var(--font-instrument), system-ui, sans-serif",
              }}
            >
              Done — I saved them
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════
          STAGE: DISABLE
          ═══════════════════════════════════════════════ */}
      {stage === "disable" && (
        <div className="space-y-5 pt-2">
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p
                className="text-sm font-semibold text-red-900 mb-1"
                style={{
                  fontFamily:
                    "var(--font-instrument), system-ui, sans-serif",
                }}
              >
                Disabling 2FA makes your account less secure
              </p>
              <p className="text-xs text-red-800 leading-relaxed">
                Anyone with your password will be able to log in. Confirm with
                your password and a current 2FA code.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label
                className="block text-xs font-semibold text-gray-700 mb-2"
                style={{
                  fontFamily:
                    "var(--font-instrument), system-ui, sans-serif",
                }}
              >
                Password
              </label>
              <input
                type="password"
                value={disablePassword}
                onChange={(e) => setDisablePassword(e.target.value)}
                placeholder="Your admin password"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition"
                style={{
                  fontFamily:
                    "var(--font-instrument), system-ui, sans-serif",
                }}
              />
            </div>

            <div>
              <label
                className="block text-xs font-semibold text-gray-700 mb-2"
                style={{
                  fontFamily:
                    "var(--font-instrument), system-ui, sans-serif",
                }}
              >
                6-digit code from your authenticator
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={disableCode}
                onChange={(e) =>
                  setDisableCode(
                    e.target.value.replace(/[^0-9A-Za-z]/g, "").toUpperCase()
                  )
                }
                placeholder="000000"
                maxLength={10}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-center font-mono text-xl tracking-[0.4em] outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition"
                style={{ fontFamily: "monospace" }}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleDisable}
              disabled={
                submitting ||
                !disablePassword ||
                disableCode.length < 6
              }
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-red-600 text-white font-medium text-sm hover:bg-red-700 disabled:opacity-60 transition-colors"
              style={{
                fontFamily:
                  "var(--font-instrument), system-ui, sans-serif",
              }}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Disabling...
                </>
              ) : (
                <>
                  <ShieldOff className="w-4 h-4" />
                  Disable 2FA
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setStage("idle");
                setDisablePassword("");
                setDisableCode("");
                setError("");
              }}
              className="inline-flex items-center px-5 py-3 rounded-full text-gray-600 font-medium text-sm hover:bg-gray-100 transition-colors"
              style={{
                fontFamily:
                  "var(--font-instrument), system-ui, sans-serif",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}