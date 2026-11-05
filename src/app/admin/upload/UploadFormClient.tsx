"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowRight,
  Eye,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface UploadFormClientProps {
  categories: Category[];
}

export default function UploadFormClient({ categories }: UploadFormClientProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [course, setCourse] = useState("DCA");
  const [topic, setTopic] = useState("");
  const [academicSession, setAcademicSession] = useState("2025-2026");
  const [language, setLanguage] = useState("English");
  const [status, setStatus] = useState("PUBLISHED");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successNoteId, setSuccessNoteId] = useState<string | null>(null);

  // Validate PDF magic bytes on client
  const handleFileSelect = (selectedFile: File) => {
    setError("");

    if (selectedFile.size > 25 * 1024 * 1024) {
      setError("File exceeds the maximum permitted size of 25 MB.");
      setFile(null);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = (e) => {
      const arr = new Uint8Array(e.target?.result as ArrayBuffer).subarray(0, 5);
      let header = "";
      for (let i = 0; i < arr.length; i++) {
        header += String.fromCharCode(arr[i]);
      }

      if (header !== "%PDF-") {
        setError("Invalid file format. The selected file does not appear to be a genuine PDF document.");
        setFile(null);
        return;
      }

      setFile(selectedFile);
      if (!title) {
        // Auto populate title from file name
        const cleanName = selectedFile.name
          .replace(/\.pdf$/i, "")
          .replace(/[_-]/g, " ");
        setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }
    };
    reader.readAsArrayBuffer(selectedFile.slice(0, 5));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!file) {
      setError("Please select a valid PDF file to upload.");
      return;
    }

    if (!title.trim()) {
      setError("Note title is required.");
      return;
    }

    if (!categoryId) {
      setError("Please select a subject category.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("categoryId", categoryId);
      formData.append("course", course.trim());
      formData.append("topic", topic.trim());
      formData.append("academicSession", academicSession.trim());
      formData.append("language", language);
      formData.append("status", status);

      const res = await fetch("/api/admin/notes/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Upload failed. Please try again.");
        setLoading(false);
        return;
      }

      setSuccessNoteId(data.note.id);
      setLoading(false);
    } catch {
      setError("An unexpected network error occurred while uploading. Please try again.");
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setTitle("");
    setDescription("");
    setTopic("");
    setSuccessNoteId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (successNoteId) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center space-y-4">
        <div className="w-14 h-14 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-green-900">
          Note Uploaded & Published Successfully!
        </h3>
        <p className="text-xs text-green-700 max-w-md mx-auto">
          The document has been securely stored and registered in the DCC Tinsukia notes portal.
        </p>
        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <Link
            href={`/notes/${successNoteId}/view`}
            className="px-4 py-2 bg-[#0b291a] text-amber-300 text-xs font-bold rounded-lg hover:bg-emerald-950 flex items-center gap-1.5 shadow border border-emerald-900"
          >
            <Eye className="w-4 h-4 text-amber-400" />
            View Document Online
          </Link>
          <button
            onClick={resetForm}
            className="px-4 py-2 bg-white text-slate-800 border border-slate-300 text-xs font-semibold rounded-lg hover:bg-slate-100"
          >
            Upload Another Note
          </button>
          <Link
            href="/admin"
            className="px-4 py-2 bg-amber-500 text-slate-950 text-xs font-bold rounded-lg hover:bg-amber-400"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* PDF File Drag and Drop Selector */}
      <div>
        <label className="block text-xs font-bold text-slate-800 mb-2">
          PDF Document File *
        </label>
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${file
            ? "border-green-400 bg-green-50/50"
            : "border-slate-300 hover:border-amber-500 bg-slate-50/60"
            }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,.pdf"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            className="hidden"
          />

          {file ? (
            <div className="flex items-center justify-center gap-3">
              <FileText className="w-8 h-8 text-green-600" />
              <div className="text-left">
                <div className="text-sm font-bold text-slate-900">{file.name}</div>
                <div className="text-xs text-slate-500">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB · Valid PDF document
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
                className="p-1 rounded-full text-slate-400 hover:text-red-500 ml-4"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center mx-auto">
                <Upload className="w-6 h-6" />
              </div>
              <div className="text-sm font-semibold text-slate-700">
                Click to browse or drag and drop your PDF here
              </div>
              <div className="text-xs text-slate-400">
                Supports PDF format only (Maximum file size: 25 MB)
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="block text-xs font-bold text-slate-800 mb-1.5">
          Note Title *
        </label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Computer Fundamentals - Chapter 1: Introduction to Computing"
          className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 outline-none"
        />
      </div>

      {/* Subject Category and Course */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">
            Subject / Category *
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 outline-none"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">
            Course Curriculum
          </label>
          <select
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 outline-none"
          >
            <option value="DCA">DCA (Diploma in Computer Application)</option>
            <option value="PGDCSA">PGDCSA (Post Graduate Diploma in Computer Software Applications)</option>
            <option value="ADCA">ADCA (Advanced Diploma in Computer Applications)</option>
            <option value="DOA & FA">DOA & FA (Diploma in Office Automation & Financial Accounting)</option>
            <option value="DIA">DIA (Diploma in Industrial Accounting)</option>
            <option value="FA">FA (Financial Accounting - Tally Prime)</option>
            <option value="CCC">CCC (Course on Computer Concepts)</option>
            <option value="Assam IT Exam Preparation">Assam IT Exam Preparation</option>
            <option value="General IT Studies">General IT Studies</option>
          </select>
        </div>
      </div>

      {/* Topic and Academic Session */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">
            Topic or Chapter
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Unit 2: Storage Devices & Hierarchy"
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">
            Academic Session
          </label>
          <input
            type="text"
            value={academicSession}
            onChange={(e) => setAcademicSession(e.target.value)}
            placeholder="2025-2026"
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 outline-none"
          />
        </div>
      </div>

      {/* Description / Summary */}
      <div>
        <label className="block text-xs font-bold text-slate-800 mb-1.5">
          Description / Summary
        </label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description of topics covered, lab practice questions, and chapter summary..."
          className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 outline-none"
        />
      </div>

      {/* Status & Language */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">
            Publication Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 outline-none"
          >
            <option value="PUBLISHED">Published (Visible in student library)</option>
            <option value="DRAFT">Draft (Admin only, not visible to students)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">
            Instruction Language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 outline-none"
          >
            <option value="English">English</option>
            <option value="Assamese">Assamese (অসমীয়া)</option>
            <option value="Hindi">Hindi</option>
            <option value="Bilingual">Bilingual</option>
          </select>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-6 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {loading ? "Validating & Uploading..." : "Upload & Save Document"}
        {!loading && <ArrowRight className="w-4 h-4" />}
      </button>
    </form>
  );
}

