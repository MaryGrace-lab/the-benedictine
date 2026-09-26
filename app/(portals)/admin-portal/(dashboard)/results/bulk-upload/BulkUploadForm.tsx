"use client";

// ──────────────────────────────────────────────
// Bulk Upload Form — Client Component
// Handles all interactive form state, score grid,
// behaviour, attendance, and submission logic.
// Receives initial data as props from server.
// Fields and layout match the single Upload form.
// ──────────────────────────────────────────────

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import LogoutButton from "@/components/ui/LogoutButton";

// ── Types ──
type Student = {
  studentId: string;
  firstName: string;
  lastName: string;
  class: string;
  studentType: string | null;
};

type Subject = { id: string; name: string };

type Session = { id: string; year: string; term: string };

type ScoreEntry = {
  firstTest: number | null;
  secondTest: number | null;
  exam: number | null;
};

type BulkUploadResult = {
  processed: number;
  failed: number;
};

type AttendanceData = {
  schoolOpened: number | null;
  schoolPresent: number | null;
  sportOpened: number | null;
  sportPresent: number | null;
  othersOpened: number | null;
  othersPresent: number | null;
  organizedActivitiesOpened: number | null;
  organizedActivitiesPresent: number | null;
  remark: string;
};

// ── Constants ──
const RATING_OPTIONS = [
  { value: "", label: "Select" },
  { value: "EXCELLENT", label: "Excellent (5)" },
  { value: "GOOD", label: "Good (4)" },
  { value: "AVERAGE", label: "Average (3)" },
  { value: "POOR", label: "Poor (2)" },
  { value: "VERY_POOR", label: "Very Poor (1)" },
];

const EVALUATION_OPTIONS = [
  { value: "", label: "Select" },
  { value: "EXCELLENT", label: "Excellent" },
  { value: "GOOD", label: "Good" },
  { value: "AVERAGE", label: "Average" },
  { value: "BELOW_AVERAGE", label: "Below Average" },
  { value: "POOR", label: "Poor" },
];

const BEHAVIOUR_TRAITS = [
  { key: "obedience", label: "Obedience" },
  { key: "honesty", label: "Honesty" },
  { key: "responsibility", label: "Responsibility" },
  { key: "selfControl", label: "Self-Control" },
  { key: "leadership", label: "Leadership" },
  { key: "relationshipWithOthers", label: "Relationship with Others" },
  { key: "gamesAndSports", label: "Games and Sports" },
  { key: "health", label: "Health" },
  { key: "neatness", label: "Neatness" },
  { key: "manipulativeSkill", label: "Manipulative Skill" },
];

const ATTENDANCE_FIELDS: { key: keyof AttendanceData; label: string }[] = [
  { key: "schoolOpened", label: "School Days This Term" },
  { key: "schoolPresent", label: "Days Present" },
  { key: "sportOpened", label: "Sports Sessions Held" },
  { key: "sportPresent", label: "Sports Attended" },
  { key: "othersOpened", label: "Other Events Held" },
  { key: "othersPresent", label: "Other Events Attended" },
  { key: "organizedActivitiesOpened", label: "Club Activities Held" },
  { key: "organizedActivitiesPresent", label: "Club Activities Attended" },
];

const INITIAL_ATTENDANCE: AttendanceData = {
  schoolOpened: null,
  schoolPresent: null,
  sportOpened: null,
  sportPresent: null,
  othersOpened: null,
  othersPresent: null,
  organizedActivitiesOpened: null,
  organizedActivitiesPresent: null,
  remark: "",
};

const INITIAL_SUMMARY = {
  noInClass: null as number | null,
  evaluation: "",
  classTeacherComment: "",
  nextTermFees: "",
  outstandingFees: "",
  books: "",
  nextTermBegins: "",
  headTeacherComment: "",
  parentName: "",
};

interface Props {
  initialStudents: Student[];
  initialSessions: Session[];
}

