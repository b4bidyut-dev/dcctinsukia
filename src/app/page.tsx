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
    <div className="flex flex-col min-h-screen bg-[#f8faff]">
      {/* Hero Section with Royal Blue Theme + High-Visibility IT Tools Background + Electric Yellow Accents */}
      <section className="relative overflow-hidden bg-[#0a192f] text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-blue-900/80">
        {/* High-Visibility IT Tools Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-85 pointer-events-none transition-opacity"
          style={{ backgroundImage: `url('/it-tools-hero-bg.jpg')` }}
        />
        {/* Deep Royal Navy Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a192f]/80 via-[#0f2744]/45 to-[#0a192f]/85 pointer-events-none" />

        {/* Subtle Yellow pattern */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#facc15_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Frosted Royal Navy Glass Container */}
          <div className="backdrop-blur-md bg-[#0a192f]/70 border-2 border-yellow-400/40 p-6 sm:p-12 rounded-3xl shadow-2xl space-y-6">
            <div className="mx-auto h-20 px-6 py-2.5 bg-white rounded-2xl flex items-center justify-center shadow-xl w-fit mb-2 border border-blue-200">
              <img src="/logo.png" alt="District Computer Centre Logo" className="h-14 w-auto object-contain" />
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-yellow-400/20 border border-yellow-400/60 text-yellow-300 text-xs font-extrabold uppercase tracking-wider backdrop-blur-sm shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              AMTRON Recognized · Govt. of Assam Dept. of Secondary Education
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              District Computer Centre <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-200">
                Tinsukia Notes Portal
              </span>
            </h1>

            <p className="max-w-3xl mx-auto text-base sm:text-lg text-blue-100 font-medium leading-relaxed">
              Centralized digital repository providing authenticated access to high-quality computer study notes, syllabus-aligned handouts, and lab documentation for all enrolled students.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                href="/library"
                className="px-6 py-3.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-extrabold text-sm shadow-lg shadow-yellow-500/30 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
              >
                <BookOpen className="w-4 h-4 text-blue-950" />
                Browse Notes Library
                <ArrowRight className="w-4 h-4 text-blue-950" />
              </Link>

              <Link
                href="/register"
                className="px-6 py-3.5 rounded-xl bg-blue-950/80 hover:bg-blue-900 text-yellow-300 font-bold text-sm border-2 border-yellow-400/50 backdrop-blur-sm transition-all"
              >
                Student Registration
              </Link>
            </div>
          </div>

          {/* Quick Metrics Bar with Blue Glass Cards */}
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-xl bg-[#0c213d]/85 border border-blue-700/60 backdrop-blur-md shadow-lg">
              <div className="text-2xl sm:text-3xl font-extrabold text-yellow-400">{totalNotes}+</div>
              <div className="text-xs text-blue-200 mt-1 font-semibold">Verified PDF Notes</div>
            </div>
            <div className="p-4 rounded-xl bg-[#0c213d]/85 border border-blue-700/60 backdrop-blur-md shadow-lg">
              <div className="text-2xl sm:text-3xl font-extrabold text-yellow-400">{totalCategories}</div>
              <div className="text-xs text-blue-200 mt-1 font-semibold">Academic Subjects</div>
            </div>
            <div className="p-4 rounded-xl bg-[#0c213d]/85 border border-blue-700/60 backdrop-blur-md shadow-lg">
              <div className="text-2xl sm:text-3xl font-extrabold text-yellow-400">
                {totalDownloads._sum.downloadCount || 100}+
              </div>
              <div className="text-xs text-blue-200 mt-1 font-semibold">Study Notes Downloaded</div>
            </div>
            <div className="p-4 rounded-xl bg-[#0c213d]/85 border border-blue-700/60 backdrop-blur-md shadow-lg">
              <div className="text-2xl sm:text-3xl font-extrabold text-yellow-400">100%</div>
              <div className="text-xs text-blue-200 mt-1 font-semibold">Faculty Authenticated</div>
            </div>
          </div>
        </div>
      </section>

      {/* Government Affiliation & History Banner */}
      <div className="bg-[#081528] text-white border-b border-blue-900/80 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-900/80 border border-yellow-400/40 flex items-center justify-center shrink-0 text-yellow-400 shadow-inner">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-yellow-400 flex items-center gap-2 justify-center md:justify-start">
                <span>Government Initiative</span>
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
                <span className="text-yellow-300">AMTRON Coordination</span>
              </div>
              <p className="text-xs sm:text-sm text-blue-100 mt-0.5 font-medium leading-relaxed">
                Established under an initiative by AMTRON in coordination with the{" "}
                <span className="text-yellow-300 font-bold">
                  Government of Assam&apos;s Department of Secondary Education
                </span>{" "}
                (originally under the 11th Finance Commission Computer Education Programme).
              </p>
            </div>
          </div>
          <Link
            href="/about"
            className="text-xs font-extrabold text-blue-950 bg-yellow-400 hover:bg-yellow-300 px-4 py-2 rounded-xl shrink-0 flex items-center gap-1.5 transition-all shadow-md"
          >
            About Centre <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Featured / Recent Notes Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <div>
            <div className="text-xs font-extrabold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block shadow-sm"></span>
              Study Curriculum
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Recently Published Notes
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Faculty-uploaded computer science and application notes ready for viewing & offline study.
            </p>
          </div>
          <Link
            href="/library"
            className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 text-sm font-bold text-blue-700 hover:text-blue-900 transition-colors"
          >
            View all published notes
            <ArrowRight className="w-4 h-4 text-yellow-500" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentNotes.map((note) => (
            <div
              key={note.id}
              className="bg-white rounded-2xl border-2 border-slate-200 hover:border-yellow-400 shadow-sm hover:shadow-lg transition-all flex flex-col p-6 group"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-extrabold bg-blue-50 text-blue-950 border border-blue-200">
                  {note.category.name}
                </span>
                <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-yellow-500" />
                  {new Date(note.publicationDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2 mb-2">
                {note.title}
              </h3>

              <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed flex-1">
                {note.description || "Official study and reference notes for District Computer Centre Tinsukia students."}
              </p>

              {note.course && (
                <div className="text-[11px] text-slate-600 mb-4 flex items-center gap-1.5">
                  <span className="font-bold text-slate-700">Course:</span>
                  <span className="bg-yellow-100 border border-yellow-300 px-2.5 py-0.5 rounded-lg text-yellow-950 font-bold">{note.course}</span>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono">
                  {(note.fileSize / 1024).toFixed(1)} KB · {note.downloadCount} downloads
                </span>

                <div className="flex items-center space-x-2">
                  <Link
                    href={`/notes/${note.id}/view`}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-950 font-bold border border-blue-200 transition-colors"
                  >
                    View
                  </Link>
                  <Link
                    href={`/notes/${note.id}`}
                    className="px-3.5 py-1.5 rounded-xl bg-[#0a192f] hover:bg-blue-950 text-yellow-300 font-bold transition-colors"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Advantages Section with Soft Ice Blue Background */}
      <section className="bg-blue-50/70 border-y border-blue-200/80 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Why District Computer Centre Digital Notes?
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Transforming classroom learning with instant digital access, verified syllabi, and zero paper wastage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-yellow-100 text-yellow-800 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">100% Faculty Authenticated</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every note is prepared, peer-reviewed, and uploaded exclusively by authorized DCC instructors, ensuring complete alignment with the official syllabus.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center font-bold">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Interactive Online PDF Reader</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Read directly in your browser with responsive controls, zoom, and page navigation without needing third-party desktop readers.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-yellow-400 text-blue-950 flex items-center justify-center font-bold shadow-sm">
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

      {/* Banner / CTA Section in Royal Blue with Yellow Call-to-Action */}
      <section className="bg-[#0a192f] text-white py-14 px-4 sm:px-6 lg:px-8 border-t-2 border-yellow-400/50">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Ready to access your DCC course material?
          </h2>
          <p className="text-sm text-blue-100 max-w-2xl mx-auto">
            Log in with your student credentials or register your account to view and download all course modules.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Link
              href="/register"
              className="px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-extrabold rounded-xl text-sm shadow-lg shadow-yellow-500/25 transition-all"
            >
              Register Now
            </Link>
            <Link
              href="/login"
              className="px-6 py-3 bg-blue-900/90 hover:bg-blue-800 text-yellow-300 font-bold rounded-xl text-sm border-2 border-yellow-400/50 transition-all"
            >
              Student Login
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
