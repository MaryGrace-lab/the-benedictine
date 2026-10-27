// app/api/results/upload/route.ts
// Result Upload API — Admin & Teacher
// Uses sequential writes instead of interactive transactions
// to work with Supabase PgBouncer (transaction mode).

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { calculateSubjectResult, calculateResultSummary } from "@/lib/grading";
import { calculateSocialBehaviourScore } from "@/lib/rating";
import { getAdminFromSession, getTeacherFromSession } from "@/lib/jwt";

const RatingEnum = z.enum(["EXCELLENT", "GOOD", "AVERAGE", "POOR", "VERY_POOR"]);
const EvaluationEnum = z.enum(["EXCELLENT", "GOOD", "AVERAGE", "BELOW_AVERAGE", "POOR"]);

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
    obedience: RatingEnum.nullable(),
    honesty: RatingEnum.nullable(),
    responsibility: RatingEnum.nullable(),
    selfControl: RatingEnum.nullable(),
    leadership: RatingEnum.nullable(),
    relationshipWithOthers: RatingEnum.nullable(),
    gamesAndSports: RatingEnum.nullable(),
    health: RatingEnum.nullable(),
    neatness: RatingEnum.nullable(),
    manipulativeSkill: RatingEnum.nullable(),
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
  evaluation: EvaluationEnum.nullable().optional(),
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
        {
          error: "Validation failed",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = validation.data;

    const student = await prisma.student.findUnique({
      where: { studentId: data.studentId },
      select: { id: true, firstName: true, lastName: true, class: true },
    });

    if (!student) {
      return NextResponse.json(
        { error: "Student profile not found" },
        { status: 404 }
      );
    }

    if (
      teacherSession &&
      teacherSession.role === "TEACHER" &&
      teacherSession.assignedClass !== student.class
    ) {
      return NextResponse.json(
        { error: "You can only upload results for your assigned class" },
        { status: 403 }
      );
    }

    const session = await prisma.academicSession.findUnique({
      where: { id: data.sessionId },
    });

    if (!session) {
      return NextResponse.json(
        { error: "Academic session not found" },
        { status: 404 }
      );
    }

    // ── Save subject results sequentially ──
    const savedResults: Awaited<ReturnType<typeof prisma.result.upsert>>[] = [];
    const subjectTotals: (number | null)[] = [];

    for (const subjectResult of data.results) {
      const calculation = calculateSubjectResult(
        subjectResult.firstTest,
        subjectResult.secondTest,
        subjectResult.exam
      );

      const saved = await prisma.result.upsert({
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
        },
      });

      savedResults.push(saved);
      subjectTotals.push(calculation.total);
    }

    // ── Save social behaviour ──
    if (data.socialBehaviour) {
      const behaviourScores = calculateSocialBehaviourScore(data.socialBehaviour);

      await prisma.socialBehaviour.upsert({
        where: {
          studentId_sessionId: {
            studentId: student.id,
            sessionId: data.sessionId,
          },
        },
        update: {
          ...data.socialBehaviour,
          ...behaviourScores,
        },
        create: {
          studentId: student.id,
          sessionId: data.sessionId,
          ...data.socialBehaviour,
          ...behaviourScores,
        },
      });
    }

    // ── Save attendance ──
    if (data.attendance) {
      await prisma.attendance.upsert({
        where: {
          studentId_sessionId: {
            studentId: student.id,
            sessionId: data.sessionId,
          },
        },
        update: data.attendance,
        create: {
          studentId: student.id,
          sessionId: data.sessionId,
          ...data.attendance,
        },
      });
    }

    // ── Save result summary ──
    const summary = calculateResultSummary(subjectTotals);
    const resultSummaryRecord = await prisma.resultSummary.upsert({
      where: {
        studentId_sessionId: {
          studentId: student.id,
          sessionId: data.sessionId,
        },
      },
      update: {
        noInClass: data.noInClass ?? null,
        evaluation: data.evaluation ?? null,
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
        studentId: student.id,
        sessionId: data.sessionId,
        noInClass: data.noInClass ?? null,
        evaluation: data.evaluation ?? null,
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
    });

    return NextResponse.json({
      success: true,
      message: "Student results saved successfully",
      student: `${student.firstName} ${student.lastName}`,
      summary: {
        subjectsProcessed: savedResults.length,
        calculatedAverage: resultSummaryRecord.percentageAvg,
        systemRemark: resultSummaryRecord.remark,
      },
    });
  } catch (error) {
    console.error("Result Upload Error:", error);
    return NextResponse.json(
      { error: "Failed to save results. Please try again." },
      { status: 500 }
    );
  }
}