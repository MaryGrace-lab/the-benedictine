"use client";

// ──────────────────────────────────────────────
// View Students Client — Client Component
// Handles filters, search, modals, and UI.
// All filtering done client-side (data already loaded).
// ──────────────────────────────────────────────

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import DeleteConfirmModal from "@/components/ui/DeleteConfirmModal";
import EditStudentModal from "@/components/ui/EditStudentModal";
import PasswordRevealModal from "@/components/ui/PasswordRevealModal";
import { Search, Filter, UserPlus, ArrowLeft } from "lucide-react";

// ── Types ──
type Student = {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  class: string;
  studentType: string | null;
  guardianName: string | null;
  guardianPhone: string | null;
  createdAt: Date;
};

interface Props {
  initialStudents: Student[];
}

export default function ViewStudentsClient({ initialStudents }: Props) {
  const router = useRouter();
  const [selectedClass, setSelectedClass] = useState("");
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null);
  const [editTarget, setEditTarget] = useState<Student | null>(null);
  const [passwordTarget, setPasswordTarget] = useState<{ studentId: string; name: string } | null>(null);
  const [students, setStudents] = useState<Student[]>(initialStudents);

  // Extract unique classes
  const classes = useMemo(() => {
    return [...new Set(initialStudents.map((s) => s.class))].sort();
  }, [initialStudents]);

  // Filter students client-side (no API calls needed)
  const filteredStudents = useMemo(() => {
    return initialStudents.filter((s) => {
      // Class filter
      if (selectedClass && s.class !== selectedClass) return false;
      
      // Search filter
      if (search) {
        const query = search.toLowerCase();
        return (
          s.firstName.toLowerCase().includes(query) ||
          s.lastName.toLowerCase().includes(query) ||
          s.studentId.toLowerCase().includes(query)
        );
      }
      
      return true;
    });
  }, [initialStudents, selectedClass, search]);

  const handleDeleted = () => {
    toast.success("Student deleted successfully");
    // Remove from local state
    if (deleteTarget) {
      setStudents((prev) => prev.filter((s) => s.id !== deleteTarget.id));
    }
  };

  const handleUpdated = () => {
    toast.success("Student updated successfully");
    // Refresh would require re-fetch, or you can update local state
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <Toaster position="top-center" />

      {/* Modals */}
      {deleteTarget && (
        <DeleteConfirmModal
          isOpen={!!deleteTarget}
          studentName={`${deleteTarget.firstName} ${deleteTarget.lastName}`}
          studentId={deleteTarget.studentId}
          cardId={deleteTarget.studentId}
          onClose={() => setDeleteTarget(null)}
          onDeleted={handleDeleted}
        />
      )}
      {editTarget && (
        <EditStudentModal
          isOpen={!!editTarget}
          student={editTarget}
          onClose={() => setEditTarget(null)}
          onUpdated={handleUpdated}
        />
      )}
      {passwordTarget && (
        <PasswordRevealModal
          isOpen={!!passwordTarget}
          studentId={passwordTarget.studentId}
          studentName={passwordTarget.name}
          onClose={() => setPasswordTarget(null)}
        />
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Students</h1>
            <p className="text-sm text-slate-500 mt-1">
              {filteredStudents.length} student{filteredStudents.length !== 1 ? "s" : ""} found
            </p>
          </div>
          <Link
            href="/admin-portal/students/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#8B5E3C] text-white rounded-lg text-sm font-medium hover:bg-[#6B3F2C] transition-all"
          >
            <UserPlus size={16} />
            Create Student
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="class-filter" className="flex items-center gap-1 text-xs font-medium text-slate-600 mb-1">
                <Filter size={12} /> Filter by Class
              </label>
              <select
                id="class-filter"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#8B5E3C]/20 focus:border-[#8B5E3C] outline-none transition-all"
              >
                <option value="">All Classes</option>
                {classes.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="search" className="flex items-center gap-1 text-xs font-medium text-slate-600 mb-1">
                <Search size={12} /> Search
              </label>
              <input
                id="search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or Card ID..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#8B5E3C]/20 focus:border-[#8B5E3C] outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Students Table */}
        {filteredStudents.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-10 text-center">
            <p className="text-slate-500 mb-4">
              {initialStudents.length === 0 
                ? "No students registered yet." 
                : "No students match your filters."}
            </p>
            {initialStudents.length === 0 && (
              <Link
                href="/admin-portal/students/create"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#8B5E3C] text-white rounded-lg text-sm hover:bg-[#6B3F2C] transition-all"
              >
                <UserPlus size={16} />
                Create First Student
              </Link>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50 text-xs font-semibold text-slate-500 border-b border-slate-200">
                    <th className="p-3 text-left">Card ID</th>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Class</th>
                    <th className="p-3 text-left hidden md:table-cell">Type</th>
                    <th className="p-3 text-left hidden md:table-cell">Guardian</th>
                    <th className="p-3 text-left hidden lg:table-cell">Phone</th>
                    <th className="p-3 text-left hidden lg:table-cell">Created</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3 font-mono text-xs font-medium text-slate-700">
                        {student.studentId}
                      </td>
                      <td className="p-3 font-medium">
                        <Link
                          href={`/admin-portal/students/${student.studentId}`}
                          className="text-[#8B5E3C] hover:text-[#3D1902] hover:underline font-bold"
                        >
                          {student.lastName} {student.firstName}
                        </Link>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                          {student.class}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600 hidden md:table-cell text-xs">
                        {student.studentType || "—"}
                      </td>
                      <td className="p-3 text-slate-600 hidden md:table-cell">
                        {student.guardianName || "—"}
                      </td>
                      <td className="p-3 text-slate-500 hidden lg:table-cell text-xs">
                        {student.guardianPhone || "—"}
                      </td>
                      <td className="p-3 text-slate-500 text-xs hidden lg:table-cell">
                        {new Date(student.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1 justify-center">
                          <button
                            onClick={() =>
                              setPasswordTarget({
                                studentId: student.studentId,
                                name: `${student.firstName} ${student.lastName}`,
                              })
                            }
                            className="p-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-all"
                            title="View Password"
                            aria-label={`View password for ${student.firstName} ${student.lastName}`}
                          >
                            🔑
                          </button>
                          <button
                            onClick={() => setEditTarget(student)}
                            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all"
                            aria-label={`Edit ${student.firstName} ${student.lastName}`}
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => setDeleteTarget(student)}
                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all"
                            aria-label={`Delete ${student.firstName} ${student.lastName}`}
                          >
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <Link
          href="/admin-portal/dashboard"
          className="inline-flex items-center gap-1 mt-4 py-3 text-sm font-medium text-[#8B5E3C] hover:text-[#3D1902] transition-colors"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>
    </div>
  );
}