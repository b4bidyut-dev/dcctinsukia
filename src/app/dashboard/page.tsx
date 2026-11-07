import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import {
  BookOpen,
  Calendar,
  Clock,
  Download,
  Eye,
  GraduationCap,
  Key,
  LayoutDashboard,
  Mail,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";
import PasswordChangeForm from "./PasswordChangeForm";

export default async function UserDashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  // Get user's recent download activity
  const recentDownloads = await prisma.downloadLog.findMany({
    where: { userId: user.id },
    include: {
      note: {
        include: { category: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const totalUserDownloads = await prisma.downloadLog.count({
    where: { userId: user.id },
  });

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome Banner */}
        <div className="bg-[#070b14] text-white p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/40 mb-2">
                <GraduationCap className="w-3.5 h-3.5" />
                Student Portal
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome, {user.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Access your course materials, download history, and student credentials.
              </p>
            </div>

            <Link
              href="/library"
              className="self-start sm:self-auto px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Explore All Notes
            </Link>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Col 1: Profile Information & Password Change */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
                <User className="w-4 h-4 text-amber-500" />
                Student Profile
              </h2>

              <div className="space-y-3.5 text-xs">
                <div>
                  <div className="text-slate-400 font-medium">Full Name</div>
                  <div className="text-sm font-semibold text-slate-800">{user.name}</div>
                </div>

                <div>
                  <div className="text-slate-400 font-medium">Email Address</div>
                  <div className="text-sm font-semibold text-slate-800">{user.email}</div>
                </div>

                <div>
                  <div className="text-slate-400 font-medium">Roll / Student ID</div>
                  <div className="text-sm font-semibold font-mono text-amber-600">
                    {user.studentId || "DCC Student"}
                  </div>
                </div>

                {user.phone && (
                  <div>
                    <div className="text-slate-400 font-medium">Mobile Number</div>
                    <div className="text-sm font-semibold text-slate-800">{user.phone}</div>
                  </div>
                )}

                <div>
                  <div className="text-slate-400 font-medium">Account Role & Status</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800">
                      {user.role}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-green-100 text-green-800">
                      {user.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <div className="text-xs text-slate-500">
                  Total notes downloaded: <span className="font-bold text-slate-800">{totalUserDownloads}</span>
                </div>
              </div>
            </div>

            {/* Change Password Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-500" />
                Change Password
              </h2>
              <PasswordChangeForm />
            </div>
          </div>

          {/* Col 2 & 3: Recent Download History */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Download className="w-4 h-4 text-amber-500" />
                  My Recent Downloads
                </h2>
                <span className="text-xs text-slate-500">
                  Last {recentDownloads.length} downloads
                </span>
              </div>

              {recentDownloads.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <Download className="w-6 h-6" />
                  </div>
                  <p className="text-xs text-slate-500">
                    You haven't downloaded any notes yet.
                  </p>
                  <Link
                    href="/library"
                    className="inline-block px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
                  >
                    Browse Notes
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {recentDownloads.map((log) => (
                    <div
                      key={log.id}
                      className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 px-2 rounded-lg transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-800">
                            {log.note.category.name}
                          </span>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3" />
                            {new Date(log.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900">
                          {log.note.title}
                        </h3>
                        <div className="text-xs text-slate-500">
                          {log.note.course ? `Course: ${log.note.course} · ` : ""}
                          {(log.note.fileSize / 1024).toFixed(1)} KB
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <Link
                          href={`/notes/${log.note.id}/view`}
                          className="px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-xs transition-colors flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </Link>
                        <a
                          href={`/api/notes/${log.note.id}/download`}
                          download
                          className="px-3 py-1.5 rounded bg-[#0b291a] hover:bg-emerald-950 text-white font-medium text-xs transition-colors flex items-center gap-1 border border-emerald-900"
                        >
                          <Download className="w-3.5 h-3.5 text-amber-400" />
                          Re-download
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

