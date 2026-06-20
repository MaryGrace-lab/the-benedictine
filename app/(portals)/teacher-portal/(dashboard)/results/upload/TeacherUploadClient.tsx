"use client";

// ──────────────────────────────────────────────
// Teacher Upload Client — Client Component
// Full result sheet: scores, behaviour, attendance, summary.
// Receives initial data as props from server.
// ──────────────────────────────────────────────

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import LogoutButton from "@/components/ui/LogoutButton";

// ── Types ──
type Subject = { id: string; name: string };

type Student = {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  class: string;
  studentType: string | null;
};

type Session = { id: string; year: string; term: string };

type SubjectScore = {
  subjectId: string;
  firstTest: number | null;
  secondTest: number | null;
  exam: number | null;
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

type LastUpload = {
  studentName: string;
  average: number;
  remark: string;
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

interface Props {
  initialStudents: Student[];
  initialSessions: Session[];
}

export default function TeacherUploadClient({ initialStudents, initialSessions }: Props) {
  const router = useRouter();

  const [students] = useState<Student[]>(initialStudents);
  const [sessions] = useState<Session[]>(initialSessions);

  // Form state
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastUpload, setLastUpload] = useState<LastUpload>(null);

  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedSession, setSelectedSession] = useState("");
  const [noInClass, setNoInClass] = useState<number | null>(null);
  const [evaluation, setEvaluation] = useState("");
  const [classTeacherComment, setClassTeacherComment] = useState("");
  const [nextTermFees, setNextTermFees] = useState("");
  const [outstandingFees, setOutstandingFees] = useState("");
  const [books, setBooks] = useState("");
  const [nextTermBegins, setNextTermBegins] = useState("");
  const [headTeacherComment, setHeadTeacherComment] = useState("");
  const [parentName, setParentName] = useState("");

  const [scores, setScores] = useState<SubjectScore[]>([]);
  const [behaviour, setBehaviour] = useState<Record<string, string>>({});
  const [attendance, setAttendance] = useState<AttendanceData>({
    schoolOpened: null,
    schoolPresent: null,
    sportOpened: null,
    sportPresent: null,
    othersOpened: null,
    othersPresent: null,
    organizedActivitiesOpened: null,
    organizedActivitiesPresent: null,
    remark: "",
  });

  // Load JSS subjects on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/subjects?level=JSS");
        const data = await res.json();
        setSubjects(data.subjects || []);
        if (data.subjects?.length > 0) {
          setScores(
            data.subjects.map((s: Subject) => ({
              subjectId: s.id,
              firstTest: null,
              secondTest: null,
              exam: null,
            }))
          );
        }
        const initialBehaviour: Record<string, string> = {};
        BEHAVIOUR_TRAITS.forEach((trait) => {
          initialBehaviour[trait.key] = "";
        });
        setBehaviour(initialBehaviour);
      } catch {
        toast.error("Failed to load form data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Reload subjects when student changes (for SSS streams)
  useEffect(() => {
    if (!selectedStudent) return;
    const student = students.find((s) => s.studentId === selectedStudent);
    if (!student) return;
    const level = student.class?.startsWith("SSS") ? "SSS" : "JSS";
    const stream = student.studentType || "";
    const url = stream
      ? `/api/subjects?level=${level}&stream=${stream}`
      : `/api/subjects?level=${level}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setSubjects(data.subjects || []);
        setScores(
          (data.subjects || []).map((s: Subject) => ({
            subjectId: s.id,
            firstTest: null,
            secondTest: null,
            exam: null,
          }))
        );
      });
  }, [selectedStudent, students]);

  const resetForm = () => {
    setSelectedStudent("");
    setSelectedSession("");
    setNoInClass(null);
    setEvaluation("");
    setClassTeacherComment("");
    setNextTermFees("");
    setOutstandingFees("");
    setBooks("");
    setNextTermBegins("");
    setHeadTeacherComment("");
    setParentName("");

    setScores(
      subjects.length > 0
        ? subjects.map((s) => ({
            subjectId: s.id,
            firstTest: null,
            secondTest: null,
            exam: null,
          }))
        : []
    );

    const initialBehaviour: Record<string, string> = {};
    BEHAVIOUR_TRAITS.forEach((trait) => {
      initialBehaviour[trait.key] = "";
    });
    setBehaviour(initialBehaviour);

    setAttendance({
      schoolOpened: null,
      schoolPresent: null,
      sportOpened: null,
      sportPresent: null,
      othersOpened: null,
      othersPresent: null,
      organizedActivitiesOpened: null,
      organizedActivitiesPresent: null,
      remark: "",
    });
  };

  const updateScore = (
    subjectId: string,
    field: "firstTest" | "secondTest" | "exam",
    value: string
  ) => {
    const numValue = value === "" ? null : Number(value);
    setScores((prev) =>
      prev.map((s) => (s.subjectId === subjectId ? { ...s, [field]: numValue } : s))
    );
  };

  const updateAttendance = (field: string, value: string) => {
    const numValue = value === "" ? null : Number(value);
    setAttendance((prev) => ({ ...prev, [field]: numValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !selectedSession) {
      toast.error("Please select a student and session");
      return;
    }
    setSubmitting(true);

    const sanitizedBehaviour: Record<string, string | null> = {};
    Object.entries(behaviour).forEach(([key, val]) => {
      sanitizedBehaviour[key] = val === "" ? null : val;
    });

    try {
      const res = await fetch("/api/results/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: selectedStudent,
          sessionId: selectedSession,
          results: scores,
          socialBehaviour: sanitizedBehaviour,
          attendance: { ...attendance, remark: attendance.remark.trim() || null },
          noInClass,
          evaluation: evaluation || null,
          classTeacherComment: classTeacherComment.trim() || null,
          nextTermFees: nextTermFees.trim() || null,
          outstandingFees: outstandingFees.trim() || null,
          books: books.trim() || null,
          nextTermBegins: nextTermBegins.trim() || null,
          headTeacherComment: headTeacherComment.trim() || null,
          parentName: parentName.trim() || null,
        }),
      });

      const result = await res.json();
      if (res.ok) {
        const student = students.find((s) => s.studentId === selectedStudent);
        setLastUpload({
          studentName: student
            ? `${student.firstName} ${student.lastName}`
            : selectedStudent,
          average: result.summary.calculatedAverage,
          remark: result.summary.systemRemark,
        });
        setShowSuccess(true);
      } else {
        toast.error(result.error || "Upload failed");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
        <p className="text-[#8B5E3C] animate-pulse">Loading form data...</p>
      </div>
    );
  }

  // ── Success Screen ──
  if (showSuccess && lastUpload) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4">
        <Toaster position="top-center" />
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#3D1902] mb-2">Result Uploaded Successfully!</h1>
          <div className="bg-[#FAF7F2] rounded-xl p-4 mb-6 text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-[#8B5E3C]">Student:</span>
              <span className="font-semibold text-[#3D1902]">{lastUpload.studentName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8B5E3C]">Average:</span>
              <span className="font-semibold text-[#3D1902]">{lastUpload.average}%</span>
            </div>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => {
                setShowSuccess(false);
                setLastUpload(null);
                resetForm();
              }}
              className="w-full py-3 bg-[#8B5E3C] text-white rounded-xl font-semibold hover:bg-[#6B3F2C] transition-all"
            >
              📝 Add Another Student
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

  // ── Upload Form ──
  return (
    <div className="min-h-screen bg-[#FAF7F2] p-4 md:p-6">
      <Toaster position="top-center" />
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#3D1902]">📝 Upload Student Results</h1>
          <LogoutButton type="teacher" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Student & Session */}
          <div className="bg-white p-6 rounded-2xl border border-[#8B5E3C]/10 shadow-sm">
            <h2 className="text-md font-semibold text-[#3D1902] mb-4">Student & Academic Term</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="student-select" className="block text-xs font-medium text-[#8B5E3C] mb-1">
                  Student *
                </label>
                <select
                  id="student-select" aria-label="Select Student"
                  value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}
                  className="w-full p-2.5 border rounded-lg text-sm" required
                >
                  <option value="">Select Student</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.studentId}>
                      {s.lastName.toUpperCase()}, {s.firstName} — {s.class}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="session-select" className="block text-xs font-medium text-[#8B5E3C] mb-1">
                  Session *
                </label>
                <select
                  id="session-select" aria-label="Select Session"
                  value={selectedSession} onChange={(e) => setSelectedSession(e.target.value)}
                  className="w-full p-2.5 border rounded-lg text-sm" required
                >
                  <option value="">Select Session</option>
                  {sessions.map((s) => (
                    <option key={s.id} value={s.id}>{s.year} — {s.term} Term</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Subject Scores Table */}
          <div className="bg-white rounded-2xl border border-[#8B5E3C]/10 shadow-sm overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-md font-semibold text-[#3D1902]">Subject Scores</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#FAF7F2] text-xs font-semibold text-[#8B5E3C] border-b">
                    <th className="p-3 text-left">Subject</th>
                    <th className="p-3 text-center">1st Test (20)</th>
                    <th className="p-3 text-center">2nd Test (20)</th>
                    <th className="p-3 text-center">Exam (60)</th>
                    <th className="p-3 text-center">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {subjects.map((subject) => {
                    const score = scores.find((s) => s.subjectId === subject.id);
                    const total =
                      score && score.firstTest !== null && score.secondTest !== null && score.exam !== null
                        ? score.firstTest + score.secondTest + score.exam
                        : "—";
                    return (
                      <tr key={subject.id} className="hover:bg-[#FAF7F2]/50">
                        <td className="p-3 font-medium text-[#3D1902]">{subject.name}</td>
                        <td className="p-3 text-center">
                          <input type="number" min="0" max="20" aria-label={`${subject.name} First Test`} value={score?.firstTest ?? ""} onChange={(e) => updateScore(subject.id, "firstTest", e.target.value)} className="w-16 p-1.5 border rounded text-center" />
                        </td>
                        <td className="p-3 text-center">
                          <input type="number" min="0" max="20" aria-label={`${subject.name} Second Test`} value={score?.secondTest ?? ""} onChange={(e) => updateScore(subject.id, "secondTest", e.target.value)} className="w-16 p-1.5 border rounded text-center" />
                        </td>
                        <td className="p-3 text-center">
                          <input type="number" min="0" max="60" aria-label={`${subject.name} Exam`} value={score?.exam ?? ""} onChange={(e) => updateScore(subject.id, "exam", e.target.value)} className="w-16 p-1.5 border rounded text-center" />
                        </td>
                        <td className="p-3 text-center font-bold">{total}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Social Behaviour */}
          <div className="bg-white p-6 rounded-2xl border border-[#8B5E3C]/10 shadow-sm">
            <h2 className="text-md font-semibold text-[#3D1902] mb-4">Social Behaviour</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {BEHAVIOUR_TRAITS.map((trait) => (
                <div key={trait.key}>
                  <label htmlFor={`behaviour-${trait.key}`} className="block text-xs font-medium text-[#8B5E3C] mb-1">{trait.label}</label>
                  <select id={`behaviour-${trait.key}`} aria-label={`Rating for ${trait.label}`} value={behaviour[trait.key] || ""} onChange={(e) => setBehaviour((prev) => ({ ...prev, [trait.key]: e.target.value }))} className="w-full p-2 border rounded-lg text-xs">
                    {RATING_OPTIONS.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Attendance */}
          <div className="bg-white p-6 rounded-2xl border border-[#8B5E3C]/10 shadow-sm">
            <h2 className="text-md font-semibold text-[#3D1902] mb-4">Attendance</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { key: "schoolOpened", label: "School Days This Term" },
                { key: "schoolPresent", label: "Days Present" },
                { key: "sportOpened", label: "Sports Sessions Held" },
                { key: "sportPresent", label: "Sports Attended" },
                { key: "othersOpened", label: "Other Events Held" },
                { key: "othersPresent", label: "Other Events Attended" },
                { key: "organizedActivitiesOpened", label: "Club Activities Held" },
                { key: "organizedActivitiesPresent", label: "Club Activities Attended" },
              ].map((item) => (
                <div key={item.key}>
                  <label htmlFor={`attendance-${item.key}`} className="block text-xs font-medium text-[#8B5E3C] mb-1">{item.label}</label>
                  <input id={`attendance-${item.key}`} type="number" min="0" aria-label={item.label} value={attendance[item.key as keyof AttendanceData] ?? ""} onChange={(e) => updateAttendance(item.key, e.target.value)} className="w-full p-2 border rounded-lg text-xs" />
                </div>
              ))}
              <div>
                <label htmlFor="attendance-remark" className="block text-xs font-medium text-[#8B5E3C] mb-1">Remark</label>
                <input id="attendance-remark" type="text" aria-label="Attendance Remark" value={attendance.remark} onChange={(e) => setAttendance((prev) => ({ ...prev, remark: e.target.value }))} className="w-full p-2 border rounded-lg text-xs" placeholder="e.g. Good attendance" />
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white p-6 rounded-2xl border border-[#8B5E3C]/10 shadow-sm">
            <h2 className="text-md font-semibold text-[#3D1902] mb-4">Summary & Comments</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div><label htmlFor="no-in-class" className="block text-xs font-medium text-[#8B5E3C] mb-1">Number in Class</label><input id="no-in-class" type="number" min="0" value={noInClass ?? ""} onChange={(e) => setNoInClass(e.target.value === "" ? null : Number(e.target.value))} className="w-full p-2.5 border rounded-lg text-sm" /></div>
              <div><label htmlFor="evaluation-select" className="block text-xs font-medium text-[#8B5E3C] mb-1">Evaluation</label><select id="evaluation-select" value={evaluation} onChange={(e) => setEvaluation(e.target.value)} className="w-full p-2.5 border rounded-lg text-sm">{EVALUATION_OPTIONS.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}</select></div>
              <div className="md:col-span-2"><label htmlFor="class-teacher-comment" className="block text-xs font-medium text-[#8B5E3C] mb-1">Class Teacher's Comment</label><textarea id="class-teacher-comment" value={classTeacherComment} onChange={(e) => setClassTeacherComment(e.target.value)} className="w-full p-2.5 border rounded-lg text-sm" rows={2} /></div>
              <div><label htmlFor="next-term-fees" className="block text-xs font-medium text-[#8B5E3C] mb-1">Next Term Fees</label><input id="next-term-fees" type="text" value={nextTermFees} onChange={(e) => setNextTermFees(e.target.value)} className="w-full p-2.5 border rounded-lg text-sm" /></div>
              <div><label htmlFor="outstanding-fees" className="block text-xs font-medium text-[#8B5E3C] mb-1">Outstanding Fees</label><input id="outstanding-fees" type="text" value={outstandingFees} onChange={(e) => setOutstandingFees(e.target.value)} className="w-full p-2.5 border rounded-lg text-sm" /></div>
              <div><label htmlFor="next-term-begins" className="block text-xs font-medium text-[#8B5E3C] mb-1">Next Term Begins</label><input id="next-term-begins" type="text" value={nextTermBegins} onChange={(e) => setNextTermBegins(e.target.value)} className="w-full p-2.5 border rounded-lg text-sm" /></div>
              <div><label htmlFor="books" className="block text-xs font-medium text-[#8B5E3C] mb-1">Books</label><input id="books" type="text" value={books} onChange={(e) => setBooks(e.target.value)} className="w-full p-2.5 border rounded-lg text-sm" /></div>
              <div className="md:col-span-2"><label htmlFor="head-teacher-comment" className="block text-xs font-medium text-[#8B5E3C] mb-1">Head Teacher's Comment</label><textarea id="head-teacher-comment" value={headTeacherComment} onChange={(e) => setHeadTeacherComment(e.target.value)} className="w-full p-2.5 border rounded-lg text-sm" rows={2} /></div>
              <div><label htmlFor="parent-name" className="block text-xs font-medium text-[#8B5E3C] mb-1">Parent/Guardian Name</label><input id="parent-name" type="text" value={parentName} onChange={(e) => setParentName(e.target.value)} className="w-full p-2.5 border rounded-lg text-sm" /></div>
            </div>
          </div>

          {/* Submit */}
          <button type="submit" disabled={submitting} className="w-full py-3.5 bg-[#8B5E3C] text-white rounded-xl font-semibold hover:bg-[#6B3F2C] active:scale-[0.99] disabled:opacity-40 transition-all">
            {submitting ? "Uploading Results..." : "Commit Full Student Record"}
          </button>
        </form>
      </div>
    </div>
  );
}