import Link from "next/link";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import {
  BookOpen,
  Download,
  Eye,
  FileText,
  Filter,
  Search,
  Calendar,
  Layers,
  GraduationCap,
  Sparkles,
  ArrowUpDown,
} from "lucide-react";

interface LibraryProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    course?: string;
    sort?: string;
  }>;
}

export default async function NotesLibraryPage({ searchParams }: LibraryProps) {
  const user = await getCurrentUser();
  const params = await searchParams;
  const q = params.q?.trim() || "";
  const selectedCategory = params.category || "";
  const selectedCourse = params.course || "";
  const sortBy = params.sort || "newest";

  // Build filter conditions
  const where: any = {
    status: "PUBLISHED",
    isDeleted: false,
  };

  if (q) {
    where.OR = [
      { title: { contains: q } },
      { description: { contains: q } },
      { topic: { contains: q } },
      { course: { contains: q } },
    ];
  }

  if (selectedCategory) {
    where.categoryId = selectedCategory;
  }

  if (selectedCourse) {
    where.course = { contains: selectedCourse };
  }

  // Sorting
  let orderBy: any = { publicationDate: "desc" };
  if (sortBy === "oldest") orderBy = { publicationDate: "asc" };
  if (sortBy === "downloads") orderBy = { downloadCount: "desc" };
  if (sortBy === "title") orderBy = { title: "asc" };

  const [notes, categories, distinctCourses] = await Promise.all([
    prisma.note.findMany({
      where,
      include: {
        category: true,
        uploadedBy: { select: { name: true } },
      },
      orderBy,
    }),
    prisma.category.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { notes: { where: { status: "PUBLISHED", isDeleted: false } } },
        },
      },
      orderBy: { name: "asc" },
    }),
    prisma.note.findMany({
      where: { status: "PUBLISHED", isDeleted: false, course: { not: null } },
      select: { course: true },
      distinct: ["course"],
    }),
  ]);

  const courses = Array.from(
    new Set(distinctCourses.map((c) => c.course).filter(Boolean))
  ) as string[];

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0b291a] to-[#144229] text-white rounded-2xl p-6 sm:p-8 shadow-lg border border-[#1d5c39]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                <BookOpen className="w-3.5 h-3.5" />
                Verified Study Library · AMTRON Recognized
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                District Computer Centre Notes Library
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl">
                Official computer science modules, DCA, PGDCSA, DOA &amp; FA notes, lab workbooks, and examination revision sets.
              </p>
            </div>

            {user?.role === "ADMIN" && (
              <Link
                href="/admin/upload"
                className="self-start md:self-auto px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-2"
              >
                + Upload New Note
              </Link>
            )}
          </div>
        </div>

        {/* Search & Filter Controls */}
        <form
          method="GET"
          action="/library"
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
        >
          {/* Search Bar */}
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500 pointer-events-none" />
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Search notes by title, topic, or keyword..."
              className="w-full pl-10 pr-3 py-2 text-base sm:text-sm text-slate-900 font-semibold bg-white border-2 border-slate-300 rounded-lg placeholder:text-slate-400 placeholder:font-normal focus:bg-white focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 outline-none"
            />
          </div>

          {/* Subject / Category Filter */}
          <div className="md:col-span-3">
            <select
              name="category"
              defaultValue={selectedCategory}
              className="w-full px-3 py-2 text-base sm:text-sm text-slate-900 font-semibold bg-white border-2 border-slate-300 rounded-lg focus:bg-white focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 outline-none"
            >
              <option value="">All Subjects / Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} ({cat._count.notes})
                </option>
              ))}
            </select>
          </div>

          {/* Course Filter */}
          <div className="md:col-span-2">
            <select
              name="course"
              defaultValue={selectedCourse}
              className="w-full px-3 py-2 text-base sm:text-sm text-slate-900 font-semibold bg-white border-2 border-slate-300 rounded-lg focus:bg-white focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 outline-none"
            >
              <option value="">All Courses</option>
              {courses.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="md:col-span-2">
            <select
              name="sort"
              defaultValue={sortBy}
              className="w-full px-3 py-2 text-base sm:text-sm text-slate-900 font-semibold bg-white border-2 border-slate-300 rounded-lg focus:bg-white focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 outline-none"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="downloads">Sort: Most Downloaded</option>
              <option value="title">Sort: Alphabetical (A-Z)</option>
              <option value="oldest">Sort: Oldest First</option>
            </select>
          </div>

          {/* Submit / Reset */}
          <div className="md:col-span-1 flex gap-2">
            <button
              type="submit"
              className="w-full py-2 bg-[#0b291a] hover:bg-[#071f13] text-amber-300 font-bold text-xs rounded-lg transition-colors border border-amber-500/30"
            >
              Filter
            </button>
          </div>
        </form>

        {/* Results Info */}
        <div className="flex justify-between items-center text-xs text-slate-500 px-1">
          <div>
            Showing <span className="font-semibold text-slate-800">{notes.length}</span>{" "}
            {notes.length === 1 ? "note" : "notes"} available
            {(q || selectedCategory || selectedCourse) && " matching your criteria"}
          </div>
          {(q || selectedCategory || selectedCourse || sortBy !== "newest") && (
            <Link href="/library" className="text-amber-600 hover:underline font-medium">
              Clear all filters
            </Link>
          )}
        </div>

        {/* Notes Grid */}
        {notes.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-sm space-y-4">
            <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto">
              <BookOpen className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No notes found</h3>
            <p className="text-xs text-slate-600">
              {q || selectedCategory || selectedCourse
                ? "No notes matched your specific search filters. Try adjusting your search query or selecting a different subject."
                : "No notes are available at this time. Please check back later."}
            </p>
            <Link
              href="/library"
              className="inline-block px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-lg transition-colors"
            >
              Reset Filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <div
                key={note.id}
                className="bg-white rounded-xl border border-slate-200 hover:border-amber-400 shadow-sm hover:shadow-md transition-all flex flex-col p-6 group"
              >
                {/* Subject Badge & Date */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-200">
                    {note.category.name}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                    <Calendar className="w-3 h-3 text-amber-500" />
                    {new Date(note.publicationDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-base font-bold text-slate-900 group-hover:text-emerald-900 transition-colors line-clamp-2 mb-2">
                  {note.title}
                </h2>

                {/* Description */}
                <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed flex-1">
                  {note.description || "Official study note provided for District Computer Centre Tinsukia students."}
                </p>

                {/* Course & Topic tags */}
                <div className="space-y-1.5 mb-4 text-xs text-slate-500">
                  {note.course && (
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="font-semibold text-slate-700">Course:</span>
                      <span className="text-slate-800 font-medium truncate">{note.course}</span>
                    </div>
                  )}
                  {note.topic && (
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span className="font-semibold text-slate-700">Topic:</span>
                      <span className="text-slate-800 font-medium truncate">{note.topic}</span>
                    </div>
                  )}
                </div>

                {/* Footer Info & Actions */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[11px] text-slate-500 font-mono">
                    {(note.fileSize / 1024).toFixed(1)} KB · {note.downloadCount} DLs
                  </div>

                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/notes/${note.id}/view`}
                      className="px-3 py-1.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs border border-emerald-200 transition-colors flex items-center gap-1"
                      title="Open online viewer"
                    >
                      <Eye className="w-3.5 h-3.5 text-emerald-700" />
                      View
                    </Link>

                    <a
                      href={`/api/notes/${note.id}/download`}
                      download
                      className="px-3 py-1.5 rounded bg-[#0b291a] hover:bg-emerald-950 text-white font-bold text-xs shadow-sm transition-colors flex items-center gap-1 border border-[#144229]"
                      title="Download PDF file"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-400" />
                      Download
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

