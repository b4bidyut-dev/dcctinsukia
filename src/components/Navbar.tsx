"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BookOpen,
  LayoutDashboard,
  LogOut,
  Menu,
  Shield,
  Upload,
  User,
  X,
  FileText,
  Phone,
} from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  studentId?: string | null;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        if (data?.authenticated) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/");
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  const isAdmin = user?.role === "ADMIN";

  return (
    <header className="sticky top-0 z-50 bg-[#090d16] text-white border-b border-slate-800 shadow-lg">
      {/* Top Banner */}
      <div className="bg-[#05070e] px-4 py-1.5 text-xs text-slate-300 border-b border-slate-800/80 hidden sm:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
              AMTRON Recognized
            </span>
            <span className="text-slate-300 font-medium">Govt. of Assam Dept. of Secondary Education · DCC Tinsukia</span>
          </div>
          <div className="flex items-center space-x-4 text-slate-300">
            <span>Help: <a href="tel:+918974738121" className="text-amber-400 font-bold hover:underline">+91-8974738121</a></span>
            {user && (
              <span className="text-amber-300 font-medium border-l border-slate-700 pl-3">
                Welcome, {user.name} ({user.role})
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-18 items-center">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group min-w-0">
            <div className="h-10 sm:h-11 px-2 py-1 bg-white rounded-lg flex items-center justify-center shadow-md shadow-slate-950/40 group-hover:scale-105 transition-transform shrink-0">
              <img src="/logo.png" alt="DCC Logo" className="h-7 sm:h-8 w-auto object-contain" />
            </div>
            <div className="min-w-0">
              <div className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-1.5 truncate">
                DCC Tinsukia <span className="text-amber-400 font-bold text-xs sm:text-sm">Notes Portal</span>
              </div>
              <div className="text-[11px] sm:text-xs text-slate-300 font-normal truncate">
                District Computer Centre · Academic Repository
              </div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 text-sm font-medium">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md transition-colors ${
                pathname === "/"
                  ? "bg-slate-800 text-amber-300 font-bold border border-amber-500/30"
                  : "text-slate-200 hover:text-amber-300 hover:bg-slate-800/60"
              }`}
            >
              Home
            </Link>

            <Link
              href="/library"
              className={`px-3 py-2 rounded-md flex items-center gap-1.5 transition-colors ${
                pathname.startsWith("/library")
                  ? "bg-slate-800 text-amber-300 font-bold border border-amber-500/30"
                  : "text-slate-200 hover:text-amber-300 hover:bg-slate-800/60"
              }`}
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              Notes Library
            </Link>

            <Link
              href="/about"
              className={`px-3 py-2 rounded-md transition-colors ${
                pathname === "/about"
                  ? "bg-slate-800 text-amber-300 font-bold border border-amber-500/30"
                  : "text-slate-200 hover:text-amber-300 hover:bg-slate-800/60"
              }`}
            >
              About DCC
            </Link>

            {user && (
              <Link
                href="/dashboard"
                className={`px-3 py-2 rounded-md flex items-center gap-1.5 transition-colors ${
                  pathname === "/dashboard"
                    ? "bg-slate-800 text-amber-300 font-bold border border-amber-500/30"
                    : "text-slate-200 hover:text-amber-300 hover:bg-slate-800/60"
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-amber-400" />
                Student Portal
              </Link>
            )}

            {isAdmin && (
              <div className="flex items-center pl-2 ml-2 border-l border-slate-700 space-x-1">
                <Link
                  href="/admin"
                  className={`px-3 py-2 rounded-md flex items-center gap-1.5 transition-colors ${
                    pathname === "/admin"
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold"
                      : "text-amber-300 hover:bg-slate-800/60"
                  }`}
                >
                  <Shield className="w-4 h-4 text-amber-400" />
                  Admin
                </Link>
                <Link
                  href="/admin/upload"
                  className="px-3 py-1.5 rounded-md text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1 transition-all shadow-sm"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Upload PDF
                </Link>
              </div>
            )}
          </nav>

          {/* User Auth Buttons (Desktop) */}
          <div className="hidden md:flex items-center space-x-3">
            {loading ? (
              <div className="w-20 h-8 bg-emerald-900/60 animate-pulse rounded"></div>
            ) : user ? (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-xs font-bold text-white">{user.name}</div>
                  <div className="text-[11px] text-amber-400 font-mono">
                    {user.studentId || user.role}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-white hover:bg-red-950/60 hover:border-red-700/60 border border-emerald-800 rounded-md transition-all"
                  title="Log out"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-400" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold text-amber-300 hover:text-white hover:bg-[#144229] border border-amber-500/40 rounded-md transition-colors"
                >
                  Student Login
                </Link>
                <Link
                  href="/register"
                  className="px-3.5 py-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-md shadow-sm transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-200 hover:text-amber-300 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#070b14] border-b border-slate-800 px-4 pt-3 pb-5 space-y-2">
          {user && (
            <div className="p-3 bg-slate-900 rounded-lg mb-3 border border-slate-700">
              <div className="font-semibold text-sm text-white">{user.name}</div>
              <div className="text-xs text-amber-400">{user.email} · {user.role}</div>
            </div>
          )}

          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base text-slate-200 hover:bg-slate-800"
          >
            Home
          </Link>
          <Link
            href="/library"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base text-slate-200 hover:bg-slate-800"
          >
            Notes Library
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base text-slate-200 hover:bg-slate-800"
          >
            About DCC
          </Link>

          {user && (
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base text-slate-200 hover:bg-slate-800"
            >
              Student Portal
            </Link>
          )}

          {isAdmin && (
            <div className="pt-2 border-t border-slate-800 space-y-1">
              <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider px-3">
                Admin Area
              </div>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base text-amber-300 hover:bg-slate-800"
              >
                Admin Dashboard
              </Link>
              <Link
                href="/admin/upload"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base text-amber-300 hover:bg-slate-800"
              >
                Upload New PDF Note
              </Link>
              <Link
                href="/admin/notes"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base text-amber-300 hover:bg-slate-800"
              >
                Manage Notes
              </Link>
              <Link
                href="/admin/users"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base text-amber-300 hover:bg-slate-800"
              >
                Manage Users
              </Link>
            </div>
          )}

          <div className="pt-4 border-t border-slate-800 flex flex-col space-y-2">
            {user ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full py-2 px-3 text-center text-sm font-medium text-red-400 bg-red-950/20 border border-red-900/40 rounded-md"
              >
                Sign Out
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2 px-3 text-center text-sm font-medium text-amber-300 bg-slate-900 border border-amber-500/40 rounded-md"
                >
                  Student Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2 px-3 text-center text-sm font-bold text-slate-950 bg-amber-500 rounded-md shadow"
                >
                  Create Account
                </Link>
                <Link
                  href="/admin/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-1.5 px-3 text-center text-xs text-amber-400 hover:underline"
                >
                  Administrator Login →
                </Link>
              </>
            )}
          </div>

          <div className="pt-3 border-t border-slate-800/80 space-y-2">
            <a
              href="tel:+918974738121"
              className="flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow transition-colors"
            >
              <Phone className="w-4 h-4 text-slate-950" />
              Call Helpline: +91-8974738121
            </a>
            <div className="text-[11px] text-center text-slate-400">
              Govt. of Assam Dept. of Secondary Education · AMTRON
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
