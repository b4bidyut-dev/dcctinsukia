import Link from "next/link";
import { GraduationCap, MapPin, Mail, Phone, ShieldCheck, Heart, User } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#081f14] text-slate-300 border-t border-[#144229] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: About DCC */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-3">
              <div className="h-10 px-2.5 py-1 rounded-lg bg-white flex items-center justify-center shadow">
                <img src="/logo.png" alt="DCC Logo" className="h-7 w-auto object-contain" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">DCC Tinsukia</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              District Computer Centre Tinsukia is dedicated to imparting industry-aligned IT and computer literacy across upper Assam in coordination with AMTRON and Government of Assam. Providing official academic notes, practical lab manuals, and exam preparation resources.
            </p>
            <div className="flex items-center space-x-2 text-xs text-amber-400 font-semibold">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Government Recognized Institution</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 border-b border-emerald-900/80 pb-1.5">
              Portal Navigation
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/library" className="text-slate-300 hover:text-amber-400 transition-colors">
                  Notes Library & Downloads
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-300 hover:text-amber-400 transition-colors">
                  About Centre & Faculty
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-slate-300 hover:text-amber-400 transition-colors">
                  Student Registration
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-slate-300 hover:text-amber-400 transition-colors">
                  Student Portal Login
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="text-slate-300 hover:text-amber-400 transition-colors">
                  Administrative Access
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Courses */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 border-b border-emerald-900/80 pb-1.5">
              Offered Courses
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>• DCA (Diploma in Computer Applications)</li>
              <li>• PGDCA (Post Graduate Diploma)</li>
              <li>• ADCA (Advanced Diploma)</li>
              <li>• CCC (Course on Computer Concepts)</li>
              <li>• Financial Accounting (Tally Prime / GST)</li>
              <li>• C, C++, Java & Python Programming</li>
            </ul>
          </div>

          {/* Col 4: Centre Location & Contact */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 border-b border-emerald-900/80 pb-1.5">
              Contact & Address
            </h3>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>"District Computer centre", Senairam Higher Secondary School Campus, Dist- Tinsukia, Assam, Pin 786125</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="tel:+918974738131" className="hover:text-amber-300 font-medium">
                  +91-8974738131
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>info@dcctinsukia.in</span>
              </div>
            </div>
          </div>
        </div>

        {/* Developer Credit Callout Box */}
        <div className="mt-8 pt-6 border-t border-emerald-900/60 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-700/50 text-xs">
            <span className="text-amber-400 font-bold">Developed by:</span>
            <span className="text-white font-semibold">Bidyut Gogoi</span>
            <span className="text-slate-400">|</span>
            <span className="text-amber-300 font-medium">Contact No: 9366125201</span>
          </div>

          <div className="text-xs text-slate-400">
            © {new Date().getFullYear()} District Computer Centre, Tinsukia. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
