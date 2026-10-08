"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Lock,
  AlertCircle,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";
import { adminApi, adminAuth } from "@/lib/api";
import { EASE } from "@/lib/motion";

function AdminLoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [stage, setStage] = useState<"credentials" | "2fa">("credentials");
  const [email, setEmail] = useState("admin@store.com");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [tempToken, setTempToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (adminAuth.isLoggedIn()) {
      router.replace("/admin");
    }
  }, [router]);

  useEffect(() => {
    const reason = searchParams?.get("reason");
    if (reason === "inactivity") {
      setError("You were logged out due to inactivity.");
    } else if (reason === "expired") {
      setError("Your session expired. Please login again.");
    }
  }, [searchParams]);

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await adminApi.login(email.trim(), password);

      if ((result as any).requires2FA) {
        setTempToken((result as any).tempToken);
        setStage("2fa");
        setLoading(false);
        return;
      }

      router.replace("/admin");
    } catch (err: any) {
      setError(err?.message || "Login failed. Please try again.");
      setLoading(false);
    }
  };

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await adminApi.verify2FA(tempToken, code.trim());
      router.replace("/admin");
    } catch (err: any) {
      setError(err?.message || "Invalid 2FA code. Please try again.");
      setLoading(false);
    }
  };

  const backToCredentials = () => {
    setStage("credentials");
    setCode("");
    setTempToken("");
    setError("");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        background:
          "radial-gradient(60% 100% at 50% 0%, rgba(62,200,228,0.12), transparent 60%), #020204",
        fontFamily: "var(--font-instrument), system-ui, sans-serif",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE.expo }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <div className="w-12 h-12 rounded-2xl bg-white mx-auto mb-5 flex items-center justify-center text-sm font-black text-[#050810]">
            BD
          </div>
          <p className="text-[11px] tracking-[0.25em] uppercase text-white/50 mb-3">
            BD Store
          </p>
          <h1
            className="text-white"
            style={{
              fontSize: "32px",
              fontWeight: 500,
              letterSpacing: "-0.03em",
              lineHeight: "1.1",
            }}
          >
            Admin{" "}
            <span className="serif-italic">
              {stage === "2fa" ? "verify." : "access."}
            </span>
          </h1>
        </div>

        <AnimatePresence mode="wait">
          {stage === "credentials" ? (
            <motion.form
              key="credentials"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35, ease: EASE.expo }}
              onSubmit={handleCredentials}
              className="p-8 rounded-3xl bg-white/[0.03] backdrop-blur-md border border-white/10"
            >
              <div className="space-y-5">
                <div>
                  <label className="block text-[11px] tracking-[0.2em] uppercase text-white/60 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    autoFocus
                    disabled={loading}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/15 text-white placeholder:text-white/30 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block text-[11px] tracking-[0.2em] uppercase text-white/60 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    disabled={loading}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/15 text-white placeholder:text-white/30 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition disabled:opacity-60"
                  />
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30"
                    >
                      <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-red-300 text-sm">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white text-[#0b1a26] font-semibold transition-all hover:bg-gray-100 disabled:opacity-60"
                  style={{ fontSize: "15px", letterSpacing: "-0.01em" }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" strokeWidth={1.8} />
                      Continue
                    </>
                  )}
                </button>
              </div>
            </motion.form>
          ) : (
            <motion.form
              key="2fa"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.35, ease: EASE.expo }}
              onSubmit={handleVerify2FA}
              className="p-8 rounded-3xl bg-white/[0.03] backdrop-blur-md border border-white/10"
            >
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-6 h-6 text-cyan-400" />
                </div>
                <p className="text-sm text-white/60 mb-1">
                  Two-factor authentication
                </p>
                <p className="text-xs text-white/40">
                  Enter the 6-digit code from your authenticator app
                </p>
              </div>

              <div className="space-y-5">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[A-Za-z0-9]*"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="000000"
                  autoFocus
                  required
                  maxLength={10}
                  disabled={loading}
                  className="w-full px-4 py-4 rounded-xl bg-white/[0.05] border border-white/15 text-white text-center outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition tracking-[0.5em] disabled:opacity-60"
                  style={{
                    fontFamily: "monospace",
                    fontSize: "24px",
                    fontWeight: 600,
                  }}
                />

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30"
                    >
                      <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-red-300 text-sm">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={loading || code.length < 6}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white text-[#0b1a26] font-semibold transition-all hover:bg-gray-100 disabled:opacity-60"
                  style={{ fontSize: "15px", letterSpacing: "-0.01em" }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify"
                  )}
                </button>

                <button
                  type="button"
                  onClick={backToCredentials}
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-1.5 text-xs text-white/50 hover:text-white/80 transition-colors disabled:opacity-40"
                >
                  <ArrowLeft className="w-3 h-3" />
                  Use a different account
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        <p className="text-center text-xs text-white/40 mt-8">
          Protected area. All access is logged.
        </p>
      </motion.div>
    </div>
  );
}

function AdminLoginFallback() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background:
          "radial-gradient(60% 100% at 50% 0%, rgba(62,200,228,0.12), transparent 60%), #020204",
      }}
    >
      <Loader2 className="w-6 h-6 animate-spin text-white/40" />
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<AdminLoginFallback />}>
      <AdminLoginInner />
    </Suspense>
  );
}