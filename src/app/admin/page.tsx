import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import {
  BookOpen,
  Download,
  FileText,
  HardDrive,
  PlusCircle,
  Shield,
  Upload,
  Users,
  Activity,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  // Fetch Dashboard Metrics
  const [
    totalNotes,
    publishedNotes,
    totalUsers,
    totalDownloadsAggregate,
    storageAggregate,
    recentNotes,
    recentLogs,
  ] = await Promise.all([
    prisma.note.count({ where: { isDeleted: false } }),
    prisma.note.count({ where: { status: "PUBLISHED", isDeleted: false } }),
    prisma.user.count(),
    prisma.note.aggregate({
      where: { isDeleted: false },
      _sum: { downloadCount: true, viewCount: true },
    }),
    prisma.note.aggregate({
      where: { isDeleted: false },
      _sum: { fileSize: true },
    }),
    prisma.note.findMany({
      where: { isDeleted: false },
      include: { category: true, uploadedBy: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.activityLog.findMany({
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ]);

  const totalDownloads = totalDownloadsAggregate._sum.downloadCount || 0;
  const totalViews = totalDownloadsAggregate._sum.viewCount || 0;
  const totalBytes = storageAggregate._sum.fileSize || 0;
  const storageMB = (totalBytes / (1024 * 1024)).toFixed(2);

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Admin Header */}
        <div className="bg-[#0b291a] text-white p-6 sm:p-8 rounded-2xl shadow-xl border border-[#144229] flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/40">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              Administrative Control Centre · DCC Tinsukia
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              DCC Tinsukia Admin Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl">
              System overview, upload control, student accounts, and secure document distribution analytics.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/upload"
              className="px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload PDF Note
            </Link>
            <Link
              href="/admin/notes"
              className="px-4 py-2.5 rounded-lg bg-[#144229] hover:bg-[#1a5535] text-amber-300 font-bold text-xs border border-amber-500/40 transition-all flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              Manage Notes
            </Link>
          </div>
        </div>

        {/* 4 Primary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Notes</div>
              <div className="text-3xl font-extrabold text-slate-900 mt-1">{totalNotes}</div>
              <div className="text-xs text-green-700 font-medium mt-1">
                {publishedNotes} Published · {totalNotes - publishedNotes} Draft
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Registered Users</div>
              <div className="text-3xl font-extrabold text-slate-900 mt-1">{totalUsers}</div>
              <div className="text-xs text-slate-500 mt-1">Students & Instructors</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Downloads</div>
              <div className="text-3xl font-extrabold text-slate-900 mt-1">{totalDownloads}</div>
              <div className="text-xs text-slate-500 mt-1">{totalViews} Online Document Views</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Download className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">PDF Storage Used</div>
              <div className="text-3xl font-extrabold text-slate-900 mt-1">{storageMB} MB</div>
              <div className="text-xs text-slate-500 mt-1">Local Isolated Storage</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <HardDrive className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
            Administrative Shortcuts
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link
              href="/admin/upload"
              className="p-4 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/30 transition-all text-center space-y-2 group"
            >
              <Upload className="w-6 h-6 mx-auto text-amber-600 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-slate-900">Upload New PDF</div>
              <div className="text-[11px] text-slate-500">Publish study note</div>
            </Link>

            <Link
              href="/admin/notes"
              className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition-all text-center space-y-2 group"
            >
              <BookOpen className="w-6 h-6 mx-auto text-blue-600 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-slate-900">Manage Notes</div>
              <div className="text-[11px] text-slate-500">Edit, status, replace</div>
            </Link>

            <Link
              href="/admin/users"
              className="p-4 rounded-xl border border-slate-200 hover:border-purple-400 hover:bg-purple-50/30 transition-all text-center space-y-2 group"
            >
              <Users className="w-6 h-6 mx-auto text-purple-600 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-slate-900">Manage Users</div>
              <div className="text-[11px] text-slate-500">Accounts & permissions</div>
            </Link>

            <Link
              href="/admin/logs"
              className="p-4 rounded-xl border border-slate-200 hover:border-slate-400 hover:bg-slate-100/50 transition-all text-center space-y-2 group"
            >
              <Activity className="w-6 h-6 mx-auto text-slate-700 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-slate-900">Activity Logs</div>
              <div className="text-[11px] text-slate-500">Audit & download trace</div>
            </Link>
          </div>
        </div>

        {/* 2-Column: Recent Uploads & Recent Audit Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Uploads */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-500" />
                Recently Uploaded Notes
              </h2>
              <Link href="/admin/notes" className="text-xs font-semibold text-blue-900 hover:underline">
                View All →
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {recentNotes.map((note) => (
                <div key={note.id} className="py-3 flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-800">
                        {note.category.name}
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          note.status === "PUBLISHED"
                            ? "bg-green-100 text-green-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {note.status}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-900 line-clamp-1">{note.title}</div>
                    <div className="text-[11px] text-slate-500">
                      {(note.fileSize / 1024).toFixed(1)} KB · {note.downloadCount} downloads · {note.uploadedBy.name}
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 shrink-0">
                    <Link
                      href={`/notes/${note.id}/view`}
                      className="px-2 py-1 text-xs font-medium text-slate-600 hover:text-blue-900 bg-slate-50 rounded"
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/notes?edit=${note.id}`}
                      className="px-2 py-1 text-xs font-medium text-amber-700 hover:text-amber-900 bg-amber-50 rounded"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Logs */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-500" />
                Live System Activity Trail
              </h2>
              <Link href="/admin/logs" className="text-xs font-semibold text-blue-900 hover:underline">
                Full Log →
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {recentLogs.map((log) => (
                <div key={log.id} className="py-2.5 flex items-start justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800 font-mono text-[11px]">
                        {log.action}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {log.user ? log.user.name : "System"}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] line-clamp-1">{log.details || "Action executed"}</p>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono shrink-0">
                    {new Date(log.createdAt).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

