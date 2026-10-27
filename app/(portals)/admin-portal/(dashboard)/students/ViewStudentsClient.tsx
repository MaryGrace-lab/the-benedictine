"use client";

// ──────────────────────────────────────────────
// View Students Client — Client Component
// Handles filters, search, modals, promotion, and UI.
// All filtering done client-side (data already loaded).
// ──────────────────────────────────────────────

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import DeleteConfirmModal from "@/components/ui/DeleteConfirmModal";
import EditStudentModal from "@/components/ui/EditStudentModal";
import { Search, Filter, UserPlus, ArrowLeft, TrendingUp } from "lucide-react";

// ── Types ──
type Student = {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  class: string;
  gender: string | null;
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
  const [students, setStudents] = useState<Student[]>(initialStudents);

  // ── Promotion state ──
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [targetClass, setTargetClass] = useState("");
  const [promoting, setPromoting] = useState(false);

  // Extract unique classes
  const classes = useMemo(() => {
    return [...new Set(initialStudents.map((s) => s.class))].sort();
  }, [initialStudents]);

  // Filter students client-side
  const filteredStudents = useMemo(() => {
    return initialStudents.filter((s) => {
      if (selectedClass && s.class !== selectedClass) return false;
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

  // Selection logic
  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const toggleAll = () => {
    if (selectedStudents.length === filteredStudents.length && filteredStudents.length > 0) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map((s) => s.studentId));
    }
  };

  const handleDeleted = () => {
    toast.success("Student deleted successfully");
    if (deleteTarget) {
      setStudents((prev) => prev.filter((s) => s.id !== deleteTarget.id));
    }
  };

  const handleUpdated = () => {
    toast.success("Student updated successfully");
    router.refresh();
  };

  const handlePromote = async () => {
    if (!targetClass) return;
    setPromoting(true);
    try {
      const res = await fetch("/api/students/promote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentIds: selectedStudents, targetClass }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setShowPromoteModal(false);
        setSelectedStudents([]);
        // Update local class of promoted students
        setStudents((prev) =>
          prev.map((s) =>
            selectedStudents.includes(s.studentId) ? { ...s, class: targetClass } : s
          )
        );
      } else {
        toast.error(data.error || "Promotion failed");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setPromoting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <Toaster position="top-center" />

      {/* Existing modals */}
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

      {/* Promotion Modal */}
      {showPromoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-xl font-bold text-[#3D1902] mb-4">
              Promote {selectedStudents.length} Student(s)
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              Selected students will be moved to the new class. All results, attendance, and behaviour records will be preserved.
            </p>
            <div className="mb-4">
              <label htmlFor="targetClass" className="block text-sm font-medium text-slate-600 mb-1">
                Target Class *
              </label>
              <select
                id="targetClass"
                value={targetClass}
                onChange={(e) => setTargetClass(e.target.value)}
                className="w-full p-2.5 border rounded-lg text-sm"
              >
                <option value="">Select class</option>
                <option value="JSS 1">JSS 1</option>
                <option value="JSS 2">JSS 2</option>
                <option value="JSS 3">JSS 3</option>
                <option value="SSS 1">SSS 1</option>
                <option value="SSS 2">SSS 2</option>
                <option value="SSS 3">SSS 3</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowPromoteModal(false)}
                className="flex-1 py-2.5 bg-slate-100 rounded-lg font-medium hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handlePromote}
                disabled={!targetClass || promoting}
                className="flex-1 py-2.5 bg-[#8B5E3C] text-white rounded-lg font-semibold hover:bg-[#6B3F2C] disabled:opacity-50"
              >
                {promoting ? "Promoting..." : "Promote"}
              </button>
            </div>
          </div>
        </div>
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

        {/* Promote bar (visible when students selected) */}
        {selectedStudents.length > 0 && (
          <div className="flex items-center justify-between bg-[#8B5E3C]/5 border border-[#8B5E3C]/20 p-3 rounded-xl mb-4">
            <span className="text-sm text-[#8B5E3C] font-medium">
              {selectedStudents.length} student(s) selected
            </span>
            <button
              onClick={() => setShowPromoteModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#8B5E3C] text-white rounded-lg text-sm font-semibold hover:bg-[#6B3F2C] transition-all"
            >
              <TrendingUp size={16} />
              Promote Selected Students
            </button>
          </div>
        )}

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
                    <th className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={
                          selectedStudents.length === filteredStudents.length &&
                          filteredStudents.length > 0
                        }
                        onChange={toggleAll}
                        className="w-4 h-4 accent-[#8B5E3C]"
                        aria-label="Select all students"
                        title="Select all students"
                      />
                    </th>
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
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student.studentId)}
                          onChange={() => toggleStudentSelection(student.studentId)}
                          className="w-4 h-4 accent-[#8B5E3C]"
                          aria-label={`Select ${student.firstName} ${student.lastName}`}
                          title={`Select ${student.firstName} ${student.lastName}`}
                        />
                      </td>
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