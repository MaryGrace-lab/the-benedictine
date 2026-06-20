"use client";

// ──────────────────────────────────────────────
// Manage Sessions Client — Client Component
// Handles create, delete, and list UI.
// Receives sessions as props from server.
// ──────────────────────────────────────────────

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import LogoutButton from "@/components/ui/LogoutButton";
import DeleteConfirmModal from "@/components/ui/DeleteConfirmModal";

// ── Types ──
type Session = {
  id: string;
  year: string;
  term: string;
  isActive: boolean;
  createdAt: Date;
  _count: { results: number };
};

interface Props {
  initialSessions: Session[];
}

export default function ManageSessionsClient({ initialSessions }: Props) {
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>(initialSessions);
  const [loading, setLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Session | null>(null);

  // Create form
  const [year, setYear] = useState("2025/2026");
  const [term, setTerm] = useState("FIRST");
  const [isActive, setIsActive] = useState(false);
  const [creating, setCreating] = useState(false);

  // Refresh sessions from server
  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/sessions?withCounts=true");
      const data = await res.json();
      setSessions(data.sessions || []);
    } catch {
      toast.error("Failed to load sessions");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const res = await fetch("/api/sessions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year, term, isActive }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(`Session created: ${year} - ${term}`);
        setYear("2025/2026");
        setTerm("FIRST");
        setIsActive(false);
        fetchSessions();
      } else {
        toast.error(data.error || "Failed to create session");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleted = () => {
    toast.success("Session deleted successfully");
    fetchSessions();
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] p-4 md:p-6">
      <Toaster position="top-center" />

      {/* Delete Modal */}
      {deleteTarget && (
        <DeleteConfirmModal
          isOpen={!!deleteTarget}
          type="session"
          studentName={`${deleteTarget.year} - ${deleteTarget.term} Term`}
          studentId={deleteTarget.id}
          cardId={`${deleteTarget.year} / ${deleteTarget.term}`}
          onClose={() => setDeleteTarget(null)}
          onDeleted={handleDeleted}
        />
      )}

      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#3D1902]">📅 Manage Sessions</h1>
          <LogoutButton type="admin" />
        </div>

        {/* Create Session Form */}
        <div className="bg-white p-6 rounded-2xl border border-[#8B5E3C]/10 shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-[#3D1902] mb-4">Add New Session</h2>
          <form onSubmit={handleCreate} className="grid md:grid-cols-4 gap-4 items-end">
            <div>
              <label htmlFor="year" className="block text-xs font-medium text-[#8B5E3C] mb-1">
                Academic Year *
              </label>
              <input
                id="year" type="text" value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="e.g. 2025/2026"
                className="w-full p-2.5 border rounded-lg text-sm" required
              />
            </div>
            <div>
              <label htmlFor="term" className="block text-xs font-medium text-[#8B5E3C] mb-1">
                Term *
              </label>
              <select
                id="term" value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="w-full p-2.5 border rounded-lg text-sm" required
              >
                <option value="FIRST">First Term</option>
                <option value="SECOND">Second Term</option>
                <option value="THIRD">Third Term</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="isActive" type="checkbox" checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-5 h-5"
              />
              <label htmlFor="isActive" className="text-sm text-[#8B5E3C]">Active</label>
            </div>
            <button
              type="submit" disabled={creating}
              className="py-2.5 bg-[#8B5E3C] text-white rounded-lg font-semibold hover:bg-[#6B3F2C] disabled:opacity-50 transition-all text-sm"
            >
              {creating ? "Adding..." : "+ Add Session"}
            </button>
          </form>
        </div>

        {/* Sessions List */}
        {loading ? (
          <div className="bg-white p-10 rounded-2xl border text-center">
            <p className="text-[#8B5E3C] animate-pulse">Loading sessions...</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl border text-center">
            <p className="text-[#8B5E3C]">No sessions found. Add one above.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#8B5E3C]/10 shadow-sm overflow-hidden">
            <table className="w-full text-sm" aria-label="Sessions List">
              <thead>
                <tr className="bg-[#FAF7F2] text-xs font-semibold text-[#8B5E3C] border-b">
                  <th className="p-3 text-left">Academic Year</th>
                  <th className="p-3 text-left">Term</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-center hidden md:table-cell">Results</th>
                  <th className="p-3 text-left hidden md:table-cell">Created</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#8B5E3C]/5">
                {sessions.map((session) => (
                  <tr key={session.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                    <td className="p-3 font-medium text-[#3D1902]">{session.year}</td>
                    <td className="p-3 text-[#3D1902]">{session.term} Term</td>
                    <td className="p-3 text-center">
                      {session.isActive ? (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Active</span>
                      ) : (
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full text-xs">Inactive</span>
                      )}
                    </td>
                    <td className="p-3 text-center hidden md:table-cell text-[#8B5E3C]">
                      {session._count?.results || 0}
                    </td>
                    <td className="p-3 text-xs text-[#8B5E3C]/60 hidden md:table-cell">
                      {new Date(session.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => setDeleteTarget(session)}
                        className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-100 transition-all"
                        aria-label={`Delete ${session.year} ${session.term}`}
                      >
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button
          onClick={() => router.push("/admin-portal/dashboard")}
          className="w-full mt-4 py-3 text-[#8B5E3C] hover:text-[#3D1902] font-medium text-sm"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}