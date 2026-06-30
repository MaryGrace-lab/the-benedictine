//components/ui/EditStudentModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

// ── Types ──
type Student = {
  studentId: string;
  firstName: string;
  lastName: string;
  class: string;
  studentType: string | null;
  guardianName: string | null;
  guardianPhone: string | null;
};

type Props = {
  isOpen: boolean;
  student: Student | null;
  onClose: () => void;
  onUpdated: () => void;
};

export default function EditStudentModal({ isOpen, student, onClose, onUpdated }: Props) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    studentId: "",
    studentClass: "",
    studentType: "",
    guardianName: "",
    guardianPhone: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Department is only required for SSS 2 and SSS 3
  const requiresDepartment = form.studentClass === "SSS 2" || form.studentClass === "SSS 3";

  // Populate form when student prop changes
  useEffect(() => {
    if (student) {
      setForm({
        firstName: student.firstName,
        lastName: student.lastName,
        studentId: student.studentId,
        studentClass: student.class,
        studentType: student.studentType || "",
        guardianName: student.guardianName || "",
        guardianPhone: student.guardianPhone || "",
      });
    }
  }, [student]);

  if (!isOpen || !student) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      // Clear department if class is changed to non-SSS 2/3
      if (name === "studentClass" && value !== "SSS 2" && value !== "SSS 3") {
        updated.studentType = "";
      }
      return updated;
    });
    setError("");
  };

  const handleSave = async () => {
    if (!form.firstName || !form.lastName || !form.studentId || !form.studentClass) {
      setError("Please fill all required fields");
      return;
    }

    // Validate department for SSS 2/3
    if (requiresDepartment && !form.studentType) {
      setError("Please select a department for SSS 2/3 students");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/students/edit", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalStudentId: student.studentId,
          firstName: form.firstName,
          lastName: form.lastName,
          studentId: form.studentId,
          studentClass: form.studentClass,
          studentType: form.studentType || null,
          guardianName: form.guardianName || null,
          guardianPhone: form.guardianPhone || null,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Student updated successfully!");
        onUpdated();
        onClose();
      } else {
        setError(data.error || "Failed to update student");
      }
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6">
        <h2 className="text-xl font-bold text-[#3D1902] mb-4">✏️ Edit Student</h2>

        <div className="space-y-3">
          {/* Name Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="edit-firstName" className="block text-xs font-medium text-[#8B5E3C] mb-1">
                First Name *
              </label>
              <input
                id="edit-firstName" name="firstName" type="text"
                value={form.firstName} onChange={handleChange}
                placeholder="First Name" aria-label="First Name"
                className="w-full p-2.5 border rounded-lg text-sm" required
              />
            </div>
            <div>
              <label htmlFor="edit-lastName" className="block text-xs font-medium text-[#8B5E3C] mb-1">
                Last Name *
              </label>
              <input
                id="edit-lastName" name="lastName" type="text"
                value={form.lastName} onChange={handleChange}
                placeholder="Last Name" aria-label="Last Name"
                className="w-full p-2.5 border rounded-lg text-sm" required
              />
            </div>
          </div>

          {/* Card ID + Class Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="edit-studentId" className="block text-xs font-medium text-[#8B5E3C] mb-1">
                Card ID *
              </label>
              <input
                id="edit-studentId" name="studentId" type="text"
                value={form.studentId} onChange={handleChange}
                placeholder="e.g. BA-2025-0042" aria-label="Card ID"
                className="w-full p-2.5 border rounded-lg text-sm font-mono" required
              />
            </div>
            <div>
              <label htmlFor="edit-studentClass" className="block text-xs font-medium text-[#8B5E3C] mb-1">
                Class *
              </label>
              <select
                id="edit-studentClass" name="studentClass"
                value={form.studentClass} onChange={handleChange}
                className="w-full p-2.5 border rounded-lg text-sm" required
              >
                <option value="">Select Class</option>
                <option value="JSS 1">JSS 1</option>
                <option value="JSS 2">JSS 2</option>
                <option value="JSS 3">JSS 3</option>
                <option value="SSS 1">SSS 1</option>
                <option value="SSS 2">SSS 2</option>
                <option value="SSS 3">SSS 3</option>
              </select>
            </div>
          </div>

          {/* Department — Conditional */}
          {requiresDepartment && (
            <div className="bg-amber-50/50 p-4 border border-amber-200/60 rounded-xl">
              <label
                htmlFor="edit-studentType"
                className="block text-xs font-bold uppercase tracking-wider text-amber-800 mb-1.5"
              >
                Department *
              </label>
              <select
                id="edit-studentType" name="studentType"
                value={form.studentType} onChange={handleChange}
                className="w-full p-2.5 border border-amber-200 rounded-lg outline-none text-sm bg-white"
                required
              >
                <option value="">Select Department</option>
                <option value="SCIENCE">Science</option>
                <option value="ART">Art</option>
                <option value="COMMERCIAL">Commercial</option>
              </select>
            </div>
          )}

          {/* Guardian Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="edit-guardianName" className="block text-xs font-medium text-[#8B5E3C] mb-1">
                Guardian Name
              </label>
              <input
                id="edit-guardianName" name="guardianName" type="text"
                value={form.guardianName} onChange={handleChange}
                placeholder="Guardian Name" aria-label="Guardian Name"
                className="w-full p-2.5 border rounded-lg text-sm"
              />
            </div>
            <div>
              <label htmlFor="edit-guardianPhone" className="block text-xs font-medium text-[#8B5E3C] mb-1">
                Guardian Phone
              </label>
              <input
                id="edit-guardianPhone" name="guardianPhone" type="text"
                value={form.guardianPhone} onChange={handleChange}
                placeholder="Guardian Phone" aria-label="Guardian Phone"
                className="w-full p-2.5 border rounded-lg text-sm"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-xs">{error}</p>}

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose} disabled={saving}
              className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave} disabled={saving}
              className="flex-1 py-2.5 bg-[#8B5E3C] text-white rounded-lg font-semibold hover:bg-[#6B3F2C] transition-all disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}