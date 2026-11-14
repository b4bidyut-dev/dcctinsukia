import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import { ArrowLeft, Users, Shield } from "lucide-react";
import UsersManagementTable from "./UsersManagementTable";

export default async function AdminUsersPage() {
  const currentAdmin = await getCurrentUser();
  if (!currentAdmin || currentAdmin.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      studentId: true,
      role: true,
      status: true,
      createdAt: true,
      lastLoginAt: true,
      _count: {
        select: {
          downloadLogs: true,
          uploadedNotes: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-950 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Admin Dashboard
        </Link>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-purple-50 text-purple-700 text-xs font-bold mb-2">
                <Users className="w-3.5 h-3.5" />
                Access Control & Accounts
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                User Management
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Manage registered student credentials, active/deactivated statuses, and role privileges.
              </p>
            </div>
          </div>

          <UsersManagementTable initialUsers={users} currentAdminId={currentAdmin.id} />
        </div>
      </div>
    </div>
  );
}

