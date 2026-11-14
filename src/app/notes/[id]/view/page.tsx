import { notFound, redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  FileText,
  Share2,
  Calendar,
  Layers,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";
import PdfViewerClient from "./PdfViewerClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function NoteViewPage({ params }: PageProps) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/login?from=/notes/${id}/view`);
  }

  const note = await prisma.note.findUnique({
    where: { id },
    include: {
      category: true,
      uploadedBy: { select: { name: true } },
    },
  });

  if (!note || note.isDeleted) {
    notFound();
  }

  if (note.status !== "PUBLISHED" && user.role !== "ADMIN") {
    notFound();
  }

  const pdfUrl = `/api/notes/${note.id}/view`;
  const downloadUrl = `/api/notes/${note.id}/download`;

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col text-white">
      {/* Viewer Header */}
      <div className="bg-[#081f14] border-b border-[#144229] px-4 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-18 z-40">
        <div className="flex items-center space-x-3">
          <Link
            href="/library"
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-emerald-950 transition-colors"
            title="Back to Notes Library"
          >
            <ArrowLeft className="w-5 h-5 text-amber-400" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {note.category.name}
              </span>
              {note.course && (
                <span className="text-[11px] text-emerald-200">
                  {note.course}
                </span>
              )}
            </div>
            <h1 className="text-sm sm:text-base font-bold text-white truncate max-w-md sm:max-w-xl">
              {note.title}
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <span className="hidden sm:inline-block text-xs text-slate-400 font-mono">
            {(note.fileSize / 1024).toFixed(1)} KB
          </span>
          <a
            href={downloadUrl}
            download
            className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Download PDF
          </a>
        </div>
      </div>

      {/* Main Interactive Client Viewer */}
      <div className="flex-1 flex flex-col p-2 sm:p-4 bg-slate-950">
        <PdfViewerClient pdfUrl={pdfUrl} title={note.title} />
      </div>

      {/* Footer Info Banner */}
      <div className="bg-[#081f14] border-t border-[#144229] px-4 py-2 text-xs text-slate-400 flex flex-wrap items-center justify-between">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-slate-300">District Computer Centre Tinsukia · Official Verified Note</span>
        </div>
        <div className="text-[11px] text-emerald-300">
          Published by {note.uploadedBy.name} on{" "}
          {new Date(note.publicationDate).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>
      </div>
    </div>
  );
}

