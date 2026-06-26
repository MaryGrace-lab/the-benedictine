// app/api/results/upload/route.ts
// ──────────────────────────────────────────────
// Result Upload API — Admin & Teacher
// ──────────────────────────────────────────────

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { calculateSubjectResult, calculateResultSummary } from "@/lib/grading";
import { calculateSocialBehaviourScore } from "@/lib/rating";
import { getAdminFromSession, getTeacherFromSession } from "@/lib/jwt";

// ── Validation Schema ──
const ResultUploadSchema = z.object({
  studentId: z.string().min(1, "Student is required"),
  sessionId: z.string().min(1, "Session is required"),
  results: z.array(
    z.object({
      subjectId: z.string().min(1),
      firstTest: z.number().min(0).max(20).nullable(),
      secondTest: z.number().min(0).max(20).nullable(),
      exam: z.number().min(0).max(60).nullable(),
    })
  ).min(1, "At least one subject result is required"),
  socialBehaviour: z.object({
    obedience: z.enum(["EXCELLENT", "GOOD", "AVERAGE", "POOR", "VERY_POOR"]).nullable(),
    honesty: z.enum(["EXCELLENT", "GOOD", "AVERAGE", "POOR", "VERY_POOR"]).nullable(),
    responsibility: z.enum(["EXCELLENT", "GOOD", "AVERAGE", "POOR", "VERY_POOR"]).nullable(),
    selfControl: z.enum(["EXCELLENT", "GOOD", "AVERAGE", "POOR", "VERY_POOR"]).nullable(),
    leadership: z.enum(["EXCELLENT", "GOOD", "AVERAGE", "POOR", "VERY_POOR"]).nullable(),
    relationshipWithOthers: z.enum(["EXCELLENT", "GOOD", "AVERAGE", "POOR", "VERY_POOR"]).nullable(),
    gamesAndSports: z.enum(["EXCELLENT", "GOOD", "AVERAGE", "POOR", "VERY_POOR"]).nullable(),
    health: z.enum(["EXCELLENT", "GOOD", "AVERAGE", "POOR", "VERY_POOR"]).nullable(),
    neatness: z.enum(["EXCELLENT", "GOOD", "AVERAGE", "POOR", "VERY_POOR"]).nullable(),
    manipulativeSkill: z.enum(["EXCELLENT", "GOOD", "AVERAGE", "POOR", "VERY_POOR"]).nullable(),
  }).optional(),
  attendance: z.object({
    schoolOpened: z.number().int().min(0).nullable(),
    schoolPresent: z.number().int().min(0).nullable(),
    sportOpened: z.number().int().min(0).nullable(),
    sportPresent: z.number().int().min(0).nullable(),
    othersOpened: z.number().int().min(0).nullable(),
    othersPresent: z.number().int().min(0).nullable(),
    organizedActivitiesOpened: z.number().int().min(0).nullable(),
    organizedActivitiesPresent: z.number().int().min(0).nullable(),
    remark: z.string().nullable(),
  }).optional(),
  noInClass: z.number().int().min(0).nullable().optional(),
  evaluation: z.enum(["EXCELLENT", "GOOD", "AVERAGE", "BELOW_AVERAGE", "POOR"]).nullable().optional(),
  classTeacherComment: z.string().nullable().optional(),
  nextTermFees: z.string().nullable().optional(),
  outstandingFees: z.string().nullable().optional(),
  books: z.string().nullable().optional(),
  nextTermBegins: z.string().nullable().optional(),
  headTeacherComment: z.string().nullable().optional(),
  parentName: z.string().nullable().optional(),
});

