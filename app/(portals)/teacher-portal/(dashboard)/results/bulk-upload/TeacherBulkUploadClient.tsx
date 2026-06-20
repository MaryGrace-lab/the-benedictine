"use client";

// ──────────────────────────────────────────────
// Teacher Bulk Upload Client — Client Component
// Handles score grid, behaviour, attendance, submission.
// Receives initial data as props from server.
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
} | null;

// ── Constants ──
const RATING_OPTIONS = [
  { value: "", label: "Select" },
  { value: "EXCELLENT", label: "Excellent (5)" },
  { value: "GOOD", label: "Good (4)" },
  { value: "AVERAGE", label: "Average (3)" },
  { value: "POOR", label: "Poor (2)" },
  { value: "VERY_POOR", label: "Very Poor (1)" },
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

interface Props {
  initialStudents: Student[];
  initialSessions: Session[];
}

export default function TeacherBulkUploadClient({ initialStudents, initialSessions }: Props) {
  const router = useRouter();

  const [students] = useState<Student[]>(initialStudents);
  const [sessions] = useState<Session[]>(initialSessions);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSession, setSelectedSession] = useState("");
  const [scores, setScores] = useState<Record<string, Record<string, ScoreEntry>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [result, setResult] = useState<BulkUploadResult>(null);

  const [commonBehaviour, setCommonBehaviour] = useState<Record<string, string>>({});
  const [commonAttendance, setCommonAttendance] = useState<Record<string, number | null>>({
    schoolOpened: null, schoolPresent: null, sportOpened: null, sportPresent: null,
    othersOpened: null, othersPresent: null, organizedActivitiesOpened: null, organizedActivitiesPresent: null,
  });
  const [commonSummary, setCommonSummary] = useState({
    noInClass: null as number | null, evaluation: "", classTeacherComment: "",
    nextTermFees: "", outstandingFees: "", books: "", nextTermBegins: "",
    headTeacherComment: "", parentName: "",
  });

  // Load subjects on mount
  useEffect(() => {
    if (students.length === 0) return;
    const firstStudent = students[0];
    const level = firstStudent.class?.startsWith("SSS") ? "SSS" : "JSS";
    const stream = firstStudent.studentType || "";
    const url = stream
      ? `/api/subjects?level=${level}&stream=${stream}`
      : `/api/subjects?level=${level}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setSubjects(data.subjects || []);
        const scoreMap: Record<string, Record<string, ScoreEntry>> = {};
        students.forEach((student) => {
          scoreMap[student.studentId] = {};
          (data.subjects || []).forEach((subject: Subject) => {
            scoreMap[student.studentId][subject.id] = {
              firstTest: null,
              secondTest: null,
              exam: null,
            };
          });
        });
        setScores(scoreMap);
      });

    const initBehaviour: Record<string, string> = {};
    BEHAVIOUR_TRAITS.forEach((t) => {
      initBehaviour[t.key] = "";
    });
    setCommonBehaviour(initBehaviour);
  }, [students]);

  const updateScore = (studentId: string, subjectId: string, field: string, value: string) => {
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

  const handleSubmit = async () => {
    if (!selectedSession) {
      toast.error("Please select a session");
      return;
    }

    if (!window.confirm(`Upload results for ${students.length} students?`)) return;

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

    try {
      const res = await fetch("/api/results/bulk-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: selectedSession,
          class: students[0]?.class || "",
          results,
          socialBehaviour: sanitizedBehaviour,
          attendance: { ...commonAttendance, remark: "" },
          ...commonSummary,
          evaluation: commonSummary.evaluation || null,
        }),
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
              onClick={() => { setShowSuccess(false); setResult(null); }}
              className="w-full py-3 bg-[#8B5E3C] text-white rounded-xl font-semibold hover:bg-[#6B3F2C] transition-all"
            >
              📝 Upload Another
            </button>
            <button
              onClick={() => router.push("/teacher-portal/dashboard")}
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
    <div className="min-h-screen bg-[#FAF7F2] p-4 md:p-6">
      <Toaster position="top-center" />
      <div className="max-w-full mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#3D1902]">📊 Bulk Upload Results</h1>
            <p className="text-xs text-[#8B5E3C]/60 mt-1">{students.length} students in your class</p>
          </div>
          <LogoutButton type="teacher" />
        </div>

        {students.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl border text-center">
            <p className="text-[#8B5E3C]">No students found in your class.</p>
          </div>
        ) : (
          <>
            {/* Session Selector */}
            <div className="bg-white p-4 rounded-2xl border border-[#8B5E3C]/10 shadow-sm mb-6">
              <div>
                <label htmlFor="bulk-session" className="block text-xs font-medium text-[#8B5E3C] mb-1">
                  Session *
                </label>
                <select
                  id="bulk-session"
                  aria-label="Select Session"
                  value={selectedSession}
                  onChange={(e) => setSelectedSession(e.target.value)}
                  className="w-full md:w-64 p-2.5 border rounded-lg text-sm"
                >
                  <option value="">Select Session</option>
                  {sessions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.year} — {s.term}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Scores Grid */}
            <div className="bg-white rounded-2xl border border-[#8B5E3C]/10 shadow-sm overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm" aria-label="Bulk Upload Scores">
                  <thead>
                    <tr className="bg-[#FAF7F2] text-xs font-semibold text-[#8B5E3C] border-b">
                      <th className="p-3 text-left sticky left-0 bg-[#FAF7F2] z-10 min-w-[160px]">Student</th>
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
                    {students.map((student) => (
                      <tr key={student.studentId} className="hover:bg-[#FAF7F2]/50 group">
                        <td className="p-3 font-medium text-[#3D1902] sticky left-0 bg-white group-hover:bg-[#FAF7F2] z-10">
                          {student.lastName} {student.firstName}
                          <div className="text-[10px] text-[#8B5E3C]/60">{student.studentId}</div>
                        </td>
                        {subjects.map((subject) => (
                          <td key={subject.id} className="p-2">
                            <div className="flex gap-1 justify-center">
                              <input
                                type="number" min="0" max="20"
                                aria-label={`${student.lastName} ${subject.name} First Test`}
                                value={scores[student.studentId]?.[subject.id]?.firstTest ?? ""}
                                onChange={(e) => updateScore(student.studentId, subject.id, "firstTest", e.target.value)}
                                className="w-10 p-1 border rounded text-center text-xs" placeholder="0"
                              />
                              <input
                                type="number" min="0" max="20"
                                aria-label={`${student.lastName} ${subject.name} Second Test`}
                                value={scores[student.studentId]?.[subject.id]?.secondTest ?? ""}
                                onChange={(e) => updateScore(student.studentId, subject.id, "secondTest", e.target.value)}
                                className="w-10 p-1 border rounded text-center text-xs" placeholder="0"
                              />
                              <input
                                type="number" min="0" max="60"
                                aria-label={`${student.lastName} ${subject.name} Exam`}
                                value={scores[student.studentId]?.[subject.id]?.exam ?? ""}
                                onChange={(e) => updateScore(student.studentId, subject.id, "exam", e.target.value)}
                                className="w-10 p-1 border rounded text-center text-xs" placeholder="0"
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

            {/* Behaviour & Attendance */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white p-6 rounded-2xl border border-[#8B5E3C]/10 shadow-sm">
                <h2 className="text-lg font-semibold text-[#3D1902] mb-3">📋 Common Behaviour & Attendance</h2>
                <p className="text-xs text-[#8B5E3C]/60 mb-4">Applied to ALL students in your class.</p>
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-[#8B5E3C]">Social Behaviour</h3>
                  {BEHAVIOUR_TRAITS.map((trait) => (
                    <div key={trait.key} className="flex items-center gap-2">
                      <label htmlFor={`tbulk-${trait.key}`} className="text-xs text-[#8B5E3C] w-40">{trait.label}</label>
                      <select
                        id={`tbulk-${trait.key}`} aria-label={`Bulk ${trait.label}`}
                        value={commonBehaviour[trait.key] || ""}
                        onChange={(e) => setCommonBehaviour((prev) => ({ ...prev, [trait.key]: e.target.value }))}
                        className="flex-1 p-1.5 border rounded text-xs"
                      >
                        {RATING_OPTIONS.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                      </select>
                    </div>
                  ))}
                </div>
                <div className="space-y-3 mt-4">
                  <h3 className="text-sm font-medium text-[#8B5E3C]">Attendance</h3>
                  {[
                    { key: "schoolOpened", label: "School Days" },
                    { key: "schoolPresent", label: "Days Present" },
                    { key: "sportOpened", label: "Sports Held" },
                    { key: "sportPresent", label: "Sports Attended" },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center gap-2">
                      <label htmlFor={`tbulk-${item.key}`} className="text-xs text-[#8B5E3C] w-40">{item.label}</label>
                      <input
                        id={`tbulk-${item.key}`} type="number" min="0"
                        value={commonAttendance[item.key] ?? ""}
                        onChange={(e) => setCommonAttendance((prev) => ({
                          ...prev,
                          [item.key]: e.target.value === "" ? null : Number(e.target.value),
                        }))}
                        className="flex-1 p-1.5 border rounded text-xs" placeholder="0"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#8B5E3C]/10 shadow-sm">
                <h2 className="text-lg font-semibold text-[#3D1902] mb-3">📝 Summary</h2>
                <div className="space-y-3">
                  <div>
                    <label htmlFor="tbulk-noInClass" className="block text-xs font-medium text-[#8B5E3C] mb-1">No. in Class</label>
                    <input id="tbulk-noInClass" type="number" min="0" value={commonSummary.noInClass ?? ""} onChange={(e) => setCommonSummary((prev) => ({ ...prev, noInClass: e.target.value === "" ? null : Number(e.target.value) }))} className="w-full p-2 border rounded-lg text-xs" />
                  </div>
                  <div>
                    <label htmlFor="tbulk-evaluation" className="block text-xs font-medium text-[#8B5E3C] mb-1">Evaluation</label>
                    <select id="tbulk-evaluation" value={commonSummary.evaluation} onChange={(e) => setCommonSummary((prev) => ({ ...prev, evaluation: e.target.value }))} className="w-full p-2 border rounded-lg text-xs">
                      <option value="">Select</option>
                      <option value="EXCELLENT">Excellent</option>
                      <option value="GOOD">Good</option>
                      <option value="AVERAGE">Average</option>
                      <option value="BELOW_AVERAGE">Below Average</option>
                      <option value="POOR">Poor</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="tbulk-classTeacherComment" className="block text-xs font-medium text-[#8B5E3C] mb-1">Class Teacher Comment</label>
                    <textarea id="tbulk-classTeacherComment" value={commonSummary.classTeacherComment} onChange={(e) => setCommonSummary((prev) => ({ ...prev, classTeacherComment: e.target.value }))} className="w-full p-2 border rounded-lg text-xs" rows={2} />
                  </div>
                  <div>
                    <label htmlFor="tbulk-nextTermFees" className="block text-xs font-medium text-[#8B5E3C] mb-1">Next Term Fees</label>
                    <input id="tbulk-nextTermFees" type="text" value={commonSummary.nextTermFees} onChange={(e) => setCommonSummary((prev) => ({ ...prev, nextTermFees: e.target.value }))} className="w-full p-2 border rounded-lg text-xs" />
                  </div>
                  <div>
                    <label htmlFor="tbulk-nextTermBegins" className="block text-xs font-medium text-[#8B5E3C] mb-1">Next Term Begins</label>
                    <input id="tbulk-nextTermBegins" type="text" value={commonSummary.nextTermBegins} onChange={(e) => setCommonSummary((prev) => ({ ...prev, nextTermBegins: e.target.value }))} className="w-full p-2 border rounded-lg text-xs" />
                  </div>
                  <div>
                    <label htmlFor="tbulk-headTeacherComment" className="block text-xs font-medium text-[#8B5E3C] mb-1">Head Teacher Comment</label>
                    <textarea id="tbulk-headTeacherComment" value={commonSummary.headTeacherComment} onChange={(e) => setCommonSummary((prev) => ({ ...prev, headTeacherComment: e.target.value }))} className="w-full p-2 border rounded-lg text-xs" rows={2} />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={submitting || !selectedSession}
              className="w-full py-3.5 bg-[#8B5E3C] text-white rounded-xl font-semibold hover:bg-[#6B3F2C] disabled:opacity-50 transition-all"
            >
              {submitting ? "Uploading..." : `Upload Results for ${students.length} Students`}
            </button>
          </>
        )}
      </div>
    </div>
  );
}