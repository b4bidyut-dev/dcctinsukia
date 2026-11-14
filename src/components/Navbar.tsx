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
      window.location.href = "/";
    } catch (e) {
      console.error(e);
    }
  };

  const isAdmin = user?.role === "ADMIN";

  return (
    <header className="sticky top-0 z-50 bg-[#0a192f] text-white border-b border-blue-900/60 shadow-xl shadow-blue-950/30">
      {/* Top Banner with Royal Blue & Gold/Yellow styling */}
      <div className="bg-[#06101e] px-4 py-1.5 text-xs text-blue-200 border-b border-blue-900/60 hidden sm:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-extrabold bg-yellow-400 text-blue-950 shadow-sm">
              AMTRON Recognized
            </span>
            <span className="text-blue-100 font-medium">Govt. of Assam Dept. of Secondary Education · DCC Tinsukia</span>
          </div>
          <div className="flex items-center space-x-4 text-blue-200">
            <span>Help: <a href="tel:+918974738121" className="text-yellow-400 font-extrabold hover:text-yellow-300 hover:underline">+91-8974738121</a></span>
            {user && (
              <span className="text-yellow-300 font-semibold border-l border-blue-800 pl-3">
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
            <div className="h-10 sm:h-11 px-2.5 py-1 bg-white rounded-xl flex items-center justify-center shadow-md shadow-blue-950/40 group-hover:scale-105 transition-transform shrink-0 border border-blue-200">
              <img src="/logo.png" alt="DCC Logo" className="h-7 sm:h-8 w-auto object-contain" />
            </div>
            <div className="min-w-0">
              <div className="text-base sm:text-lg font-extrabold tracking-tight text-white flex items-center gap-1.5 truncate">
                DCC Tinsukia <span className="text-yellow-400 font-extrabold text-xs sm:text-sm">Notes Portal</span>
              </div>
              <div className="text-[11px] sm:text-xs text-blue-200 font-medium truncate">
                District Computer Centre · Academic Repository
              </div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 text-sm font-semibold">
            <Link
              href="/"
              className={`px-3 py-2 rounded-lg transition-all ${
                pathname === "/"
                  ? "bg-blue-900/80 text-yellow-300 font-bold border border-yellow-400/40 shadow-sm"
                  : "text-blue-100 hover:text-yellow-300 hover:bg-blue-900/40"
              }`}
            >
              Home
            </Link>

            <Link
              href="/library"
              className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
                pathname.startsWith("/library")
                  ? "bg-blue-900/80 text-yellow-300 font-bold border border-yellow-400/40 shadow-sm"
                  : "text-blue-100 hover:text-yellow-300 hover:bg-blue-900/40"
              }`}
            >
              <BookOpen className="w-4 h-4 text-yellow-400" />
              Notes Library
            </Link>

            <Link
              href="/about"
              className={`px-3 py-2 rounded-lg transition-all ${
                pathname === "/about"
                  ? "bg-blue-900/80 text-yellow-300 font-bold border border-yellow-400/40 shadow-sm"
                  : "text-blue-100 hover:text-yellow-300 hover:bg-blue-900/40"
              }`}
            >
              About DCC
            </Link>

            {user && (
              <Link
                href="/dashboard"
                className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
                  pathname === "/dashboard"
                    ? "bg-blue-900/80 text-yellow-300 font-bold border border-yellow-400/40 shadow-sm"
                    : "text-blue-100 hover:text-yellow-300 hover:bg-blue-900/40"
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-yellow-400" />
                Student Portal
              </Link>
            )}

            {isAdmin && (
              <div className="flex items-center pl-2 ml-2 border-l border-blue-800 space-x-1.5">
                <Link
                  href="/admin"
                  className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
                    pathname === "/admin"
                      ? "bg-yellow-400/20 text-yellow-300 border border-yellow-400/50 font-bold"
                      : "text-yellow-300 hover:bg-blue-900/50"
                  }`}
                >
                  <Shield className="w-4 h-4 text-yellow-400" />
                  Admin
                </Link>
                <Link
                  href="/admin/upload"
                  className="px-3 py-1.5 rounded-lg text-xs font-extrabold bg-yellow-400 hover:bg-yellow-300 text-blue-950 flex items-center gap-1 transition-all shadow-sm"
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
              <div className="w-20 h-8 bg-blue-900/50 animate-pulse rounded-lg"></div>
            ) : user ? (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-xs font-bold text-white">{user.name}</div>
                  <div className="text-[11px] text-yellow-400 font-mono font-semibold">
                    {user.studentId || user.role}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-100 hover:text-white hover:bg-red-950/60 hover:border-red-600 border border-blue-800 rounded-lg transition-all cursor-pointer"
                  title="Log out"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-400" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2.5">
                <Link
                  href="/login"
                  className="px-4 py-2 text-xs font-bold text-yellow-300 hover:text-blue-950 hover:bg-yellow-400 border-2 border-yellow-400 rounded-xl transition-all shadow-sm"
                >
                  Student Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-xs font-extrabold bg-yellow-400 hover:bg-yellow-300 text-blue-950 rounded-xl shadow-md shadow-yellow-500/25 transition-all"
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
              className="p-2 text-yellow-400 hover:text-yellow-300 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a192f] border-b border-blue-900/80 px-4 pt-3 pb-5 space-y-2">
          {user && (
            <div className="p-3 bg-blue-950/90 rounded-xl mb-3 border border-blue-800/80">
              <div className="font-bold text-sm text-white">{user.name}</div>
              <div className="text-xs text-yellow-400 font-semibold">{user.email} · {user.role}</div>
            </div>
          )}

          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base text-blue-100 hover:text-yellow-300 hover:bg-blue-900/50 font-medium"
          >
            Home
          </Link>
          <Link
            href="/library"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base text-blue-100 hover:text-yellow-300 hover:bg-blue-900/50 font-medium"
          >
            Notes Library
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base text-blue-100 hover:text-yellow-300 hover:bg-blue-900/50 font-medium"
          >
            About DCC
          </Link>

          {user && (
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base text-blue-100 hover:text-yellow-300 hover:bg-blue-900/50 font-medium"
            >
              Student Portal
            </Link>
          )}

          {isAdmin && (
            <div className="pt-2 border-t border-blue-900/80 space-y-1">
              <div className="text-xs font-bold text-yellow-400 uppercase tracking-wider px-3">
                Admin Area
              </div>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base text-yellow-300 hover:bg-blue-900/50 font-medium"
              >
                Admin Dashboard
              </Link>
              <Link
                href="/admin/upload"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base text-yellow-300 hover:bg-blue-900/50 font-medium"
              >
                Upload New PDF Note
              </Link>
              <Link
                href="/admin/notes"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base text-yellow-300 hover:bg-blue-900/50 font-medium"
              >
                Manage Notes
              </Link>
              <Link
                href="/admin/users"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base text-yellow-300 hover:bg-blue-900/50 font-medium"
              >
                Manage Users
              </Link>
            </div>
          )}

          <div className="pt-4 border-t border-blue-900/80 flex flex-col space-y-2">
            {user ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full py-2.5 px-3 text-center text-sm font-bold text-red-400 bg-red-950/40 border border-red-800 rounded-xl"
              >
                Sign Out
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 px-3 text-center text-sm font-bold text-yellow-300 bg-blue-900/50 border border-yellow-400/50 rounded-xl"
                >
                  Student Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 px-3 text-center text-sm font-extrabold text-blue-950 bg-yellow-400 hover:bg-yellow-300 rounded-xl shadow"
                >
                  Create Account
                </Link>
                <Link
                  href="/admin/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2 px-3 text-center text-xs text-yellow-400 font-semibold hover:underline"
                >
                  Administrator Login →
                </Link>
              </>
            )}
          </div>

          <div className="pt-3 border-t border-blue-900/80 space-y-2">
            <a
              href="tel:+918974738121"
              className="flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-extrabold text-blue-950 bg-yellow-400 hover:bg-yellow-300 rounded-xl shadow transition-colors"
            >
              <Phone className="w-4 h-4 text-blue-950" />
              Call Helpline: +91-8974738121
            </a>
            <div className="text-[11px] text-center text-blue-300">
              Govt. of Assam Dept. of Secondary Education · AMTRON
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
