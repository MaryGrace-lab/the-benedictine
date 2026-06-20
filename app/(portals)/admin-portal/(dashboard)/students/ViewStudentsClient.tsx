"use client";

// ──────────────────────────────────────────────
// View Students Client — Client Component
// Handles filters, search, modals, and UI.
// Receives students as props from server.
// Clicking a student name opens their profile.
// ──────────────────────────────────────────────

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import LogoutButton from "@/components/ui/LogoutButton";
import DeleteConfirmModal from "@/components/ui/DeleteConfirmModal";
import EditStudentModal from "@/components/ui/EditStudentModal";
import PasswordRevealModal from "@/components/ui/PasswordRevealModal";

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
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [classes, setClasses] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null);
  const [editTarget, setEditTarget] = useState<Student | null>(null);
  const [passwordTarget, setPasswordTarget] = useState<{ studentId: string; name: string } | null>(null);

  // Extract unique classes on mount
  useEffect(() => {
    const uniqueClasses = [...new Set(initialStudents.map((s) => s.class))].sort();
    setClasses(uniqueClasses);
  }, [initialStudents]);

  // Fetch filtered students when class changes
  useEffect(() => {
    if (!selectedClass) {
      setStudents(initialStudents);
      return;
    }
    fetchStudents();
  }, [selectedClass]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const url = selectedClass
        ? `/api/students?class=${encodeURIComponent(selectedClass)}`
        : "/api/students";
      const res = await fetch(url);
      const data = await res.json();
      if (data.students) setStudents(data.students);
    } catch {
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleted = () => {
    toast.success("Student deleted successfully");
    fetchStudents();
  };

  // Filter by search query
  const filteredStudents = students.filter((s) => {
    if (!search) return true;
    const query = search.toLowerCase();
    return (
      s.firstName.toLowerCase().includes(query) ||
      s.lastName.toLowerCase().includes(query) ||
      s.studentId.toLowerCase().includes(query)
    );
  });

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
          onUpdated={fetchStudents}
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">View Students</h1>
            <p className="text-sm text-slate-500 mt-1">
              {filteredStudents.length} student{filteredStudents.length !== 1 ? "s" : ""} found
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/admin-portal/students/create")}
              className="px-4 py-2 bg-[#270f01] text-white rounded-lg text-sm font-medium hover:bg-[#3d1902] transition-all"
            >
              + Create Student
            </button>
            <LogoutButton type="admin" />
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl border shadow-sm mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="class-filter" className="block text-xs font-medium text-slate-600 mb-1">
                Filter by Class
              </label>
              <select
                id="class-filter" aria-label="Filter by Class"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border rounded-lg text-sm"
              >
                <option value="">All Classes</option>
                {classes.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="search" className="block text-xs font-medium text-slate-600 mb-1">
                Search by Name or Card ID
              </label>
              <input
                id="search" type="text" value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                aria-label="Search students by name or card ID"
                className="w-full p-2.5 bg-slate-50 border rounded-lg text-sm"
              />
            </div>
          </div>
        </div>

        {/* Students Table */}
        {loading ? (
          <div className="bg-white rounded-xl border shadow-sm p-10 text-center">
            <p className="text-slate-500 animate-pulse">Loading students...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="bg-white rounded-xl border shadow-sm p-10 text-center">
            <p className="text-slate-500">No students found.</p>
            <button
              onClick={() => router.push("/admin-portal/students/create")}
              className="mt-4 px-4 py-2 bg-[#270f01] text-white rounded-lg text-sm hover:bg-[#3d1902] transition-all"
            >
              Create First Student
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm" aria-label="Students List">
                <thead>
                  <tr className="bg-slate-50 text-xs font-semibold text-slate-500 border-b">
                    <th className="p-3 text-left">Card ID</th>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Class</th>
                    <th className="p-3 text-left hidden md:table-cell">Guardian</th>
                    <th className="p-3 text-left hidden md:table-cell">Phone</th>
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
                      {/* Clickable name → Profile page */}
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
                      <td className="p-3 text-slate-600 hidden md:table-cell">
                        {student.guardianName || "—"}
                      </td>
                      <td className="p-3 text-slate-600 hidden md:table-cell">
                        {student.guardianPhone || "—"}
                      </td>
                      <td className="p-3 text-slate-500 text-xs hidden lg:table-cell">
                        {new Date(student.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center gap-2 justify-center">
                          <button
                            onClick={() =>
                              setPasswordTarget({
                                studentId: student.studentId,
                                name: `${student.firstName} ${student.lastName}`,
                              })
                            }
                            className="px-3 py-1.5 bg-amber-50 text-amber-600 rounded-lg text-xs font-semibold hover:bg-amber-100 transition-all"
                            title="View Password"
                            aria-label={`View password for ${student.firstName} ${student.lastName}`}
                          >
                            🔑
                          </button>
                          <button
                            onClick={() => setEditTarget(student)}
                            className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold hover:bg-blue-100 transition-all"
                            aria-label={`Edit ${student.firstName} ${student.lastName}`}
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => setDeleteTarget(student)}
                            className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-100 transition-all"
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

        <button
          onClick={() => router.push("/admin-portal/dashboard")}
          className="w-full mt-4 py-3 text-slate-600 hover:text-slate-800 font-medium text-sm"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}