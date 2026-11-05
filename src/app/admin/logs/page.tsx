import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import { ArrowLeft, Activity, ShieldAlert, Download, Clock } from "lucide-react";

export default async function AdminLogsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const [activityLogs, downloadLogs] = await Promise.all([
    prisma.activityLog.findMany({
      include: {
        user: { select: { name: true, email: true, role: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.downloadLog.findMany({
      include: {
        user: { select: { name: true, email: true, studentId: true } },
        note: { select: { title: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Admin Dashboard
        </Link>

        {/* Audit Header */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-100 text-slate-800 text-xs font-bold mb-2">
              <Activity className="w-3.5 h-3.5" />
              Security Audit & Activity Logs
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Audit Logs & Download Records
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Live audit logging of all authentication, note modifications, administrator actions, and student PDF downloads.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Col 1: System Activity Logs */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100">
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                Administrative & System Events ({activityLogs.length})
              </h2>

              <div className="overflow-y-auto max-h-[600px] space-y-2.5 pr-2">
                {activityLogs.length === 0 ? (
                  <p className="text-xs text-slate-500">No events logged yet.</p>
                ) : (
                  activityLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-blue-900">
                          {log.action}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(log.createdAt).toLocaleString("en-IN")}
                        </span>
                      </div>
                      <p className="text-slate-700">{log.details || "—"}</p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                        <span>User: {log.user ? `${log.user.name} (${log.user.email})` : "System / Anonymous"}</span>
                        <span>IP: {log.ipAddress || "Unknown"}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Col 2: Student Download Logs */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100">
                <Download className="w-4 h-4 text-amber-500" />
                PDF Download Records ({downloadLogs.length})
              </h2>

              <div className="overflow-y-auto max-h-[600px] space-y-2.5 pr-2">
                {downloadLogs.length === 0 ? (
                  <p className="text-xs text-slate-500">No downloads recorded yet.</p>
                ) : (
                  downloadLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 line-clamp-1">
                          {log.note.title}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">
                          {new Date(log.createdAt).toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-600">
                        <span>Student: {log.user.name} ({log.user.studentId || "General"})</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          IP: {log.ipAddress || "Unknown"}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

