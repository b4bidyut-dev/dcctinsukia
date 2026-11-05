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
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header Hero */}
        <div className="bg-[#0f2842] text-white p-8 sm:p-12 rounded-3xl shadow-xl relative overflow-hidden border border-[#1e4875]">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Government Recognized Centre · Tinsukia, Assam
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              About District Computer Centre
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Pioneering practical, employment-focused computer training and technical education for over two decades across Tinsukia district and Upper Assam.
            </p>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Our Mission</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              To bridge the digital literacy divide by delivering structured, accessible, and high-standard computer instruction. Through this digital notes portal, we empower students with uninterrupted 24/7 access to syllabus-aligned notes, lab manuals, and exam materials.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Computer className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Training Methodology</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We balance rigorous classroom conceptual theory with intensive hands-on lab practicals. All notes uploaded to this portal are curated by certified instructors to match both academic curricula and competitive recruitment standards.
            </p>
          </div>
        </div>

        {/* Key Courses Offered */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-500" />
            Academic Courses & Programs
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-2">
              <div className="font-bold text-sm text-slate-900">DCA</div>
              <div className="text-xs text-slate-500 font-medium">Diploma in Computer Applications</div>
              <p className="text-xs text-slate-600">
                Foundations of computing, Windows OS, MS Office Suite, Internet & Email operations.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-2">
              <div className="font-bold text-sm text-slate-900">PGDCA</div>
              <div className="text-xs text-slate-500 font-medium">Post Graduate Diploma</div>
              <p className="text-xs text-slate-600">
                Advanced programming, Relational Database Management (RDBMS/SQL), software engineering, and system design.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-2">
              <div className="font-bold text-sm text-slate-900">ADCA</div>
              <div className="text-xs text-slate-500 font-medium">Advanced Diploma</div>
              <p className="text-xs text-slate-600">
                Desktop publishing, graphics (Photoshop/CorelDraw), financial accounting, and modern web concepts.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-2">
              <div className="font-bold text-sm text-slate-900">CCC & BCC</div>
              <div className="text-xs text-slate-500 font-medium">Certificates on Computer Concepts</div>
              <p className="text-xs text-slate-600">
                Nationally recognized computer literacy courses covering essential digital workflows.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-2">
              <div className="font-bold text-sm text-slate-900">Financial Accounting</div>
              <div className="text-xs text-slate-500 font-medium">Tally Prime & GST Filing</div>
              <p className="text-xs text-slate-600">
                Ledger management, voucher entry, inventory, bank reconciliation, and GST reports.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-2">
              <div className="font-bold text-sm text-slate-900">Programming Tracks</div>
              <div className="text-xs text-slate-500 font-medium">C, C++, Java, & Python</div>
              <p className="text-xs text-slate-600">
                Logic building, object-oriented concepts, algorithms, and practical code solutions.
              </p>
            </div>
          </div>
        </div>

        {/* Contact & Location */}
        <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-md border border-slate-800 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-400" />
            Centre Location & Inquiries
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm text-slate-300">
            <div className="space-y-1">
              <div className="font-bold text-white">Campus Address</div>
              <p>District Computer Centre</p>
              <p>Senairam Higher Secondary School Campus</p>
              <p>Dist- Tinsukia, Assam, Pin 786125</p>
            </div>

            <div className="space-y-1">
              <div className="font-bold text-white">Contact Helplines</div>
              <p>Landline: +91 (0374) 233-XXXX</p>
              <p>Mobile: +91 98765-XXXXX</p>
              <p>Working Hours: 9:00 AM - 5:30 PM (Mon-Sat)</p>
            </div>

            <div className="space-y-1">
              <div className="font-bold text-white">Electronic Mail</div>
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