export async function POST(req: Request) {
  try {
    const adminSession = await getAdminFromSession();
    const teacherSession = await getTeacherFromSession();

    if (
      (!adminSession || adminSession.role !== "ADMIN") &&
      (!teacherSession || teacherSession.role !== "TEACHER")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validation = ResultUploadSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = validation.data;

    const student = await prisma.student.findUnique({
      where: { studentId: data.studentId },
    });

    if (!student) {
      return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
    }

    if (
      teacherSession &&
      teacherSession.role === "TEACHER" &&
      teacherSession.assignedClass !== student.class
    ) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    const session = await prisma.academicSession.findUnique({
      where: { id: data.sessionId },
    });

    if (!session) {
      return NextResponse.json({ error: "Academic session not found" }, { status: 404 });
    }

    const result: any = await prisma.$transaction(async (tx: any) => {
      const savedResults: any[] = [];
      const subjectTotals: (number | null)[] = [];

      // 1. Save Subject Results
      for (const subjectResult of data.results) {
        const calculation = calculateSubjectResult(
          subjectResult.firstTest,
          subjectResult.secondTest,
          subjectResult.exam
        );

        const saved = await tx.result.upsert({
          where: {
            studentId_subjectId_sessionId: {
              studentId: student.id,
              subjectId: subjectResult.subjectId,
              sessionId: data.sessionId,
            },
          },
          update: {
            firstTest: subjectResult.firstTest,
            secondTest: subjectResult.secondTest,
            exam: subjectResult.exam,
            total: calculation.total,
            grade: calculation.grade,
          },
          create: {
            studentId: student.id,
            subjectId: subjectResult.subjectId,
            sessionId: data.sessionId,
            firstTest: subjectResult.firstTest,
            secondTest: subjectResult.secondTest,
            exam: subjectResult.exam,
            total: calculation.total,
            grade: calculation.grade,
          } as any,
        });

        savedResults.push(saved);
        subjectTotals.push(calculation.total);
      }

      // 2. Save Social Behaviour
      let socialBehaviourRecord: any = null;
      if (data.socialBehaviour) {
        const { totalCumulative, totalScored, percentageAvg, remark } =
          calculateSocialBehaviourScore(data.socialBehaviour as Record<string, unknown>);

        const mappedBehaviour = Object.entries(data.socialBehaviour).reduce((acc, [key, val]) => {
          acc[key] = val === null ? null : (val as any);
          return acc;
        }, {} as Record<string, any>);

        socialBehaviourRecord = await tx.socialBehaviour.upsert({
          where: { studentId_sessionId: { studentId: student.id, sessionId: data.sessionId } },
          update: { ...mappedBehaviour, totalCumulative, totalScored, percentageAvg, remark },
          create: {
            studentId: student.id, sessionId: data.sessionId,
            ...mappedBehaviour, totalCumulative, totalScored, percentageAvg, remark,
          } as any,
        });
      }

      // 3. Save Attendance
      let attendanceRecord: any = null;
      if (data.attendance) {
        attendanceRecord = await tx.attendance.upsert({
          where: { studentId_sessionId: { studentId: student.id, sessionId: data.sessionId } },
          update: { ...data.attendance },
          create: { studentId: student.id, sessionId: data.sessionId, ...data.attendance } as any,
        });
      }

      // 4. Save Result Summary
      const summary = calculateResultSummary(subjectTotals);

      const resultSummaryRecord = await tx.resultSummary.upsert({
        where: { studentId_sessionId: { studentId: student.id, sessionId: data.sessionId } },
        update: {
          noInClass: data.noInClass ?? null,
          evaluation: data.evaluation ? (data.evaluation as any) : null,
          totalCumulative: summary.totalCumulative,
          totalScore: summary.totalScore,
          percentageAvg: summary.percentageAvg,
          remark: summary.remark,
          classTeacherComment: data.classTeacherComment ?? null,
          nextTermFees: data.nextTermFees ?? null,
          outstandingFees: data.outstandingFees ?? null,
          books: data.books ?? null,
          nextTermBegins: data.nextTermBegins ?? null,
          headTeacherComment: data.headTeacherComment ?? null,
          parentName: data.parentName ?? null,
        },
        create: {
          studentId: student.id, sessionId: data.sessionId,
          noInClass: data.noInClass ?? null,
          evaluation: data.evaluation ? (data.evaluation as any) : null,
          totalCumulative: summary.totalCumulative,
          totalScore: summary.totalScore,
          percentageAvg: summary.percentageAvg,
          remark: summary.remark,
          classTeacherComment: data.classTeacherComment ?? null,
          nextTermFees: data.nextTermFees ?? null,
          outstandingFees: data.outstandingFees ?? null,
          books: data.books ?? null,
          nextTermBegins: data.nextTermBegins ?? null,
          headTeacherComment: data.headTeacherComment ?? null,
          parentName: data.parentName ?? null,
        } as any,
      });

      return { results: savedResults, socialBehaviour: socialBehaviourRecord, attendance: attendanceRecord, resultSummary: resultSummaryRecord } as any;
    }, { timeout: 30000 });

    return NextResponse.json({
      success: true,
      message: "Student results compiled and saved successfully",
      student: `${student.firstName} ${student.lastName}`,
      summary: {
        subjectsProcessed: result.results.length,
        calculatedAverage: result.resultSummary.percentageAvg,
        systemRemark: result.resultSummary.remark,
      },
    });
  } catch (error) {
    console.error("Result Upload Error:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Transactional error occurred" },
      { status: 500 }
    );
  }
}