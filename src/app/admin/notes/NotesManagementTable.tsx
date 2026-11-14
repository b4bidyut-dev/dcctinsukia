"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Eye,
  Edit2,
  Trash2,
  Download,
  Check,
  X,
  AlertCircle,
  CheckCircle2,
  FileText,
} from "lucide-react";

interface NoteItem {
  id: string;
  title: string;
  description: string | null;
  categoryId: string;
  category: { id: string; name: string };
  course: string | null;
  topic: string | null;
  academicSession: string | null;
  language: string;
  storedFileName: string;
  originalFileName: string;
  fileSize: number;
  status: string;
  publicationDate: Date | string;
  downloadCount: number;
  viewCount: number;
  uploadedBy: { name: string; email: string };
}

interface Category {
  id: string;
  name: string;
}

export default function NotesManagementTable({
  initialNotes,
  categories,
}: {
  initialNotes: any[];
  categories: Category[];
}) {
  const [notes, setNotes] = useState<NoteItem[]>(initialNotes);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Edit Modal State
  const [editingNote, setEditingNote] = useState<NoteItem | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  // Delete State
  const [deleteNoteId, setDeleteNoteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Status Toggle
  const handleToggleStatus = async (note: NoteItem) => {
    const newStatus = note.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    try {
      const res = await fetch(`/api/admin/notes/${note.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setNotes((prev) =>
          prev.map((n) => (n.id === note.id ? { ...n, status: newStatus } : n))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Note
  const handleDeleteConfirm = async () => {
    if (!deleteNoteId) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/admin/notes/${deleteNoteId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setNotes((prev) => prev.filter((n) => n.id !== deleteNoteId));
        setDeleteNoteId(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Save Edit
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNote) return;
    setEditLoading(true);
    setEditError("");

    try {
      const res = await fetch(`/api/admin/notes/${editingNote.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editingNote.title,
          description: editingNote.description,
          categoryId: editingNote.categoryId,
          course: editingNote.course,
          topic: editingNote.topic,
          academicSession: editingNote.academicSession,
          language: editingNote.language,
          status: editingNote.status,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setEditError(data.error || "Failed to update note");
        setEditLoading(false);
        return;
      }

      // Update local state with updated category
      const targetCat = categories.find((c) => c.id === editingNote.categoryId);
      setNotes((prev) =>
        prev.map((n) =>
          n.id === editingNote.id
            ? {
                ...n,
                ...editingNote,
                category: targetCat || n.category,
              }
            : n
        )
      );
      setEditingNote(null);
    } catch {
      setEditError("Network error while updating.");
    } finally {
      setEditLoading(false);
    }
  };

  // Filter logic
  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      search === "" ||
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      (n.topic && n.topic.toLowerCase().includes(search.toLowerCase())) ||
      (n.course && n.course.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory =
      categoryFilter === "" || n.categoryId === categoryFilter;

    const matchesStatus = statusFilter === "" || n.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, topic, course..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none"
          />
        </div>

        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none"
          >
            <option value="">All Categories / Subjects</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none"
          >
            <option value="">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
          <thead className="bg-slate-100/80 font-bold text-slate-700 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3">Document Title & Topic</th>
              <th className="px-4 py-3">Subject / Course</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Size & DLs</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {filteredNotes.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  No notes match your filters.
                </td>
              </tr>
            ) : (
              filteredNotes.map((note) => (
                <tr key={note.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-4 py-3.5 max-w-xs">
                    <div className="font-bold text-slate-900 line-clamp-1">{note.title}</div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">
                      {note.topic || "General"}
                    </div>
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="inline-block px-2 py-0.5 rounded font-medium bg-blue-50 text-blue-900 border border-blue-200 text-[11px]">
                      {note.category.name}
                    </span>
                    {note.course && (
                      <div className="text-[11px] text-slate-500 mt-0.5">{note.course}</div>
                    )}
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleStatus(note)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                        note.status === "PUBLISHED"
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                      }`}
                      title="Click to toggle publish/draft"
                    >
                      {note.status === "PUBLISHED" ? (
                        <>
                          <Check className="w-3 h-3" />
                          Published
                        </>
                      ) : (
                        <>
                          <X className="w-3 h-3" />
                          Draft
                        </>
                      )}
                    </button>
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap font-mono text-[11px] text-slate-600">
                    <div>{(note.fileSize / 1024).toFixed(1)} KB</div>
                    <div className="text-slate-400">{note.downloadCount} downloads</div>
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap text-right space-x-2">
                    <Link
                      href={`/notes/${note.id}/view`}
                      className="p-1.5 rounded hover:bg-slate-100 text-slate-600 hover:text-blue-900 inline-block"
                      title="View PDF Online"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={() => setEditingNote(note)}
                      className="p-1.5 rounded hover:bg-amber-50 text-slate-600 hover:text-amber-700 inline-block"
                      title="Edit Metadata"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setDeleteNoteId(note.id)}
                      className="p-1.5 rounded hover:bg-red-50 text-slate-600 hover:text-red-700 inline-block"
                      title="Delete Note"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingNote && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                Edit Note Information
              </h3>
              <button
                onClick={() => setEditingNote(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editError && (
              <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editingNote.title}
                  onChange={(e) =>
                    setEditingNote({ ...editingNote, title: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={editingNote.categoryId}
                    onChange={(e) =>
                      setEditingNote({ ...editingNote, categoryId: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-900"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={editingNote.status}
                    onChange={(e) =>
                      setEditingNote({ ...editingNote, status: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-900"
                  >
                    <option value="PUBLISHED">Published</option>
                    <option value="DRAFT">Draft</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Course</label>
                  <input
                    type="text"
                    value={editingNote.course || ""}
                    onChange={(e) =>
                      setEditingNote({ ...editingNote, course: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Topic</label>
                  <input
                    type="text"
                    value={editingNote.topic || ""}
                    onChange={(e) =>
                      setEditingNote({ ...editingNote, topic: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingNote.description || ""}
                  onChange={(e) =>
                    setEditingNote({ ...editingNote, description: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingNote(null)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-4 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-extrabold disabled:opacity-60 shadow-sm transition-colors"
                >
                  {editLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteNoteId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="w-12 h-12 bg-red-100 text-red-700 rounded-full flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">Archive Note?</h3>
              <p className="text-xs text-slate-600 mt-1">
                Are you sure you want to remove this note from the active library? It will be marked archived.
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteNoteId(null)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold disabled:opacity-60"
              >
                {deleteLoading ? "Removing..." : "Yes, Archive Note"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

