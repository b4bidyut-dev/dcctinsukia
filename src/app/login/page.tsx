"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/library";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        setError(data.error || "Login failed. Please check your credentials.");
        setLoading(false);
        return;
      }

      const target = data.user?.role === "ADMIN" ? "/admin" : from;
      window.location.href = target;
    } catch {
      setError("An unexpected network error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
      {error && (
        <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3 text-xs text-red-700 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-1.5">
          Email Address <span className="text-red-600">*</span>
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
            placeholder="student@dcctinsukia.in"
            className="block w-full pl-10 pr-3.5 py-2.5 text-base sm:text-sm text-slate-900 font-semibold bg-white border-2 border-slate-300 rounded-xl placeholder:text-slate-400 placeholder:font-normal focus:bg-white focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 shadow-sm transition-colors outline-none"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs sm:text-sm font-bold text-slate-900">
            Password <span className="text-red-600">*</span>
          </label>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Lock className="w-4 h-4" />
          </div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="block w-full pl-10 pr-3.5 py-2.5 text-base sm:text-sm text-slate-900 font-semibold bg-white border-2 border-slate-300 rounded-xl placeholder:text-slate-400 placeholder:font-normal focus:bg-white focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 shadow-sm transition-colors outline-none"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {loading ? "Verifying..." : "Sign In to Portal"}
        {!loading && <ArrowRight className="w-4 h-4" />}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-100/70">
      <div className="max-w-md w-full space-y-8 bg-white p-6 sm:p-8 rounded-2xl border-2 border-slate-200 shadow-xl">
        <div className="text-center">
          <div className="mx-auto h-16 px-4 py-2 bg-white border border-slate-200 rounded-xl flex items-center justify-center shadow-md w-fit">
            <img src="/logo.png" alt="DCC Logo" className="h-10 w-auto object-contain" />
          </div>
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">
            Student Portal Login
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-700 font-medium">
            District Computer Centre Tinsukia Notes Portal
          </p>
        </div>

        <Suspense fallback={<div className="py-8 text-center text-xs text-slate-500">Loading portal login...</div>}>
          <LoginForm />
        </Suspense>

        <div className="pt-4 border-t border-slate-200 flex flex-col space-y-3 text-center text-xs sm:text-sm">
          <div className="text-slate-700 font-medium">
            Don't have an account yet?{" "}
            <Link href="/register" className="font-bold text-amber-600 hover:text-amber-700">
              Register here
            </Link>
          </div>
          <div className="text-slate-600">
            DCC Faculty / Staff?{" "}
            <Link href="/admin/login" className="font-bold text-slate-800 hover:text-emerald-800 underline">
              Admin Portal Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
