// app/(portals)/student-portal/(dashboard)/results/page.tsx

// ──────────────────────────────────────────────
// Student Results Page — Server Component
// Displays full report card with session selector.
// Print-friendly with school branding.
// ──────────────────────────────────────────────

import { getStudentFromSession } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import LogoutButton from "@/components/ui/LogoutButton";
import PrintButton from "@/components/ui/PrintButton";
import SessionSelector from "./SessionSelector";

type AvailableSession = {
  id: string;
  year: string;
  term: string;
  isActive: boolean;
};

export const dynamic = "force-dynamic";
export default async function StudentResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ session?: string }>;
}) {
  const sessionStudentId = await getStudentFromSession();
  const params = await searchParams;

  // Auth guard
  if (!sessionStudentId) {
    redirect("/student-portal/login");
  }

  // Get student profile
  const studentProfile = await prisma.student.findUnique({
    where: { studentId: sessionStudentId },
  });

  if (!studentProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-red-500 font-medium">Student account profile not found.</p>
      </div>
    );
  }

  // Get all sessions that have results for this student
  const availableSessions: AvailableSession[] = await prisma.academicSession.findMany({
    where: {
      resultSummaries: {
        some: { studentId: studentProfile.id },
      },
    },
    orderBy: { createdAt: "desc" },
    select: { id: true, year: true, term: true, isActive: true },
  });

  if (!availableSessions.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500 font-medium">No results available for any session yet.</p>
      </div>
    );
  }

  // Determine which session to display
  const selectedSessionId = params.session || availableSessions[0].id;

  let activeSession = await prisma.academicSession.findUnique({
    where: { id: selectedSessionId },
  });

  // Fallback if selected session is invalid
  if (!activeSession) {
    activeSession = await prisma.academicSession.findUnique({
      where: { id: availableSessions[0].id },
    });

    if (!activeSession) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <p className="text-slate-500 font-medium">Session data unavailable.</p>
        </div>
      );
    }
  }

  // Fetch all result data in parallel
  const [results, socialBehaviour, attendance, resultSummary] = await Promise.all([
    prisma.result.findMany({
      where: { studentId: studentProfile.id, sessionId: activeSession.id },
      include: { subject: true },
      orderBy: { subject: { name: "asc" } },
    }),
    prisma.socialBehaviour.findUnique({
      where: {
        studentId_sessionId: {
          studentId: studentProfile.id,
          sessionId: activeSession.id,
        },
      },
    }),
    prisma.attendance.findUnique({
      where: {
        studentId_sessionId: {
          studentId: studentProfile.id,
          sessionId: activeSession.id,
        },
      },
    }),
    prisma.resultSummary.findUnique({
      where: {
        studentId_sessionId: {
          studentId: studentProfile.id,
          sessionId: activeSession.id,
        },
      },
    }),
  ]);

  // No result summary = no results for this session
  if (!resultSummary) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-4 no-print">
            <SessionSelector sessions={availableSessions} currentSessionId={activeSession.id} />
            <LogoutButton type="student" />
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
            <p className="text-slate-500 font-medium">No results compiled for this session yet.</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Render Report Card ──
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      {/* Toolbar — hidden when printing */}
      <div className="max-w-4xl mx-auto mb-4 flex justify-between items-center no-print">
        <div className="flex items-center gap-4">
          <SessionSelector sessions={availableSessions} currentSessionId={activeSession.id} />
          <PrintButton />
          <Link
            href="/student-portal/settings"
            className="text-sm text-slate-600 hover:text-slate-800 font-medium"
          >
            � Settings
          </Link>
        </div>
        <LogoutButton type="student" />
      </div>

      {/* Report Card — printable area */}
      <div className="print-area max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-10">
        {/* Header with Logo */}
        <div className="text-center mb-8 border-b pb-6">
          <Image
            src="/logo.jpg"
            alt="The Benedictine Academy Logo"
            width={80}
            height={80}
            className="mx-auto mb-3 rounded-full"
          />
          <h1 className="text-xl md:text-2xl font-bold text-slate-900">THE BENEDICTINE ACADEMY</h1>
          <p className="text-sm text-slate-500">Catholic Education Centre</p>
          <p className="text-sm text-slate-500">Learning in Wisdom</p>
          <h2 className="text-lg font-semibold mt-4 text-slate-700">
            Term Examination Result — {activeSession.year} {activeSession.term} Term
          </h2>
        </div>

        {/* Student Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-sm text-slate-700 border-b pb-6">
          <div><span className="font-semibold text-slate-500">Name:</span> {studentProfile.firstName} {studentProfile.lastName}</div>
          <div><span className="font-semibold text-slate-500">Class:</span> {studentProfile.class}</div>
          <div><span className="font-semibold text-slate-500">No. in Class:</span> {resultSummary.noInClass ?? "—"}</div>
          <div><span className="font-semibold text-slate-500">Evaluation:</span> {resultSummary.evaluation ?? "—"}</div>
        </div>

        {/* Subject Scores Table */}
        <div className="mb-8">
          <h3 className="font-semibold text-lg mb-3 text-slate-800">Performance in Subjects</h3>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="p-3 text-left font-semibold">Subject</th>
                  <th className="p-3 text-center font-semibold">1st CAT (20)</th>
                  <th className="p-3 text-center font-semibold">2nd CAT (20)</th>
                  <th className="p-3 text-center font-semibold">Exam (60)</th>
                  <th className="p-3 text-center font-semibold">Total (100)</th>
                  <th className="p-3 text-center font-semibold">Grade</th>
                </tr>
              </thead>
              <tbody className="text-slate-700 divide-y divide-slate-100">
                {results.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3 font-medium">{r.subject.name}</td>
                    <td className="p-3 text-center">{r.firstTest ?? "—"}</td>
                    <td className="p-3 text-center">{r.secondTest ?? "—"}</td>
                    <td className="p-3 text-center">{r.exam ?? "—"}</td>
                    <td className="p-3 text-center font-semibold text-slate-900">{r.total ?? "—"}</td>
                    <td className="p-3 text-center font-bold text-slate-900">{r.grade ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 p-4 bg-slate-50 rounded-xl text-sm font-medium text-slate-700">
            <div><span className="text-slate-500">Cumulative:</span> {resultSummary.totalCumulative}</div>
            <div><span className="text-slate-500">Total Score:</span> {resultSummary.totalScore}</div>
            <div><span className="text-slate-500">Average:</span> {resultSummary.percentageAvg}%</div>
            <div><span className="text-slate-500">Remark:</span> {resultSummary.remark}</div>
          </div>
        </div>

        {/* Social Behaviour */}
        {socialBehaviour && (
          <div className="mb-8">
            <h3 className="font-semibold text-lg mb-3 text-slate-800">Social Behaviour</h3>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="p-3 text-left font-semibold">Trait</th>
                    <th className="p-3 text-center font-semibold">Rating</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700 divide-y divide-slate-100">
                  {[
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
                  ].map((trait) => {
                    const value = (socialBehaviour as unknown as Record<string, string | null>)[trait.key];
                    return (
                      <tr key={trait.key} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-3 font-medium">{trait.label}</td>
                        <td className="p-3 text-center font-semibold text-slate-900">
                          {value ?? "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="text-sm mt-3 p-3 bg-slate-50 rounded-xl text-slate-700">
              <span className="font-semibold text-slate-500">Behaviour Remark:</span> {socialBehaviour.remark}
            </div>
          </div>
        )}

        {/* Attendance */}
        {attendance && (
          <div className="mb-8">
            <h3 className="font-semibold text-lg mb-3 text-slate-800">Attendance</h3>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="p-3 text-left font-semibold">Category</th>
                    <th className="p-3 text-center font-semibold">Times Opened</th>
                    <th className="p-3 text-center font-semibold">Times Present</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700 divide-y divide-slate-100">
                  {[
                    ["School Sessions", "schoolOpened", "schoolPresent"],
                    ["Sports / Athletics", "sportOpened", "sportPresent"],
                    ["Other Gatherings", "othersOpened", "othersPresent"],
                    ["Organized Activities", "organizedActivitiesOpened", "organizedActivitiesPresent"],
                  ].map(([label, opened, present]) => {
                    const attend = attendance as unknown as Record<string, number | null>;
                    return (
                      <tr key={label} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-3 font-medium">{label}</td>
                        <td className="p-3 text-center">{attend[opened] ?? "—"}</td>
                        <td className="p-3 text-center">{attend[present] ?? "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Comments & Fees */}
        <div className="text-sm space-y-3 border-t pt-6 text-slate-700">
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="font-semibold text-slate-600">Class Teacher's Comment:</span> {resultSummary.classTeacherComment || "—"}
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="font-semibold text-slate-600">Head Teacher's Comment:</span> {resultSummary.headTeacherComment || "—"}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="font-semibold text-slate-600">Next Term Begins:</span> {resultSummary.nextTermBegins || "—"}
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="font-semibold text-slate-600">Next Term Fees:</span> {resultSummary.nextTermFees || "—"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}