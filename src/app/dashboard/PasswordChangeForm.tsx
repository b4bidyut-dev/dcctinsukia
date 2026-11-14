"use client";

import { useState } from "react";
import { Lock, CheckCircle2, AlertCircle } from "lucide-react";

export default function PasswordChangeForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "New password must be at least 6 characters" });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Failed to update password." });
        setLoading(false);
        return;
      }

      if (data.vaultToken) {
        try {
          const email = localStorage.getItem("dcc_last_registered_email");
          if (email) localStorage.setItem("dcc_vault_" + email, data.vaultToken);
        } catch {
          // Non-fatal
        }
      }

      setMessage({ type: "success", text: "Password changed successfully!" });
      setCurrentPassword("");
      setNewPassword("");
    } catch {
      setMessage({ type: "error", text: "An error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {message && (
        <div
          className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <div>
        <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-1">
          Current Password <span className="text-red-600">*</span>
        </label>
        <input
          type="password"
          required
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full px-3.5 py-2 text-base sm:text-xs text-slate-900 font-semibold bg-white border-2 border-slate-300 rounded-lg placeholder:text-slate-400 placeholder:font-normal focus:bg-white focus:border-blue-900 focus:ring-2 focus:ring-yellow-400/30 outline-none transition-colors"
        />
      </div>

      <div>
        <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-1">
          New Password (min 6 chars) <span className="text-red-600">*</span>
        </label>
        <input
          type="password"
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full px-3.5 py-2 text-base sm:text-xs text-slate-900 font-semibold bg-white border-2 border-slate-300 rounded-lg placeholder:text-slate-400 placeholder:font-normal focus:bg-white focus:border-blue-900 focus:ring-2 focus:ring-yellow-400/30 outline-none transition-colors"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-extrabold rounded-lg text-xs transition-colors disabled:opacity-60 shadow-sm"
      >
        {loading ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
}

