import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import { ArrowLeft, BookOpen, Upload } from "lucide-react";
import NotesManagementTable from "./NotesManagementTable";

export default async function AdminManageNotesPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const [notes, categories] = await Promise.all([
    prisma.note.findMany({
      where: { isDeleted: false },
      include: {
        category: true,
        uploadedBy: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-950 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Admin Dashboard
          </Link>

          <Link
            href="/admin/upload"
            className="self-start sm:self-auto px-4 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-extrabold text-xs shadow-sm transition-all flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload New Note
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Manage Repository Documents
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Edit metadata, toggle publication visibility, test viewing, or archive outdated syllabus documents.
            </p>
          </div>

          <NotesManagementTable initialNotes={notes} categories={categories} />
        </div>
      </div>
    </div>
  );
}

