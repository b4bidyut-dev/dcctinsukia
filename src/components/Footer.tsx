import Link from "next/link";
import { GraduationCap, MapPin, Mail, Phone, ShieldCheck, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#091624] text-slate-300 border-t border-[#1c3c5e] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: About DCC */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-md bg-amber-500 flex items-center justify-center text-slate-950 font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">DCC Tinsukia</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              District Computer Centre Tinsukia is dedicated to imparting industry-aligned IT and computer literacy across upper Assam. Providing official academic notes, practical lab manuals, and exam preparation resources.
            </p>
            <div className="flex items-center space-x-2 text-xs text-amber-400/90 font-medium">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Government Recognized Institution</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white border-b border-slate-800 pb-1.5">
              Portal Navigation
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/library" className="hover:text-amber-400 transition-colors">
                  Notes Library & Downloads
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-amber-400 transition-colors">
                  About Centre & Faculty
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-amber-400 transition-colors">
                  Student Registration
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-amber-400 transition-colors">
                  Student Portal Login
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-amber-400 transition-colors">
                  Administrative Access
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Courses */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white border-b border-slate-800 pb-1.5">
              Offered Courses
            </h3>
            <ul className="space-y-2 text-xs text-slate-400">
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
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white border-b border-slate-800 pb-1.5">
              Contact & Address
            </h3>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>District Computer Centre, Near DC Office Road, Tinsukia, Assam - 786125</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>+91 (0374) 233-XXXX / +91 98765-XXXXX</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>info@dcctinsukia.in</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} District Computer Centre, Tinsukia. All rights reserved.
          </div>
          <div className="mt-2 sm:mt-0 flex items-center space-x-4">
            <span>Security & Privacy Compliant</span>
            <span>·</span>
            <span>Digital Study Notes Portal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

