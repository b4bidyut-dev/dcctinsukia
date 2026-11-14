"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, User, Phone, BadgeCheck, ArrowRight, AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    studentId: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed.");
        setLoading(false);
        return;
      }

      // Successful registration: redirected to library
      router.push("/library");
      router.refresh();
    } catch {
      setError("An unexpected network error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#f8faff]">
      <div className="max-w-md w-full space-y-6 bg-white p-6 sm:p-8 rounded-2xl border-2 border-blue-100 shadow-xl">
        <div className="text-center">
          <div className="mx-auto h-16 px-4 py-2 bg-white border border-blue-100 rounded-xl flex items-center justify-center shadow-md w-fit">
            <img src="/logo.png" alt="DCC Logo" className="h-10 w-auto object-contain" />
          </div>
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-blue-950">
            Create Student Account
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 font-medium">
            Enroll for online access to District Computer Centre Tinsukia study notes.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3 text-xs text-red-700 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-1.5">
              Full Name <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Rahul Sharma"
                className="block w-full pl-10 pr-3.5 py-2.5 text-base sm:text-sm text-slate-900 font-semibold bg-white border-2 border-slate-300 rounded-xl placeholder:text-slate-400 placeholder:font-normal focus:bg-white focus:border-blue-900 focus:ring-2 focus:ring-yellow-400/30 shadow-sm transition-colors outline-none"
              />
            </div>
          </div>

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
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="block w-full pl-10 pr-3.5 py-2.5 text-base sm:text-sm text-slate-900 font-semibold bg-white border-2 border-slate-300 rounded-xl placeholder:text-slate-400 placeholder:font-normal focus:bg-white focus:border-blue-900 focus:ring-2 focus:ring-yellow-400/30 shadow-sm transition-colors outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-1.5">
                Mobile Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  className="block w-full pl-10 pr-3.5 py-2.5 text-base sm:text-sm text-slate-900 font-semibold bg-white border-2 border-slate-300 rounded-xl placeholder:text-slate-400 placeholder:font-normal focus:bg-white focus:border-blue-900 focus:ring-2 focus:ring-yellow-400/30 shadow-sm transition-colors outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-1.5">
                Roll / Student ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <BadgeCheck className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="studentId"
                  value={form.studentId}
                  onChange={handleChange}
                  placeholder="e.g. DCC-2026-042"
                  className="block w-full pl-10 pr-3.5 py-2.5 text-base sm:text-sm text-slate-900 font-semibold bg-white border-2 border-slate-300 rounded-xl placeholder:text-slate-400 placeholder:font-normal focus:bg-white focus:border-blue-900 focus:ring-2 focus:ring-yellow-400/30 shadow-sm transition-colors outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-1.5">
                Password <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min 6 chars"
                  className="block w-full pl-10 pr-3.5 py-2.5 text-base sm:text-sm text-slate-900 font-semibold bg-white border-2 border-slate-300 rounded-xl placeholder:text-slate-400 placeholder:font-normal focus:bg-white focus:border-blue-900 focus:ring-2 focus:ring-yellow-400/30 shadow-sm transition-colors outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-1.5">
                Confirm Password <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-type password"
                  className="block w-full pl-10 pr-3.5 py-2.5 text-base sm:text-sm text-slate-900 font-semibold bg-white border-2 border-slate-300 rounded-xl placeholder:text-slate-400 placeholder:font-normal focus:bg-white focus:border-blue-900 focus:ring-2 focus:ring-yellow-400/30 shadow-sm transition-colors outline-none"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-yellow-400 hover:bg-yellow-300 active:bg-yellow-500 text-blue-950 font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Complete Registration"}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="pt-3 border-t border-slate-200 text-center text-xs sm:text-sm text-slate-700">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-blue-900 hover:text-blue-700 underline decoration-yellow-400 underline-offset-2">
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
}
