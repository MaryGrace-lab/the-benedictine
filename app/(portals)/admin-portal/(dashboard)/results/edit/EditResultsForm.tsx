"use client";

import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import LogoutButton from "@/components/ui/LogoutButton";

// ── Types ──
type Student = {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  class: string;
  studentType: string | null;
};

type Session = { id: string; year: string; term: string };
type Subject = { id: string; name: string };
type ScoreEntry = {
  subjectId: string;
  firstTest: number | null;
  secondTest: number | null;
  exam: number | null;
};
type AttendanceData = Record<string, number | null | string | undefined>;
type SummaryData = Record<string, string | number | null>;

const RATING_OPTIONS = [
  { value: "", label: "Select" },
  { value: "EXCELLENT", label: "Excellent (5)" },
  { value: "GOOD", label: "Good (4)" },
  { value: "AVERAGE", label: "Average (3)" },
  { value: "POOR", label: "Poor (2)" },
  { value: "VERY_POOR", label: "Very Poor (1)" },
];

const BEHAVIOUR_TRAITS = [
  "obedience", "honesty", "responsibility", "selfControl", "leadership",
  "relationshipWithOthers", "gamesAndSports", "health", "neatness", "manipulativeSkill",
];

interface Props {
  initialStudents: Student[];
  initialSessions: Session[];
}

