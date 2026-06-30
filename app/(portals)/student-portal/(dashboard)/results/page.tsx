// app/(portals)/student-portal/(dashboard)/results/page.tsx
// ──────────────────────────────────────────────
// Student Results Page — Server Component
// Displays full report card with session selector.
// Print-friendly with school branding.
// Mobile responsive.
// ──────────────────────────────────────────────

import { getStudentFromSession } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import PrintButton from "@/components/ui/PrintButton";
import SessionSelector from "./SessionSelector";
import { FileText } from "lucide-react";
import type { Rating } from "@prisma/client";

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

  if (!sessionStudentId) {
    redirect("/student-portal/login");
  }

  const studentProfile = await prisma.student.findUnique({
    where: { studentId: sessionStudentId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      class: true,
      studentId: true,
    },
  });

  if (!studentProfile) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <FileText size={48} className="mx-auto text-red-300 mb-3" />
          <p className="text-red-500 font-medium">Student account not found.</p>
          <Link href="/student-portal/dashboard" className="text-sm text-[#8B5E3C] hover:underline mt-2 inline-block">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

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
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <FileText size={48} className="mx-auto text-[#8B5E3C]/20 mb-3" />
          <p className="text-[#8B5E3C]/50 font-medium">No results available yet.</p>
          <Link href="/student-portal/dashboard" className="text-sm text-[#8B5E3C] hover:underline mt-2 inline-block">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const selectedSessionId = params.session || availableSessions[0].id;

  let activeSession = await prisma.academicSession.findUnique({
    where: { id: selectedSessionId },
  });

  if (!activeSession) {
    activeSession = await prisma.academicSession.findUnique({
      where: { id: availableSessions[0].id },
    });

    if (!activeSession) {
      return (
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-[#8B5E3C]/50 font-medium">Session data unavailable.</p>
        </div>
      );
    }
  }

  const [results, socialBehaviour, attendance, resultSummary] = await Promise.all([
    prisma.result.findMany({
      where: { studentId: studentProfile.id, sessionId: activeSession.id },
      include: { subject: { select: { name: true } } },
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

  if (!resultSummary) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 no-print">
          <SessionSelector sessions={availableSessions} currentSessionId={activeSession.id} />
          <Link href="/student-portal/dashboard" className="text-sm text-[#8B5E3C] hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
        <div className="bg-white rounded-2xl border border-[#8B5E3C]/10 p-10 text-center">
          <FileText size={48} className="mx-auto text-[#8B5E3C]/15 mb-3" />
          <p className="text-[#8B5E3C]/50 font-medium">No results compiled for this session yet.</p>
        </div>
      </div>
    );
  }

  // ── Helper: Get rating value or "—" ──
  const getRatingDisplay = (rating: Rating | null): string => {
    if (rating === null) return "—";
    return rating;
  };

  // ── Helper: Get number value or "—" ──
  const getNumberDisplay = (value: number | null): string => {
    if (value === null) return "—";
    return String(value);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar — hidden when printing */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 no-print">
        <div className="flex items-center gap-3">
          <SessionSelector sessions={availableSessions} currentSessionId={activeSession.id} />
          <PrintButton />
        </div>
        <Link href="/student-portal/dashboard" className="text-sm text-[#8B5E3C] hover:underline">
          ← Back to Dashboard
        </Link>
      </div>

      {/* Report Card — printable area */}
      <div className="print-area bg-white rounded-2xl border border-[#8B5E3C]/10 shadow-sm p-4 sm:p-6 md:p-10">
        {/* Header with Logo */}
        <div className="text-center mb-6 border-b pb-6">
          <Image
            src="/logo.jpg"
            alt="The Benedictine Academy Logo"
            width={80}
            height={80}
            className="mx-auto mb-3 rounded-full"
          />
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900">
            THE BENEDICTINE ACADEMY
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">Catholic Education Centre</p>
          <p className="text-xs sm:text-sm text-slate-500">Learning in Wisdom</p>
          <h2 className="text-base sm:text-lg font-semibold mt-4 text-slate-700">
            Term Examination Result — {activeSession.year} {activeSession.term} Term
          </h2>
        </div>

        {/* Student Info */}
        <div className="grid grid-cols-2 gap-3 mb-6 text-xs sm:text-sm text-slate-700 border-b pb-6">
          <div><span className="font-semibold text-slate-500">Name:</span> {studentProfile.firstName} {studentProfile.lastName}</div>
          <div><span className="font-semibold text-slate-500">Class:</span> {studentProfile.class}</div>
          <div><span className="font-semibold text-slate-500">No. in Class:</span> {resultSummary.noInClass ?? "—"}</div>
          <div><span className="font-semibold text-slate-500">Evaluation:</span> {resultSummary.evaluation ?? "—"}</div>
        </div>

        {/* Subject Scores Table */}
        <div className="mb-6">
          <h3 className="font-semibold text-base sm:text-lg mb-3 text-slate-800">Performance in Subjects</h3>
          <div className="overflow-x-auto -mx-4 sm:mx-0 rounded-xl border border-slate-200">
            <table className="w-full text-xs sm:text-sm min-w-[550px]">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="p-2 sm:p-3 text-left font-semibold">Subject</th>
                  <th className="p-2 sm:p-3 text-center font-semibold">1st CAT (20)</th>
                  <th className="p-2 sm:p-3 text-center font-semibold">2nd CAT (20)</th>
                  <th className="p-2 sm:p-3 text-center font-semibold">Exam (60)</th>
                  <th className="p-2 sm:p-3 text-center font-semibold">Total (100)</th>
                  <th className="p-2 sm:p-3 text-center font-semibold">Grade</th>
                </tr>
              </thead>
              <tbody className="text-slate-700 divide-y divide-slate-100">
                {results.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-2 sm:p-3 font-medium">{r.subject.name}</td>
                    <td className="p-2 sm:p-3 text-center">{r.firstTest ?? "—"}</td>
                    <td className="p-2 sm:p-3 text-center">{r.secondTest ?? "—"}</td>
                    <td className="p-2 sm:p-3 text-center">{r.exam ?? "—"}</td>
                    <td className="p-2 sm:p-3 text-center font-semibold text-slate-900">{r.total ?? "—"}</td>
                    <td className="p-2 sm:p-3 text-center font-bold text-slate-900">{r.grade ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mt-4 p-3 sm:p-4 bg-slate-50 rounded-xl text-xs sm:text-sm font-medium text-slate-700">
            <div><span className="text-slate-500">Cumulative:</span> {resultSummary.totalCumulative}</div>
            <div><span className="text-slate-500">Total Score:</span> {resultSummary.totalScore}</div>
            <div><span className="text-slate-500">Average:</span> {resultSummary.percentageAvg}%</div>
            <div><span className="text-slate-500">Remark:</span> {resultSummary.remark}</div>
          </div>
        </div>

        {/* Social Behaviour */}
        {socialBehaviour && (
          <div className="mb-6">
            <h3 className="font-semibold text-base sm:text-lg mb-3 text-slate-800">Social Behaviour</h3>
            <div className="overflow-x-auto -mx-4 sm:mx-0 rounded-xl border border-slate-200">
              <table className="w-full text-xs sm:text-sm min-w-[400px]">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="p-2 sm:p-3 text-left font-semibold">Trait</th>
                    <th className="p-2 sm:p-3 text-center font-semibold">Rating</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700 divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-2 sm:p-3 font-medium">Obedience</td>
                    <td className="p-2 sm:p-3 text-center font-semibold text-slate-900">
                      {getRatingDisplay(socialBehaviour.obedience)}
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-2 sm:p-3 font-medium">Honesty</td>
                    <td className="p-2 sm:p-3 text-center font-semibold text-slate-900">
                      {getRatingDisplay(socialBehaviour.honesty)}
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-2 sm:p-3 font-medium">Responsibility</td>
                    <td className="p-2 sm:p-3 text-center font-semibold text-slate-900">
                      {getRatingDisplay(socialBehaviour.responsibility)}
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-2 sm:p-3 font-medium">Self Control</td>
                    <td className="p-2 sm:p-3 text-center font-semibold text-slate-900">
                      {getRatingDisplay(socialBehaviour.selfControl)}
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-2 sm:p-3 font-medium">Leadership</td>
                    <td className="p-2 sm:p-3 text-center font-semibold text-slate-900">
                      {getRatingDisplay(socialBehaviour.leadership)}
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-2 sm:p-3 font-medium">Relationship with Others</td>
                    <td className="p-2 sm:p-3 text-center font-semibold text-slate-900">
                      {getRatingDisplay(socialBehaviour.relationshipWithOthers)}
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-2 sm:p-3 font-medium">Games and Sports</td>
                    <td className="p-2 sm:p-3 text-center font-semibold text-slate-900">
                      {getRatingDisplay(socialBehaviour.gamesAndSports)}
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-2 sm:p-3 font-medium">Health</td>
                    <td className="p-2 sm:p-3 text-center font-semibold text-slate-900">
                      {getRatingDisplay(socialBehaviour.health)}
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-2 sm:p-3 font-medium">Neatness</td>
                    <td className="p-2 sm:p-3 text-center font-semibold text-slate-900">
                      {getRatingDisplay(socialBehaviour.neatness)}
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-2 sm:p-3 font-medium">Manipulative Skill</td>
                    <td className="p-2 sm:p-3 text-center font-semibold text-slate-900">
                      {getRatingDisplay(socialBehaviour.manipulativeSkill)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="text-xs sm:text-sm mt-3 p-3 bg-slate-50 rounded-xl text-slate-700">
              <span className="font-semibold text-slate-500">Behaviour Remark:</span> {socialBehaviour.remark || "—"}
            </div>
          </div>
        )}

        {/* Attendance */}
        {attendance && (
          <div className="mb-6">
            <h3 className="font-semibold text-base sm:text-lg mb-3 text-slate-800">Attendance</h3>
            <div className="overflow-x-auto -mx-4 sm:mx-0 rounded-xl border border-slate-200">
              <table className="w-full text-xs sm:text-sm min-w-[400px]">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="p-2 sm:p-3 text-left font-semibold">Category</th>
                    <th className="p-2 sm:p-3 text-center font-semibold">Times Opened</th>
                    <th className="p-2 sm:p-3 text-center font-semibold">Times Present</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700 divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-2 sm:p-3 font-medium">School Sessions</td>
                    <td className="p-2 sm:p-3 text-center">{getNumberDisplay(attendance.schoolOpened)}</td>
                    <td className="p-2 sm:p-3 text-center">{getNumberDisplay(attendance.schoolPresent)}</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-2 sm:p-3 font-medium">Sports / Athletics</td>
                    <td className="p-2 sm:p-3 text-center">{getNumberDisplay(attendance.sportOpened)}</td>
                    <td className="p-2 sm:p-3 text-center">{getNumberDisplay(attendance.sportPresent)}</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-2 sm:p-3 font-medium">Other Gatherings</td>
                    <td className="p-2 sm:p-3 text-center">{getNumberDisplay(attendance.othersOpened)}</td>
                    <td className="p-2 sm:p-3 text-center">{getNumberDisplay(attendance.othersPresent)}</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-2 sm:p-3 font-medium">Organized Activities</td>
                    <td className="p-2 sm:p-3 text-center">{getNumberDisplay(attendance.organizedActivitiesOpened)}</td>
                    <td className="p-2 sm:p-3 text-center">{getNumberDisplay(attendance.organizedActivitiesPresent)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Comments & Fees */}
        <div className="text-xs sm:text-sm space-y-3 border-t pt-6 text-slate-700">
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="font-semibold text-slate-600">Class Teacher&apos;s Comment:</span>{" "}
            {resultSummary.classTeacherComment || "—"}
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="font-semibold text-slate-600">Head Teacher&apos;s Comment:</span>{" "}
            {resultSummary.headTeacherComment || "—"}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="font-semibold text-slate-600">Next Term Begins:</span>{" "}
              {resultSummary.nextTermBegins || "—"}
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="font-semibold text-slate-600">Next Term Fees:</span>{" "}
              {resultSummary.nextTermFees || "—"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}