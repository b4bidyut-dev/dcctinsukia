import { notFound, redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Download,
  Eye,
  FileText,
  GraduationCap,
  HardDrive,
  Layers,
  ShieldCheck,
  User,
} from "lucide-react";

interface NoteDetailsProps {
  params: Promise<{ id: string }>;
}

export default async function NoteDetailsPage({ params }: NoteDetailsProps) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const { id } = await params;

  const note = await prisma.note.findUnique({
    where: { id },
    include: {
      category: true,
      uploadedBy: { select: { name: true, email: true } },
    },
  });

  if (!note || note.isDeleted) {
    notFound();
  }

  if (note.status !== "PUBLISHED" && user.role !== "ADMIN") {
    notFound();
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <Link
          href="/library"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Notes Library
        </Link>

        {/* Main Note Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Card Header Banner */}
          <div className="bg-[#0b291a] text-white p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-md text-xs font-bold bg-amber-500 text-slate-950">
                {note.category.name}
              </span>
              {note.course && (
                <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-900/60 text-emerald-200 border border-emerald-700">
                  {note.course}
                </span>
              )}
              {note.status !== "PUBLISHED" && (
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-900/80 text-amber-200">
                  {note.status}
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-3">
              {note.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-400" />
                Published: {new Date(note.publicationDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-amber-400" />
                Faculty: {note.uploadedBy.name}
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="bg-slate-100/80 px-6 sm:px-8 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4 text-xs font-mono text-slate-600">
              <span>Size: {(note.fileSize / 1024).toFixed(1)} KB</span>
              <span>•</span>
              <span>Downloads: {note.downloadCount}</span>
              <span>•</span>
              <span>Views: {note.viewCount}</span>
            </div>

            <div className="flex items-center space-x-3">
              <Link
                href={`/notes/${note.id}/view`}
                className="px-4 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs border border-emerald-200 transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Eye className="w-4 h-4 text-emerald-700" />
                Read Online
              </Link>

              <a
                href={`/api/notes/${note.id}/download`}
                download
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </a>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                Document Description & Syllabus Summary
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 whitespace-pre-line">
                {note.description || "No specific summary was provided for this study document."}
              </div>
            </div>

            {/* Note Meta Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-slate-200/80 bg-white space-y-1">
                <div className="text-xs text-slate-400 font-medium">Topic / Chapter</div>
                <div className="text-sm font-semibold text-slate-800">
                  {note.topic || "General Course Syllabus"}
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200/80 bg-white space-y-1">
                <div className="text-xs text-slate-400 font-medium">Course Curriculum</div>
                <div className="text-sm font-semibold text-slate-800">
                  {note.course || "DCC Certificate Module"}
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200/80 bg-white space-y-1">
                <div className="text-xs text-slate-400 font-medium">Academic Session</div>
                <div className="text-sm font-semibold text-slate-800">
                  {note.academicSession || "Current Session"}
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200/80 bg-white space-y-1">
                <div className="text-xs text-slate-400 font-medium">Instruction Language</div>
                <div className="text-sm font-semibold text-slate-800">
                  {note.language || "English"}
                </div>
              </div>
            </div>

            {/* Verification Notice */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start space-x-3 text-xs text-amber-900">
              <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Official District Computer Centre Study Material: </span>
                This document is verified and issued for registered students of DCC Tinsukia. Unauthorized reproduction or redistribution is prohibited.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

