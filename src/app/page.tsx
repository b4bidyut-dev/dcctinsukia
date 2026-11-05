import Link from "next/link";
import prisma from "@/lib/prisma";
import {
  BookOpen,
  Download,
  GraduationCap,
  ShieldCheck,
  Search,
  Sparkles,
  ArrowRight,
  FileText,
  Users,
  CheckCircle2,
  Clock,
  Layers,
  Building2,
} from "lucide-react";

export default async function HomePage() {
  const [totalNotes, totalCategories, recentNotes, totalDownloads] = await Promise.all([
    prisma.note.count({ where: { status: "PUBLISHED", isDeleted: false } }),
    prisma.category.count({ where: { isActive: true } }),
    prisma.note.findMany({
      where: { status: "PUBLISHED", isDeleted: false },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.note.aggregate({
      where: { isDeleted: false },
      _sum: { downloadCount: true },
    }),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Official Dark Green & Dark Yellow Theme */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#061c11] via-[#0b291a] to-[#123824] text-white py-20 px-4 sm:px-6 lg:px-8 border-b border-[#144229]">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>

        <div className="relative max-w-6xl mx-auto text-center space-y-6">
          <div className="mx-auto h-20 px-6 py-2.5 bg-white rounded-2xl flex items-center justify-center shadow-xl w-fit mb-2">
            <img src="/logo.png" alt="District Computer Centre Logo" className="h-14 w-auto object-contain" />
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            AMTRON Recognized · Govt. of Assam Dept. of Secondary Education
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            District Computer Centre <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-200">
              Tinsukia Notes Portal
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-base sm:text-lg text-emerald-100 font-normal leading-relaxed">
            Centralized digital repository providing authenticated access to high-quality computer study notes, syllabus-aligned handouts, and lab documentation for all enrolled students.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/library"
              className="px-6 py-3.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/30 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <BookOpen className="w-4 h-4" />
              Browse Notes Library
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/register"
              className="px-6 py-3.5 rounded-lg bg-[#144229] hover:bg-[#195233] text-amber-300 font-bold text-sm border border-amber-500/40 transition-all"
            >
              Student Registration
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-xl bg-[#061c11]/80 border border-emerald-800/80 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">{totalNotes}+</div>
              <div className="text-xs text-emerald-200 mt-1 font-medium">Verified PDF Notes</div>
            </div>
            <div className="p-4 rounded-xl bg-[#061c11]/80 border border-emerald-800/80 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">{totalCategories}</div>
              <div className="text-xs text-emerald-200 mt-1 font-medium">Academic Subjects</div>
            </div>
            <div className="p-4 rounded-xl bg-[#061c11]/80 border border-emerald-800/80 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">
                {totalDownloads._sum.downloadCount || 100}+
              </div>
              <div className="text-xs text-emerald-200 mt-1 font-medium">Study Notes Downloaded</div>
            </div>
            <div className="p-4 rounded-xl bg-[#061c11]/80 border border-emerald-800/80 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">100%</div>
              <div className="text-xs text-emerald-200 mt-1 font-medium">Faculty Authenticated</div>
            </div>
          </div>
        </div>
      </section>

      {/* Government Affiliation & History Banner */}
      <div className="bg-[#081f14] text-white border-b border-[#144229] py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#0b291a] border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400 shadow-inner">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2 justify-center md:justify-start">
                <span>Government Initiative</span>
                <span className="w-1 h-1 rounded-full bg-amber-400"></span>
                <span className="text-emerald-300">AMTRON Coordination</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 mt-0.5 font-medium leading-relaxed">
                Established under an initiative by AMTRON in coordination with the{" "}
                <span className="text-amber-300 font-bold">
                  Government of Assam&apos;s Department of Secondary Education
                </span>{" "}
                (originally under the 11th Finance Commission Computer Education Programme).
              </p>
            </div>
          </div>
          <Link
            href="/about"
            className="text-xs font-bold text-amber-400 hover:text-amber-300 bg-[#0b291a] hover:bg-[#144229] border border-amber-500/40 px-3.5 py-2 rounded-lg shrink-0 flex items-center gap-1.5 transition-all shadow-sm"
          >
            About Centre <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Featured / Recent Notes Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <div>
            <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
              Study Curriculum
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Recently Published Notes
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Faculty-uploaded computer science and application notes ready for viewing & offline study.
            </p>
          </div>
          <Link
            href="/library"
            className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 text-sm font-bold text-emerald-900 hover:text-amber-600 transition-colors"
          >
            View all published notes
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentNotes.map((note) => (
            <div
              key={note.id}
              className="bg-white rounded-xl border border-slate-200 hover:border-amber-400 shadow-sm hover:shadow-md transition-all flex flex-col p-6 group"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-200">
                  {note.category.name}
                </span>
                <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(note.publicationDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-900 transition-colors line-clamp-2 mb-2">
                {note.title}
              </h3>

              <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed flex-1">
                {note.description || "Official study and reference notes for District Computer Centre Tinsukia students."}
              </p>

              {note.course && (
                <div className="text-[11px] text-slate-500 mb-4 flex items-center gap-1.5">
                  <span className="font-semibold text-slate-700">Course:</span>
                  <span className="bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-amber-900 font-semibold">{note.course}</span>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono">
                  {(note.fileSize / 1024).toFixed(1)} KB · {note.downloadCount} downloads
                </span>

                <div className="flex items-center space-x-2">
                  <Link
                    href={`/notes/${note.id}/view`}
                    className="px-3 py-1.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-semibold transition-colors"
                  >
                    View
                  </Link>
                  <Link
                    href={`/notes/${note.id}`}
                    className="px-3 py-1.5 rounded bg-[#0b291a] hover:bg-emerald-950 text-amber-300 font-semibold transition-colors"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Advantages Section */}
      <section className="bg-emerald-50/50 border-y border-emerald-100 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Why District Computer Centre Digital Notes?
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Transforming classroom learning with instant digital access, verified syllabi, and zero paper wastage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">100% Faculty Authenticated</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every note is prepared, peer-reviewed, and uploaded exclusively by authorized DCC instructors, ensuring complete alignment with the official syllabus.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Interactive Online PDF Reader</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Read directly in your browser with responsive controls, zoom, and page navigation without needing third-party desktop readers.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-lg bg-yellow-100 text-yellow-800 flex items-center justify-center font-bold">
                <Download className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Offline Download & Re-use</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Registered students can download clean, high-resolution PDF copies for offline study, examination preparation, and lab practicals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Banner / CTA Section */}
      <section className="bg-[#0b291a] text-white py-14 px-4 sm:px-6 lg:px-8 border-t border-amber-500/30">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Ready to access your DCC course material?
          </h2>
          <p className="text-sm text-emerald-100 max-w-2xl mx-auto">
            Log in with your student credentials or register your account to view and download all course modules.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Link
              href="/register"
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-sm shadow transition-all"
            >
              Register Now
            </Link>
            <Link
              href="/login"
              className="px-6 py-2.5 bg-[#144229] hover:bg-[#1a5535] text-amber-300 font-bold rounded-lg text-sm border border-amber-500/40 transition-all"
            >
              Student Login
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
