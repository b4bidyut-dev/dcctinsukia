import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import { ArrowLeft, Upload, FileText, Shield } from "lucide-react";
import UploadFormClient from "./UploadFormClient";

export default async function AdminUploadPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-950 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Admin Dashboard
        </Link>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-5">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-amber-500/10 text-amber-700 text-xs font-bold mb-2">
              <Upload className="w-3.5 h-3.5" />
              Administrator Upload Portal
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              Upload Official PDF Note
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Add new verified study materials to the District Computer Centre Tinsukia repository. Only valid PDF files up to 25 MB are accepted.
            </p>
          </div>

          <UploadFormClient categories={categories} />
        </div>
      </div>
    </div>
  );
}