export default function EditResultsForm({ initialStudents, initialSessions }: Props) {
  const [students] = useState<Student[]>(initialStudents);
  const [sessions] = useState<Session[]>(initialSessions);

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedSession, setSelectedSession] = useState("");
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [behaviour, setBehaviour] = useState<Record<string, string>>({});
  const [attendance, setAttendance] = useState<AttendanceData>({});
  const [summaryData, setSummaryData] = useState<SummaryData>({});
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [noResultsMessage, setNoResultsMessage] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadResults = async () => {
    if (!selectedStudent || !selectedSession) return;
    setLoading(true);
    setLoaded(false);
    setIsDirty(false);
    setLoadError(null);
    setNoResultsMessage(null);

    try {
      const res = await fetch(
        `/api/results/get?studentId=${encodeURIComponent(selectedStudent)}&sessionId=${encodeURIComponent(selectedSession)}`
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errData.error || `Request failed (${res.status})`);
      }

      const data = await res.json();

      if (!data.subjects || data.subjects.length === 0) {
        throw new Error("No subjects found for this student’s class/level. Please add subjects in the database.");
      }

      if (!data.resultSummary) {
        const student = students.find(s => s.studentId === selectedStudent);
        const session = sessions.find(s => s.id === selectedSession);
        const studentName = student ? `${student.firstName} ${student.lastName}` : selectedStudent;
        const sessionLabel = session ? `${session.year} – ${session.term} Term` : selectedSession;
        setNoResultsMessage(`No results found for ${studentName} in ${sessionLabel}.`);
        return;
      }

      setSubjects(data.subjects);

      const scoreMap: Record<string, ScoreEntry> = {};
      (data.results || []).forEach((r: any) => {
        scoreMap[r.subjectId] = {
          subjectId: r.subjectId,
          firstTest: r.firstTest,
          secondTest: r.secondTest,
          exam: r.exam,
        };
      });

      setScores(
        data.subjects.map((s: Subject) =>
          scoreMap[s.id] || { subjectId: s.id, firstTest: null, secondTest: null, exam: null }
        )
      );

      const initBehaviour: Record<string, string> = {};
      BEHAVIOUR_TRAITS.forEach((trait) => {
        initBehaviour[trait] = data.socialBehaviour?.[trait] || "";
      });
      setBehaviour(initBehaviour);

      setAttendance({
        schoolOpened: data.attendance?.schoolOpened ?? null,
        schoolPresent: data.attendance?.schoolPresent ?? null,
        sportOpened: data.attendance?.sportOpened ?? null,
        sportPresent: data.attendance?.sportPresent ?? null,
        othersOpened: data.attendance?.othersOpened ?? null,
        othersPresent: data.attendance?.othersPresent ?? null,
        organizedActivitiesOpened: data.attendance?.organizedActivitiesOpened ?? null,
        organizedActivitiesPresent: data.attendance?.organizedActivitiesPresent ?? null,
        remark: data.attendance?.remark || "",
      });

      setSummaryData({
        noInClass: data.resultSummary?.noInClass ?? null,
        evaluation: data.resultSummary?.evaluation || "",
        classTeacherComment: data.resultSummary?.classTeacherComment || "",
        nextTermFees: data.resultSummary?.nextTermFees || "",
        outstandingFees: data.resultSummary?.outstandingFees || "",
        books: data.resultSummary?.books || "",
        nextTermBegins: data.resultSummary?.nextTermBegins || "",
        headTeacherComment: data.resultSummary?.headTeacherComment || "",
        parentName: data.resultSummary?.parentName || "",
      });

      setLoaded(true);
    } catch (error: any) {
      const message = error?.message || "Failed to load results";
      setLoadError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const markDirty = () => {
    if (!isDirty) setIsDirty(true);
  };

  const updateScore = (subjectId: string, field: string, value: string) => {
    markDirty();
    const numValue = value === "" ? null : Number(value);
    setScores((prev) =>
      prev.map((s) => (s.subjectId === subjectId ? { ...s, [field]: numValue } : s))
    );
  };

  const handleSave = async () => {
    if (!window.confirm("Save changes to this student's results?")) return;

    setSaving(true);
    try {
      const sanitizedBehaviour: Record<string, string | null> = {};
      Object.entries(behaviour).forEach(([key, val]) => {
        sanitizedBehaviour[key] = val === "" ? null : val;
      });

      const payload = {
        studentId: selectedStudent,
        sessionId: selectedSession,
        results: scores.map((s) => ({
          subjectId: s.subjectId,
          firstTest: s.firstTest ?? null,
          secondTest: s.secondTest ?? null,
          exam: s.exam ?? null,
        })),
        socialBehaviour: sanitizedBehaviour,
        attendance: {
          schoolOpened: attendance.schoolOpened === "" ? null : attendance.schoolOpened,
          schoolPresent: attendance.schoolPresent === "" ? null : attendance.schoolPresent,
          sportOpened: attendance.sportOpened === "" ? null : attendance.sportOpened,
          sportPresent: attendance.sportPresent === "" ? null : attendance.sportPresent,
          othersOpened: attendance.othersOpened === "" ? null : attendance.othersOpened,
          othersPresent: attendance.othersPresent === "" ? null : attendance.othersPresent,
          organizedActivitiesOpened: attendance.organizedActivitiesOpened === "" ? null : attendance.organizedActivitiesOpened,
          organizedActivitiesPresent: attendance.organizedActivitiesPresent === "" ? null : attendance.organizedActivitiesPresent,
          remark: (attendance.remark as string)?.trim() || null,
        },
        noInClass: summaryData.noInClass === "" ? null : summaryData.noInClass,
        evaluation: summaryData.evaluation || null,
        classTeacherComment: (summaryData.classTeacherComment as string)?.trim() || null,
        nextTermFees: (summaryData.nextTermFees as string)?.trim() || null,
        outstandingFees: (summaryData.outstandingFees as string)?.trim() || null,
        books: (summaryData.books as string)?.trim() || null,
        nextTermBegins: (summaryData.nextTermBegins as string)?.trim() || null,
        headTeacherComment: (summaryData.headTeacherComment as string)?.trim() || null,
        parentName: (summaryData.parentName as string)?.trim() || null,
      };

      const res = await fetch("/api/results/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Results updated successfully!", { duration: 5000 });
        setIsDirty(false);
      } else {
        toast.error(data.error || "Failed to update");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(
      `PERMANENTLY DELETE all results for ${studentName} in ${sessionLabel}?\n\nThis action cannot be undone.`
    )) return;

    setDeleting(true);
    try {
      const res = await fetch("/api/results/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: selectedStudent, sessionId: selectedSession }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setLoaded(false);
        setNoResultsMessage(data.message);
      } else {
        toast.error(data.error || "Delete failed");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setDeleting(false);
    }
  };

  const student = students.find(s => s.studentId === selectedStudent);
  const session = sessions.find(s => s.id === selectedSession);
  const studentName = student ? `${student.firstName} ${student.lastName}` : selectedStudent;
  const sessionLabel = session ? `${session.year} – ${session.term} Term` : selectedSession;

  return (
    <div className="min-h-screen bg-[#FAF7F2] p-4 md:p-6">
      <Toaster position="top-center" />
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#3D1902]">✏️ Edit Results</h1>
            {isDirty && <p className="text-xs text-amber-600 mt-1">⚠️ You have unsaved changes</p>}
          </div>
          <LogoutButton type="admin" />
        </div>

        {/* Selection controls */}
        <div className="bg-white p-6 rounded-2xl border border-[#8B5E3C]/10 shadow-sm mb-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="edit-student-select" className="block text-xs font-medium text-[#8B5E3C] mb-1">Student *</label>
              <select id="edit-student-select" aria-label="Select Student" value={selectedStudent} onChange={(e) => { setSelectedStudent(e.target.value); setLoaded(false); setIsDirty(false); setLoadError(null); setNoResultsMessage(null); }} className="w-full p-2.5 border rounded-lg text-sm">
                <option value="">Select Student</option>
                {students.map((s) => (
                  <option key={s.studentId} value={s.studentId}>{s.lastName} {s.firstName} — {s.class}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="edit-session-select" className="block text-xs font-medium text-[#8B5E3C] mb-1">Session *</label>
              <select id="edit-session-select" aria-label="Select Session" value={selectedSession} onChange={(e) => { setSelectedSession(e.target.value); setLoaded(false); setIsDirty(false); setLoadError(null); setNoResultsMessage(null); }} className="w-full p-2.5 border rounded-lg text-sm">
                <option value="">Select Session</option>
                {sessions.map((s) => (<option key={s.id} value={s.id}>{s.year} — {s.term} Term</option>))}
              </select>
            </div>
            <div className="flex items-end">
              <button onClick={loadResults} disabled={!selectedStudent || !selectedSession || loading} className="w-full py-2.5 bg-[#8B5E3C] text-white rounded-lg font-semibold hover:bg-[#6B3F2C] disabled:opacity-50 transition-all">
                {loading ? "Loading..." : "Load Results"}
              </button>
            </div>
          </div>

          {loadError && (
            <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700 flex items-center justify-between">
              <span>{loadError}</span>
              <button onClick={loadResults} className="ml-4 underline text-red-700 hover:text-red-900">Retry</button>
            </div>
          )}

          {noResultsMessage && (
            <div className="mt-4 p-4 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-800 text-center">
              <p>{noResultsMessage}</p>
              <p className="mt-2 text-xs text-amber-600">Select a different student or session, or upload results first.</p>
            </div>
          )}
        </div>

        {loaded && (
          <>
            <div className="bg-white rounded-2xl border border-[#8B5E3C]/10 shadow-sm overflow-hidden mb-6">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-[#3D1902]">Subject Scores</h2>
                <p className="text-xs text-[#8B5E3C]/60">{studentName} – {sessionLabel}</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm" aria-label="Edit Subject Scores">
                  <thead>
                    <tr className="bg-[#FAF7F2] text-xs font-semibold text-[#8B5E3C] border-b">
                      <th className="p-3 text-left">Subject</th>
                      <th className="p-3 text-center">1st Test (20)</th>
                      <th className="p-3 text-center">2nd Test (20)</th>
                      <th className="p-3 text-center">Exam (60)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {subjects.map((subject) => {
                      const score = scores.find((s) => s.subjectId === subject.id);
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
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white p-6 rounded-2xl border border-[#8B5E3C]/10 shadow-sm">
                <h2 className="text-lg font-semibold text-[#3D1902] mb-4">Social Behaviour</h2>
                <div className="space-y-3">
                  {BEHAVIOUR_TRAITS.map((trait) => (
                    <div key={trait}>
                      <label htmlFor={`edit-${trait}`} className="block text-xs font-medium text-[#8B5E3C] mb-1 capitalize">{trait.replace(/([A-Z])/g, " $1").trim()}</label>
                      <select id={`edit-${trait}`} aria-label={`Edit ${trait.replace(/([A-Z])/g, " $1").trim()}`} value={behaviour[trait] || ""} onChange={(e) => { setBehaviour((prev) => ({ ...prev, [trait]: e.target.value })); markDirty(); }} className="w-full p-2 border rounded-lg text-xs">
                        {RATING_OPTIONS.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#8B5E3C]/10 shadow-sm">
                <h2 className="text-lg font-semibold text-[#3D1902] mb-4">Attendance & Summary</h2>
                <div className="space-y-3">
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
                      <label htmlFor={`edit-${item.key}`} className="block text-xs font-medium text-[#8B5E3C] mb-1">{item.label}</label>
                      <input id={`edit-${item.key}`} type="number" min="0" aria-label={item.label} value={attendance[item.key] ?? ""} onChange={(e) => { setAttendance((prev) => ({ ...prev, [item.key]: e.target.value === "" ? null : Number(e.target.value) })); markDirty(); }} className="w-full p-2 border rounded-lg text-xs" />
                    </div>
                  ))}
                  <div>
                    <label htmlFor="edit-noInClass" className="block text-xs font-medium text-[#8B5E3C] mb-1">No. in Class</label>
                    <input id="edit-noInClass" type="number" min="0" aria-label="Number in Class" value={summaryData.noInClass ?? ""} onChange={(e) => { setSummaryData((prev) => ({ ...prev, noInClass: e.target.value === "" ? null : Number(e.target.value) })); markDirty(); }} className="w-full p-2 border rounded-lg text-xs" />
                  </div>
                  <div>
                    <label htmlFor="edit-evaluation" className="block text-xs font-medium text-[#8B5E3C] mb-1">Evaluation</label>
                    <select id="edit-evaluation" aria-label="Evaluation" value={summaryData.evaluation || ""} onChange={(e) => { setSummaryData((prev) => ({ ...prev, evaluation: e.target.value })); markDirty(); }} className="w-full p-2 border rounded-lg text-xs">
                      <option value="">Select</option>
                      <option value="EXCELLENT">Excellent</option>
                      <option value="GOOD">Good</option>
                      <option value="AVERAGE">Average</option>
                      <option value="BELOW_AVERAGE">Below Average</option>
                      <option value="POOR">Poor</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="edit-classTeacherComment" className="block text-xs font-medium text-[#8B5E3C] mb-1">Class Teacher Comment</label>
                    <textarea id="edit-classTeacherComment" aria-label="Class Teacher Comment" value={summaryData.classTeacherComment || ""} onChange={(e) => { setSummaryData((prev) => ({ ...prev, classTeacherComment: e.target.value })); markDirty(); }} className="w-full p-2 border rounded-lg text-xs" rows={2} />
                  </div>
                </div>
              </div>
            </div>

            {/* Save and Delete buttons */}
            <div className="flex gap-4">
              <button onClick={handleSave} disabled={saving} className="flex-1 py-3.5 bg-[#8B5E3C] text-white rounded-xl font-semibold hover:bg-[#6B3F2C] disabled:opacity-50 transition-all">
                {saving ? "Saving Changes..." : "Save Changes"}
              </button>
              <button onClick={handleDelete} disabled={deleting} className="flex-1 py-3.5 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 disabled:opacity-50 transition-all">
                {deleting ? "Deleting..." : "Delete Results"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}