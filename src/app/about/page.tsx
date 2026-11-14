import Link from "next/link";
import {
  GraduationCap,
  ShieldCheck,
  MapPin,
  Mail,
  Phone,
  Award,
  BookOpen,
  Users,
  Computer,
  CheckCircle2,
  Building2,
  ExternalLink,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-[#f8faff] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header Hero */}
        <div className="bg-gradient-to-r from-[#0a192f] via-[#0f2744] to-[#1e3a8a] text-white p-8 sm:p-12 rounded-3xl shadow-xl relative overflow-hidden border border-blue-900/60">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="h-14 px-3.5 py-1.5 bg-white rounded-xl flex items-center justify-center shadow w-fit">
              <img src="/logo.png" alt="DCC Logo" className="h-9 w-auto object-contain" />
            </div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-300 text-xs font-bold border border-yellow-400/40">
              <ShieldCheck className="w-3.5 h-3.5 text-yellow-400" />
              Govt. of Assam Dept. of Secondary Education · 11th Finance Commission Initiative
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              About <span className="text-yellow-400">District Computer Centre</span>
            </h1>
            <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
              Pioneering practical, employment-focused computer training and technical education for over two decades across Tinsukia district and Upper Assam.
            </p>
          </div>
        </div>

        {/* Network & AMTRON Affiliation Notice */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border-l-4 border-l-yellow-400 border border-blue-100 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center shrink-0 mt-0.5 border border-blue-200">
            <Building2 className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                Network & Government Coordination
              </h3>
              <a
                href="https://et.amtron.in/center/index"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-blue-900 hover:text-blue-700 inline-flex items-center gap-1 bg-yellow-400/10 px-2.5 py-1 rounded border border-yellow-400/30 transition-colors"
              >
                AMTRON Centres Directory
                <ExternalLink className="w-3 h-3 text-yellow-600" />
              </a>
            </div>
            <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-normal">
              The District Computer Centres (DCCs) are government-operated computer training and digital literacy centers established across various districts in Assam under an initiative by AMTRON (
              <a
                href="http://amtron.in/node.php?lnk=AMThstr"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-blue-900 hover:text-blue-700 underline decoration-yellow-400 underline-offset-2 transition-colors inline-flex items-center gap-1"
              >
                Assam Electronics Development Corporation Ltd.
                <ExternalLink className="w-3.5 h-3.5 text-yellow-500" />
              </a>
              ) in coordination with the Government of Assam&apos;s Department of Secondary Education (originally under the 11th Finance Commission Computer Education Programme).
            </p>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-blue-100 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-100 text-yellow-800 flex items-center justify-center border border-yellow-200">
              <Award className="w-6 h-6 text-yellow-700" />
            </div>
            <h2 className="text-lg font-bold text-blue-950">Our Mission</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              To bridge the digital literacy divide by delivering structured, accessible, and high-standard computer instruction. Through this digital notes portal, we empower students with uninterrupted 24/7 access to syllabus-aligned notes, lab manuals, and exam materials.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-blue-100 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center border border-blue-200">
              <Computer className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-blue-950">Training Methodology</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We balance rigorous classroom conceptual theory with intensive hands-on lab practicals. All notes uploaded to this portal are curated by certified instructors to match both academic curricula and competitive recruitment standards.
            </p>
          </div>
        </div>

        {/* Key Courses Offered */}
        <div className="bg-white p-8 rounded-2xl border border-blue-100 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-blue-950 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-yellow-500" />
            Academic Courses & Programs
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/40 space-y-2 hover:border-yellow-400 transition-colors">
              <div className="font-bold text-sm text-blue-950">DCA</div>
              <div className="text-xs text-blue-800 font-semibold">Diploma in Computer Applications</div>
              <p className="text-xs text-slate-600">
                Foundations of computing, Windows OS, MS Office Suite, Internet & Email operations.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/40 space-y-2 hover:border-yellow-400 transition-colors">
              <div className="font-bold text-sm text-blue-950">PGDCSA</div>
              <div className="text-xs text-blue-800 font-semibold">Post Graduate Diploma in Computer Software Applications</div>
              <p className="text-xs text-slate-600">
                Advanced software engineering, modern programming, Relational Database Management (RDBMS/SQL), and systems analysis.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/40 space-y-2 hover:border-yellow-400 transition-colors">
              <div className="font-bold text-sm text-blue-950">DOA & FA</div>
              <div className="text-xs text-blue-800 font-semibold">Diploma in Office Automation & Financial Accounting</div>
              <p className="text-xs text-slate-600">
                Integrated course covering office automation (Word/Excel/PowerPoint), business correspondence, and Tally Prime with GST.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/40 space-y-2 hover:border-yellow-400 transition-colors">
              <div className="font-bold text-sm text-blue-950">ADCA</div>
              <div className="text-xs text-blue-800 font-semibold">Advanced Diploma in Computer Applications</div>
              <p className="text-xs text-slate-600">
                Desktop publishing, graphics (Photoshop/CorelDraw), financial accounting, and modern web concepts.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/40 space-y-2 hover:border-yellow-400 transition-colors">
              <div className="font-bold text-sm text-blue-950">FA (Financial Accounting)</div>
              <div className="text-xs text-blue-800 font-semibold">Tally Prime & GST Filing</div>
              <p className="text-xs text-slate-600">
                Ledger management, voucher entry, inventory, bank reconciliation, and statutory GST reports.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/40 space-y-2 hover:border-yellow-400 transition-colors">
              <div className="font-bold text-sm text-blue-950">DIA</div>
              <div className="text-xs text-blue-800 font-semibold">Diploma in Industrial Accounting</div>
              <p className="text-xs text-slate-600">
                Industrial accounting standards, advanced Tally Prime, GST computation, payroll processing, and financial reporting.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/40 space-y-2 hover:border-yellow-400 transition-colors">
              <div className="font-bold text-sm text-blue-950">Programming Tracks</div>
              <div className="text-xs text-blue-800 font-semibold">C, C++, Java, & Python</div>
              <p className="text-xs text-slate-600">
                Logic building, object-oriented concepts, algorithms, and practical code solutions.
              </p>
            </div>
          </div>
        </div>

        {/* Contact & Location */}
        <div className="bg-[#0a192f] text-white p-8 rounded-2xl shadow-xl border border-blue-900/70 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-yellow-400" />
            Centre Location & Inquiries
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm text-blue-100">
            <div className="space-y-1">
              <div className="font-bold text-yellow-400 uppercase tracking-wider text-xs">Campus Address</div>
              <p className="font-bold text-white">"District Computer Centre"</p>
              <p>Senairam Higher Secondary School Campus</p>
              <p>Dist- Tinsukia, Assam, Pin 786125</p>
            </div>

            <div className="space-y-1">
              <div className="font-bold text-yellow-400 uppercase tracking-wider text-xs">Contact Helplines</div>
              <p className="text-white font-bold flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-yellow-400" />
                <a href="tel:+918974738121" className="hover:text-yellow-300">
                  +91-8974738121
                </a>
              </p>
              <p className="text-blue-200">Working Hours: 8:00 AM - 6:00 PM (Mon-Sat)</p>
              <p className="text-[11px] text-yellow-300 pt-1 border-t border-blue-800">
                Developer: Bidyut Gogoi (9366125201)
              </p>
            </div>

            <div className="space-y-1">
              <div className="font-bold text-yellow-400 uppercase tracking-wider text-xs">Electronic Mail</div>
              <p>General Queries: info@dcctinsukia.in</p>
              <p>Academics: notes@dcctinsukia.in</p>
              <p>Support: support@dcctinsukia.in</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
