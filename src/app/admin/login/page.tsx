"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, Lock, Mail, ArrowRight, AlertCircle, ShieldAlert, Eye, EyeOff, KeyRound } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Authentication failed. Check your admin credentials.");
        setLoading(false);
        return;
      }

      if (data.user?.role !== "ADMIN") {
        setError("Access restricted: This account does not possess administrator privileges.");
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("An unexpected network error occurred.");
      setLoading(false);
    }
  };

  const handleQuickFill = () => {
    setEmail("admin@dcctinsukia.in");
    setPassword("AdminPassword@123");
    setError("");
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#070b14] relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full space-y-6 bg-[#0d1526] border-2 border-slate-700/80 p-6 sm:p-8 rounded-2xl shadow-2xl relative z-10 text-white">
        <div className="text-center">
          <div className="mx-auto h-16 px-4 py-2 bg-white rounded-2xl border border-slate-200 flex items-center justify-center shadow-lg w-fit">
            <img src="/logo.png" alt="DCC Logo" className="h-10 w-auto object-contain" />
          </div>
          <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5" />
            Administrative Portal
          </div>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white">
            Administrator Sign In
          </h2>
          <p className="mt-1 text-xs text-slate-300">
            District Computer Centre Tinsukia Notes Management System
          </p>
        </div>

        {/* Quick autofill helper */}
        <button
          type="button"
          onClick={handleQuickFill}
          className="w-full text-xs py-2 px-3 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-500/25 active:bg-amber-500/35 transition-all font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>Click to Autofill Admin Credentials</span>
        </button>

        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-200">
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
          <span>
            Restricted area: Access is monitored. Only authorized DCC staff may log in here.
          </span>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/70 border-2 border-red-500/60 flex items-start gap-3 text-xs text-red-200 shadow-md">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-200 mb-1.5">
              Administrator Email <span className="text-amber-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@dcctinsukia.in"
                className="block w-full pl-10 pr-3.5 py-3 text-base sm:text-sm font-bold text-slate-950 bg-white border-2 border-slate-300 rounded-xl placeholder:text-slate-400 placeholder:font-normal focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 shadow-sm transition-all outline-none"
                style={{ color: "#0f172a", backgroundColor: "#ffffff" }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs sm:text-sm font-bold text-slate-200">
                Master Password <span className="text-amber-400">*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                {showPassword ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" /> Hide
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" /> Show
                  </>
                )}
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="block w-full pl-10 pr-11 py-3 text-base sm:text-sm font-bold text-slate-950 bg-white border-2 border-slate-300 rounded-xl placeholder:text-slate-400 placeholder:font-normal focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 shadow-sm transition-all outline-none"
                style={{ color: "#0f172a", backgroundColor: "#ffffff" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 active:from-amber-600 active:to-amber-500 text-slate-950 font-extrabold text-sm sm:text-base shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            {loading ? "Verifying Credentials..." : "Authenticate as Administrator"}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-700/80 text-center text-xs text-slate-300">
          Not an administrator?{" "}
          <Link href="/login" className="text-amber-400 hover:text-amber-300 font-bold hover:underline">
            Go to Student Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