export default function BulkUploadForm({ initialStudents, initialSessions }: Props) {
  const router = useRouter();

  const [students] = useState<Student[]>(initialStudents);
  const [sessions] = useState<Session[]>(initialSessions);

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSession, setSelectedSession] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [classes, setClasses] = useState<string[]>([]);
  const [scores, setScores] = useState<Record<string, Record<string, ScoreEntry>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [result, setResult] = useState<BulkUploadResult | null>(null);

  const [commonBehaviour, setCommonBehaviour] = useState<Record<string, string>>({});
  const [commonAttendance, setCommonAttendance] = useState<AttendanceData>(INITIAL_ATTENDANCE);
  const [commonSummary, setCommonSummary] = useState(INITIAL_SUMMARY);

  const filteredStudents = selectedClass
    ? students.filter((s) => s.class === selectedClass)
    : [];

  // Initialize classes and behaviour on mount
  useEffect(() => {
    const uniqueClasses = [...new Set(students.map((s) => s.class))].sort();
    setClasses(uniqueClasses);

    const initBehaviour: Record<string, string> = {};
    BEHAVIOUR_TRAITS.forEach((t) => {
      initBehaviour[t.key] = "";
    });
    setCommonBehaviour(initBehaviour);
  }, [students]);

  // Load subjects when class changes
  useEffect(() => {
    if (!selectedClass) {
      setSubjects([]);
      setScores({});
      return;
    }
    setLoadingSubjects(true);
    const classStudents = students.filter((s) => s.class === selectedClass);
    const level = selectedClass.startsWith("SSS") ? "SSS" : "JSS";
    const stream = classStudents[0]?.studentType || "";
    const url = stream
      ? `/api/subjects?level=${level}&stream=${stream}`
      : `/api/subjects?level=${level}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => setSubjects(data.subjects || []))
      .catch(() => toast.error("Failed to load subjects"))
      .finally(() => setLoadingSubjects(false));
  }, [selectedClass, students]);

  // Initialize score grid when class/subjects change
  useEffect(() => {
    if (filteredStudents.length > 0 && subjects.length > 0) {
      const scoreMap: Record<string, Record<string, ScoreEntry>> = {};
      filteredStudents.forEach((student) => {
        scoreMap[student.studentId] = {};
        subjects.forEach((subject) => {
          scoreMap[student.studentId][subject.id] = {
            firstTest: null,
            secondTest: null,
            exam: null,
          };
        });
      });
      setScores(scoreMap);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClass, subjects]);

  const updateScore = (
    studentId: string,
    subjectId: string,
    field: keyof ScoreEntry,
    value: string
  ) => {
    const numValue = value === "" ? null : Number(value);
    setScores((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [subjectId]: {
          ...prev[studentId]?.[subjectId],
          [field]: numValue,
        },
      },
    }));
  };

  const updateAttendance = (field: keyof AttendanceData, value: string) => {
    if (field === "remark") {
      setCommonAttendance((prev) => ({ ...prev, remark: value }));
      return;
    }
    const numValue = value === "" ? null : Number(value);
    setCommonAttendance((prev) => ({ ...prev, [field]: numValue }));
  };

  const resetForm = () => {
    setSelectedSession("");
    setSelectedClass("");
    setSubjects([]);
    setScores({});
    setCommonSummary(INITIAL_SUMMARY);
    setCommonAttendance(INITIAL_ATTENDANCE);
    const initBehaviour: Record<string, string> = {};
    BEHAVIOUR_TRAITS.forEach((t) => {
      initBehaviour[t.key] = "";
    });
    setCommonBehaviour(initBehaviour);
  };

  const handleSubmit = async () => {
    if (!selectedSession) {
      toast.error("Please select a session");
      return;
    }
    if (!selectedClass) {
      toast.error("Please select a class");
      return;
    }

    if (!window.confirm(`Upload results for ${filteredStudents.length} students?`)) return;

    setSubmitting(true);

    const results = Object.entries(scores).map(([studentId, subjectScores]) => ({
      studentId,
      scores: Object.entries(subjectScores).map(([subjectId, score]) => ({
        subjectId,
        ...score,
      })),
    }));

    const sanitizedBehaviour: Record<string, string | null> = {};
    Object.entries(commonBehaviour).forEach(([key, val]) => {
      sanitizedBehaviour[key] = val === "" ? null : val;
    });

    const payload = {
      sessionId: selectedSession,
      class: selectedClass,
      results,
      socialBehaviour: sanitizedBehaviour,
      attendance: {
        schoolOpened: commonAttendance.schoolOpened,
        schoolPresent: commonAttendance.schoolPresent,
        sportOpened: commonAttendance.sportOpened,
        sportPresent: commonAttendance.sportPresent,
        othersOpened: commonAttendance.othersOpened,
        othersPresent: commonAttendance.othersPresent,
        organizedActivitiesOpened: commonAttendance.organizedActivitiesOpened,
        organizedActivitiesPresent: commonAttendance.organizedActivitiesPresent,
        remark: commonAttendance.remark.trim() || null,
      },
      noInClass: commonSummary.noInClass,
      evaluation: commonSummary.evaluation || null,
      classTeacherComment: commonSummary.classTeacherComment.trim() || null,
      nextTermFees: commonSummary.nextTermFees.trim() || null,
      outstandingFees: commonSummary.outstandingFees.trim() || null,
      books: commonSummary.books.trim() || null,
      nextTermBegins: commonSummary.nextTermBegins.trim() || null,
      headTeacherComment: commonSummary.headTeacherComment.trim() || null,
      parentName: commonSummary.parentName.trim() || null,
    };

    try {
      const res = await fetch("/api/results/bulk-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
        setShowSuccess(true);
      } else {
        toast.error(data.error || "Upload failed");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success Screen ──
  if (showSuccess && result) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4">
        <Toaster position="top-center" />
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#3D1902] mb-2">Bulk Upload Complete!</h1>
          <div className="bg-[#FAF7F2] rounded-xl p-4 mb-6 text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-[#8B5E3C]">Processed:</span>
              <span className="font-semibold text-green-700">{result.processed} students</span>
            </div>
            {result.failed > 0 && (
              <div className="flex justify-between">
                <span className="text-[#8B5E3C]">Failed:</span>
                <span className="font-semibold text-red-600">{result.failed} students</span>
              </div>
            )}
          </div>
          <div className="space-y-3">
            <button
              onClick={() => {
                setShowSuccess(false);
                setResult(null);
                resetForm();
              }}
              className="w-full py-3 bg-[#8B5E3C] text-white rounded-xl font-semibold hover:bg-[#6B3F2C] transition-all"
            >
              📝 Upload Another Class
            </button>
            <button
              onClick={() => router.push("/admin-portal/dashboard")}
              className="w-full py-3 bg-[#FAF7F2] text-[#3D1902] rounded-xl font-semibold hover:bg-[#8B5E3C]/10 transition-all"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Main Form ──
  return (
    <div className="min-h-screen bg-[#FAF7F2] p-4 md:p-8">
      <Toaster position="top-center" />
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#3D1902]">📊 Bulk Upload Results</h1>
          <LogoutButton type="admin" />
        </div>

        {/* Session & Class */}
        <div className="bg-white p-6 rounded-2xl border border-[#8B5E3C]/10 shadow-sm mb-6">
          <h2 className="text-md font-semibold text-[#3D1902] mb-4">Session & Class</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="bulk-session" className="block text-xs font-medium text-[#8B5E3C] mb-1">
                Session *
              </label>
              <select
                id="bulk-session"
                aria-label="Select Session"
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value)}
                className="w-full p-2.5 border rounded-lg text-sm"
              >
                <option value="">Select Session</option>
                {sessions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.year} — {s.term} Term
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="bulk-class" className="block text-xs font-medium text-[#8B5E3C] mb-1">
                Class *
              </label>
              <select
                id="bulk-class"
                aria-label="Select Class"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full p-2.5 border rounded-lg text-sm"
              >
                <option value="">Select Class</option>
                {classes.map((c) => (
                  <option key={c} value={c}>
                    {c} ({students.filter((s) => s.class === c).length} students)
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loadingSubjects && (
          <div className="bg-white p-6 rounded-2xl border text-center mb-6">
            <p className="text-[#8B5E3C] animate-pulse text-sm">Loading subjects...</p>
          </div>
        )}

        {selectedClass && !loadingSubjects && filteredStudents.length > 0 && (
          <>
            {/* Score Grid */}
            <div className="bg-white rounded-2xl border border-[#8B5E3C]/10 shadow-sm overflow-hidden mb-6">
              <div className="p-6 border-b">
                <h2 className="text-md font-semibold text-[#3D1902]">Subject Scores</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm" aria-label="Bulk Upload Scores">
                  <thead>
                    <tr className="bg-[#FAF7F2] text-xs font-semibold text-[#8B5E3C] border-b">
                      <th className="p-3 text-left sticky left-0 bg-[#FAF7F2] z-10 min-w-[160px]">
                        Student
                      </th>
                      {subjects.map((subject) => (
                        <th key={subject.id} className="p-2 text-center min-w-[130px]">
                          <div className="text-[10px] leading-tight">{subject.name}</div>
                          <div className="flex gap-1 mt-1 justify-center text-[9px] font-normal text-[#8B5E3C]/50">
                            <span className="w-8">1st</span>
                            <span className="w-8">2nd</span>
                            <span className="w-8">Ex</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredStudents.map((student) => (
                      <tr key={student.studentId} className="hover:bg-[#FAF7F2]/50 group">
                        <td className="p-3 font-medium text-[#3D1902] sticky left-0 bg-white group-hover:bg-[#FAF7F2] z-10">
                          {student.lastName} {student.firstName}
                          <div className="text-[10px] text-[#8B5E3C]/60">{student.studentId}</div>
                        </td>
                        {subjects.map((subject) => (
                          <td key={subject.id} className="p-2">
                            <div className="flex gap-1 justify-center">
                              <input
                                type="number"
                                min="0"
                                max="20"
                                aria-label={`${student.lastName} ${subject.name} First Test`}
                                value={scores[student.studentId]?.[subject.id]?.firstTest ?? ""}
                                onChange={(e) =>
                                  updateScore(student.studentId, subject.id, "firstTest", e.target.value)
                                }
                                className="w-10 p-1 border rounded text-center text-xs"
                                placeholder="0"
                              />
                              <input
                                type="number"
                                min="0"
                                max="20"
                                aria-label={`${student.lastName} ${subject.name} Second Test`}
                                value={scores[student.studentId]?.[subject.id]?.secondTest ?? ""}
                                onChange={(e) =>
                                  updateScore(student.studentId, subject.id, "secondTest", e.target.value)
                                }
                                className="w-10 p-1 border rounded text-center text-xs"
                                placeholder="0"
                              />
                              <input
                                type="number"
                                min="0"
                                max="60"
                                aria-label={`${student.lastName} ${subject.name} Exam`}
                                value={scores[student.studentId]?.[subject.id]?.exam ?? ""}
                                onChange={(e) =>
                                  updateScore(student.studentId, subject.id, "exam", e.target.value)
                                }
                                className="w-10 p-1 border rounded text-center text-xs"
                                placeholder="0"
                              />
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Social Behaviour */}
            <div className="bg-white p-6 rounded-2xl border border-[#8B5E3C]/10 shadow-sm mb-6">
              <h2 className="text-md font-semibold text-[#3D1902] mb-4">Social Behaviour</h2>
              <p className="text-xs text-[#8B5E3C]/60 mb-4">
                Applied to ALL students in this class.
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {BEHAVIOUR_TRAITS.map((trait) => (
                  <div key={trait.key}>
                    <label htmlFor={`bulk-${trait.key}`} className="block text-xs font-medium text-[#8B5E3C] mb-1">
                      {trait.label}
                    </label>
                    <select
                      id={`bulk-${trait.key}`}
                      aria-label={`Bulk ${trait.label}`}
                      value={commonBehaviour[trait.key] || ""}
                      onChange={(e) =>
                        setCommonBehaviour((prev) => ({
                          ...prev,
                          [trait.key]: e.target.value,
                        }))
                      }
                      className="w-full p-2 border rounded-lg text-xs"
                    >
                      {RATING_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            {/* Attendance */}
            <div className="bg-white p-6 rounded-2xl border border-[#8B5E3C]/10 shadow-sm mb-6">
              <h2 className="text-md font-semibold text-[#3D1902] mb-4">Attendance</h2>
              <p className="text-xs text-[#8B5E3C]/60 mb-4">
                Applied to ALL students in this class.
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {ATTENDANCE_FIELDS.map((item) => (
                  <div key={item.key}>
                    <label htmlFor={`bulk-${item.key}`} className="block text-xs font-medium text-[#8B5E3C] mb-1">
                      {item.label}
                    </label>
                    <input
                      id={`bulk-${item.key}`}
                      type="number"
                      min="0"
                      aria-label={item.label}
                      value={commonAttendance[item.key] ?? ""}
                      onChange={(e) => updateAttendance(item.key, e.target.value)}
                      className="w-full p-2 border rounded-lg text-xs"
                    />
                  </div>
                ))}
                <div>
                  <label htmlFor="bulk-attendance-remark" className="block text-xs font-medium text-[#8B5E3C] mb-1">
                    Remark
                  </label>
                  <input
                    id="bulk-attendance-remark"
                    type="text"
                    aria-label="Attendance Remark"
                    value={commonAttendance.remark}
                    onChange={(e) => updateAttendance("remark", e.target.value)}
                    className="w-full p-2 border rounded-lg text-xs"
                    placeholder="e.g. Good attendance"
                  />
                </div>
              </div>
            </div>

            {/* Summary & Comments */}
            <div className="bg-white p-6 rounded-2xl border border-[#8B5E3C]/10 shadow-sm mb-6">
              <h2 className="text-md font-semibold text-[#3D1902] mb-4">Summary & Comments</h2>
              <p className="text-xs text-[#8B5E3C]/60 mb-4">
                Applied to ALL students in this class.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="bulk-noInClass" className="block text-xs font-medium text-[#8B5E3C] mb-1">
                    Number in Class
                  </label>
                  <input
                    id="bulk-noInClass"
                    type="number"
                    min="0"
                    value={commonSummary.noInClass ?? ""}
                    onChange={(e) =>
                      setCommonSummary((prev) => ({
                        ...prev,
                        noInClass: e.target.value === "" ? null : Number(e.target.value),
                      }))
                    }
                    className="w-full p-2.5 border rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="bulk-evaluation" className="block text-xs font-medium text-[#8B5E3C] mb-1">
                    Evaluation
                  </label>
                  <select
                    id="bulk-evaluation"
                    value={commonSummary.evaluation}
                    onChange={(e) =>
                      setCommonSummary((prev) => ({ ...prev, evaluation: e.target.value }))
                    }
                    className="w-full p-2.5 border rounded-lg text-sm"
                  >
                    {EVALUATION_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="bulk-classTeacherComment" className="block text-xs font-medium text-[#8B5E3C] mb-1">
                    Class Teacher&apos;s Comment
                  </label>
                  <textarea
                    id="bulk-classTeacherComment"
                    value={commonSummary.classTeacherComment}
                    onChange={(e) =>
                      setCommonSummary((prev) => ({ ...prev, classTeacherComment: e.target.value }))
                    }
                    className="w-full p-2.5 border rounded-lg text-sm"
                    rows={2}
                  />
                </div>
                <div>
                  <label htmlFor="bulk-nextTermFees" className="block text-xs font-medium text-[#8B5E3C] mb-1">
                    Next Term Fees
                  </label>
                  <input
                    id="bulk-nextTermFees"
                    type="text"
                    value={commonSummary.nextTermFees}
                    onChange={(e) =>
                      setCommonSummary((prev) => ({ ...prev, nextTermFees: e.target.value }))
                    }
                    className="w-full p-2.5 border rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="bulk-outstandingFees" className="block text-xs font-medium text-[#8B5E3C] mb-1">
                    Outstanding Fees
                  </label>
                  <input
                    id="bulk-outstandingFees"
                    type="text"
                    value={commonSummary.outstandingFees}
                    onChange={(e) =>
                      setCommonSummary((prev) => ({ ...prev, outstandingFees: e.target.value }))
                    }
                    className="w-full p-2.5 border rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="bulk-nextTermBegins" className="block text-xs font-medium text-[#8B5E3C] mb-1">
                    Next Term Begins
                  </label>
                  <input
                    id="bulk-nextTermBegins"
                    type="text"
                    value={commonSummary.nextTermBegins}
                    onChange={(e) =>
                      setCommonSummary((prev) => ({ ...prev, nextTermBegins: e.target.value }))
                    }
                    className="w-full p-2.5 border rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="bulk-books" className="block text-xs font-medium text-[#8B5E3C] mb-1">
                    Books
                  </label>
                  <input
                    id="bulk-books"
                    type="text"
                    value={commonSummary.books}
                    onChange={(e) =>
                      setCommonSummary((prev) => ({ ...prev, books: e.target.value }))
                    }
                    className="w-full p-2.5 border rounded-lg text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="bulk-headTeacherComment" className="block text-xs font-medium text-[#8B5E3C] mb-1">
                    Head Teacher&apos;s Comment
                  </label>
                  <textarea
                    id="bulk-headTeacherComment"
                    value={commonSummary.headTeacherComment}
                    onChange={(e) =>
                      setCommonSummary((prev) => ({ ...prev, headTeacherComment: e.target.value }))
                    }
                    className="w-full p-2.5 border rounded-lg text-sm"
                    rows={2}
                  />
                </div>
                <div>
                  <label htmlFor="bulk-parentName" className="block text-xs font-medium text-[#8B5E3C] mb-1">
                    Parent/Guardian Name
                  </label>
                  <input
                    id="bulk-parentName"
                    type="text"
                    value={commonSummary.parentName}
                    onChange={(e) =>
                      setCommonSummary((prev) => ({ ...prev, parentName: e.target.value }))
                    }
                    className="w-full p-2.5 border rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={submitting || !selectedSession}
              className="w-full py-3.5 bg-[#8B5E3C] text-white rounded-xl font-semibold hover:bg-[#6B3F2C] disabled:opacity-50 transition-all"
            >
              {submitting
                ? "Uploading..."
                : `Commit Results for ${filteredStudents.length} Students`}
            </button>
          </>
        )}
      </div>
    </div>
  );
}