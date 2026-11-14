"use client";

import { useState } from "react";
import {
  Search,
  Shield,
  User,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Download,
} from "lucide-react";

interface UserItem {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  studentId: string | null;
  role: string;
  status: string;
  createdAt: Date | string;
  lastLoginAt: Date | string | null;
  _count: {
    downloadLogs: number;
    uploadedNotes: number;
  };
}

export default function UsersManagementTable({
  initialUsers,
  currentAdminId,
}: {
  initialUsers: any[];
  currentAdminId: string;
}) {
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [actionError, setActionError] = useState("");

  const handleToggleStatus = async (user: UserItem) => {
    setActionError("");
    const newStatus = user.status === "ACTIVE" ? "DEACTIVATED" : "ACTIVE";

    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) {
        setActionError(data.error || "Failed to update user status");
        return;
      }

      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
      );
    } catch {
      setActionError("Network error while updating user");
    }
  };

  const handleToggleRole = async (user: UserItem) => {
    setActionError("");
    const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";

    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await res.json();
      if (!res.ok) {
        setActionError(data.error || "Failed to update role");
        return;
      }

      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u))
      );
    } catch {
      setActionError("Network error while updating role");
    }
  };

  const filtered = users.filter((u) => {
    const matchesSearch =
      search === "" ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.studentId && u.studentId.toLowerCase().includes(search.toLowerCase()));

    const matchesRole = roleFilter === "" || u.role === roleFilter;
    const matchesStatus = statusFilter === "" || u.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {actionError && (
        <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, student ID..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none"
          />
        </div>

        <div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none"
          >
            <option value="">All Roles</option>
            <option value="USER">Student (USER)</option>
            <option value="ADMIN">Administrator (ADMIN)</option>
          </select>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active Accounts</option>
            <option value="DEACTIVATED">Deactivated Accounts</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
          <thead className="bg-slate-100/80 font-bold text-slate-700 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3">Student / User</th>
              <th className="px-4 py-3">Roll / Student ID</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Activity</th>
              <th className="px-4 py-3 text-right">Account Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  No accounts found matching your filters.
                </td>
              </tr>
            ) : (
              filtered.map((u) => {
                const isSelf = u.id === currentAdminId;
                return (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        {u.name}
                        {isSelf && (
                          <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-semibold">
                            You
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500">{u.email}</div>
                      {u.phone && (
                        <div className="text-[10px] text-slate-400 font-mono">{u.phone}</div>
                      )}
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap font-mono text-[11px] text-slate-700">
                      {u.studentId || "—"}
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold ${
                          u.role === "ADMIN"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-50 text-blue-800"
                        }`}
                      >
                        {u.role === "ADMIN" && <Shield className="w-3 h-3" />}
                        {u.role}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          u.status === "ACTIVE"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {u.status === "ACTIVE" ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        {u.status}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap text-[11px] text-slate-500">
                      <div>Downloads: {u._count.downloadLogs}</div>
                      <div className="text-[10px] text-slate-400">
                        {u.lastLoginAt
                          ? `Last: ${new Date(u.lastLoginAt).toLocaleDateString("en-IN")}`
                          : "Never logged in"}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap text-right space-x-2">
                      {!isSelf && (
                        <>
                          <button
                            onClick={() => handleToggleRole(u)}
                            className="px-2.5 py-1 text-[11px] font-medium rounded border border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors"
                            title="Promote or Demote role"
                          >
                            {u.role === "ADMIN" ? "Make Student" : "Grant Admin"}
                          </button>

                          <button
                            onClick={() => handleToggleStatus(u)}
                            className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors ${
                              u.status === "ACTIVE"
                                ? "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                                : "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
                            }`}
                          >
                            {u.status === "ACTIVE" ? "Deactivate" : "Activate"}
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

