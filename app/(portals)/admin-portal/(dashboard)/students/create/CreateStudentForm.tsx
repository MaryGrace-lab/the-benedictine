"use client";

// ──────────────────────────────────────────────
// Create Student Form — Client Component
// Fields: First Name, Last Name, Gender, School ID, Card ID,
// Class, Department (SSS 2/3 only), Password, PIN,
// Guardian Name, Guardian Phone.
// ──────────────────────────────────────────────

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import StudentCard from "@/components/ui/StudentCard";
import { Eye, EyeOff } from "lucide-react";

type FormData = {
  firstName: string;
  lastName: string;
  gender: string;
  schoolId: string;
  studentId: string;
  studentClass: string;
  department: string;
  password: string;
  pin: string;
  guardianName: string;
  guardianPhone: string;
};

type CreatedStudentData = {
  success: boolean;
  student: {
    id: string;
    studentId: string;
    schoolId: string | null;
    name: string;
    gender: string | null;
    class: string;
  };
  cardDetails: {
    studentId: string;
    schoolId: string | null;
    temporaryPassword: string;
    pin: string;
    instruction: string;
  };
} | null;

export default function CreateStudentForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormData>({
    firstName: "",
    lastName: "",
    gender: "",
    schoolId: "",
    studentId: "",
    studentClass: "",
    department: "",
    password: "",
    pin: "",
    guardianName: "",
    guardianPhone: "",
  });
  const [createdStudent, setCreatedStudent] = useState<CreatedStudentData>(null);
  const [showCard, setShowCard] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const requiresDepartment =
    form.studentClass === "SSS 2" || form.studentClass === "SSS 3";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      if (
        name === "studentClass" &&
        value !== "SSS 2" &&
        value !== "SSS 3"
      ) {
        updated.department = "";
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatedStudent(null);

    if (requiresDepartment && !form.department) {
      toast.error("Please select a department for SSS 2/3 students");
      return;
    }

    if (
      !form.firstName ||
      !form.lastName ||
      !form.studentId ||
      !form.studentClass
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (form.password && form.password.length < 8) {
      toast.error("Custom password must be at least 8 characters");
      return;
    }

    if (form.pin && !/^\d{4,6}$/.test(form.pin)) {
      toast.error("PIN must be 4–6 digits");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/students/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          gender: form.gender || undefined,
          schoolId: form.schoolId.trim() || undefined,
          studentId: form.studentId.trim(),
          studentClass: form.studentClass,
          studentType: form.department || undefined,
          guardianName: form.guardianName.trim() || undefined,
          guardianPhone: form.guardianPhone.trim() || undefined,
          password: form.password || undefined,
          pin: form.pin || undefined,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Student created successfully!");
        setCreatedStudent(data);
        setForm({
          firstName: "",
          lastName: "",
          gender: "",
          schoolId: "",
          studentId: "",
          studentClass: "",
          department: "",
          password: "",
          pin: "",
          guardianName: "",
          guardianPhone: "",
        });
      } else {
        toast.error(data.error || "Failed to create student");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <Toaster position="top-center" />

      {createdStudent && showCard && (
        <StudentCard
          isOpen={showCard}
          studentName={createdStudent.student.name}
          studentId={createdStudent.cardDetails.studentId}
          schoolId={createdStudent.cardDetails.schoolId}
          password={createdStudent.cardDetails.temporaryPassword}
          pin={createdStudent.cardDetails.pin}
          studentClass={createdStudent.student.class}
          onClose={() => setShowCard(false)}
        />
      )}

      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">
          Create New Student
        </h1>

        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* First Name */}
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  First Name *
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={form.firstName}
                  onChange={handleChange}
                  className="w-full p-2.5 border rounded-lg outline-none text-sm"
                  required
                />
              </div>

              {/* Last Name */}
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  Last Name *
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={form.lastName}
                  onChange={handleChange}
                  className="w-full p-2.5 border rounded-lg outline-none text-sm"
                  required
                />
              </div>

              {/* Gender */}
              <div>
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full p-2.5 border rounded-lg outline-none text-sm bg-white"
                >
                  <option value="">Select Gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
              </div>

              {/* School ID */}
              <div>
                <label
                  htmlFor="schoolId"
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  School ID
                </label>
                <input
                  id="schoolId"
                  name="schoolId"
                  type="text"
                  value={form.schoolId}
                  onChange={handleChange}
                  placeholder="e.g. TBA/2026/0123"
                  className="w-full p-2.5 border rounded-lg outline-none text-sm"
                  required
                />
              </div>

              {/* Card ID */}
              <div>
                <label
                  htmlFor="studentId"
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  Card ID *
                </label>
                <input
                  id="studentId"
                  name="studentId"
                  type="text"
                  value={form.studentId}
                  onChange={handleChange}
                  placeholder="e.g. TBA-STU-2026-001"
                  className="w-full p-2.5 border rounded-lg outline-none text-sm"
                  required
                />
              </div>

              {/* Class */}
              <div>
                <label
                  htmlFor="studentClass"
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  Class *
                </label>
                <select
                  id="studentClass"
                  name="studentClass"
                  value={form.studentClass}
                  onChange={handleChange}
                  className="w-full p-2.5 border rounded-lg outline-none text-sm bg-white"
                  required
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

              {/* Department — Conditional */}
              {requiresDepartment && (
                <div className="md:col-span-2 bg-amber-50/50 p-4 border border-amber-200/60 rounded-xl">
                  <label
                    htmlFor="department"
                    className="block text-xs font-bold uppercase tracking-wider text-amber-800 mb-1.5"
                  >
                    Department *
                  </label>
                  <select
                    id="department"
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    className="w-full p-2.5 border border-amber-200 rounded-lg outline-none text-sm bg-white text-slate-800 font-medium"
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="SCIENCE">Science</option>
                    <option value="ART">Art</option>
                    <option value="COMMERCIAL">Commercial</option>
                  </select>
                  <p className="text-[11px] text-amber-700/80 mt-1.5">
                    This determines which subjects appear on the result sheet.
                  </p>
                </div>
              )}

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  Password (optional)
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Leave blank to auto-generate"
                    className="w-full p-2.5 pr-10 border rounded-lg outline-none text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Min 8 characters, include uppercase &amp; number
                </p>
              </div>

              {/* PIN */}
              <div>
                <label
                  htmlFor="pin"
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  PIN (optional)
                </label>
                <input
                  id="pin"
                  name="pin"
                  type="text"
                  inputMode="numeric"
                  pattern="\d{4,6}"
                  maxLength={6}
                  value={form.pin}
                  onChange={handleChange}
                  placeholder="4–6 digits"
                  className="w-full p-2.5 border rounded-lg outline-none text-sm font-mono"
                />
                <p className="text-xs text-slate-400 mt-1">
                  Required by student to view results. Leave blank to
                  auto-generate.
                </p>
              </div>

              {/* Guardian Name */}
              <div>
                <label
                  htmlFor="guardianName"
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  Guardian Name
                </label>
                <input
                  id="guardianName"
                  name="guardianName"
                  type="text"
                  value={form.guardianName}
                  onChange={handleChange}
                  className="w-full p-2.5 border rounded-lg outline-none text-sm"
                />
              </div>

              {/* Guardian Phone */}
              <div>
                <label
                  htmlFor="guardianPhone"
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  Guardian Phone
                </label>
                <input
                  id="guardianPhone"
                  name="guardianPhone"
                  type="text"
                  value={form.guardianPhone}
                  onChange={handleChange}
                  className="w-full p-2.5 border rounded-lg outline-none text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#270f01] text-white rounded-lg font-semibold hover:bg-[#3d1902] active:scale-[0.99] disabled:opacity-50 transition-all text-sm"
            >
              {loading ? "Creating..." : "Create Student"}
            </button>
          </form>
        </div>

        {/* Success Card */}
        {createdStudent && (
          <div className="mt-6 bg-green-50 border border-green-200 p-6 rounded-xl">
            <h2 className="text-lg font-bold text-green-800 mb-3">
              ✅ Student Created!
            </h2>
            <div className="text-sm space-y-2">
              <p>
                <span className="font-semibold">Name:</span>{" "}
                {createdStudent.student.name}
              </p>
              <p>
                <span className="font-semibold">Gender:</span>{" "}
                {createdStudent.student.gender || "—"}
              </p>
              <p>
                <span className="font-semibold">Class:</span>{" "}
                {createdStudent.student.class}
              </p>
              {createdStudent.student.schoolId && (
                <p>
                  <span className="font-semibold">School ID:</span>{" "}
                  {createdStudent.student.schoolId}
                </p>
              )}
              <p>
                <span className="font-semibold">Card ID:</span>{" "}
                {createdStudent.cardDetails.studentId}
              </p>
              <p>
                <span className="font-semibold">Password:</span>{" "}
                <code className="bg-white px-2 py-1 rounded">
                  {createdStudent.cardDetails.temporaryPassword}
                </code>
              </p>
              <p>
                <span className="font-semibold">Result PIN:</span>{" "}
                <code className="bg-white px-2 py-1 rounded">
                  {createdStudent.cardDetails.pin}
                </code>
              </p>
            </div>
            <button
              onClick={() => setShowCard(true)}
              className="mt-3 w-full py-2 bg-[#8B5E3C] text-white rounded-lg text-sm font-semibold hover:bg-[#6B3F2C] transition-all"
            >
              🎓 View &amp; Print Student Card
            </button>
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => router.push("/admin-portal/students")}
                className="flex-1 py-2.5 bg-[#270f01] text-white rounded-lg text-sm font-semibold hover:bg-[#3d1902] transition-all"
              >
                👥 View All Students
              </button>
              <button
                onClick={() => {
                  setCreatedStudent(null);
                  setShowCard(false);
                }}
                className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-all"
              >
                + Create Another Student
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}