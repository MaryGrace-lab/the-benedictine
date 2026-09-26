// app/api/results/bulk-upload/route.ts
// Bulk Upload API — Admin & Teacher
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

const BulkUploadSchema = z.object({
  sessionId: z.string().min(1, "Session is required"),
  class: z.string().min(1, "Class is required"),
  results: z.array(
    z.object({
      studentId: z.string().min(1),
      scores: z.array(
        z.object({
          subjectId: z.string().min(1),
          firstTest: z.number().min(0).max(20).nullable(),
          secondTest: z.number().min(0).max(20).nullable(),
          exam: z.number().min(0).max(60).nullable(),
        })
      ).min(1, "At least one subject score is required"),
    })
  ).min(1, "At least one student result is required"),

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
    const validation = BulkUploadSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { sessionId, class: className, results } = validation.data;

    // Teacher: verify class access
    if (teacherSession && teacherSession.assignedClass !== className) {
      return NextResponse.json(
        { error: "You can only upload results for your assigned class" },
        { status: 403 }
      );
    }

    let processed = 0;
    let failed = 0;
    const errors: string[] = [];

    // Precompute behaviour scores once for the whole batch
    const behaviourScores = validation.data.socialBehaviour
      ? calculateSocialBehaviourScore(validation.data.socialBehaviour)
      : null;

    // Process each student sequentially (no interactive transaction)
    for (const studentResult of results) {
      try {
        const student = await prisma.student.findUnique({
          where: { studentId: studentResult.studentId },
          select: { id: true, class: true },
        });

        if (!student || student.class !== className) {
          failed++;
          errors.push(`${studentResult.studentId}: Student not found or not in ${className}`);
          continue;
        }

        const subjectTotals: (number | null)[] = [];

        for (const score of studentResult.scores) {
          const calculation = calculateSubjectResult(
            score.firstTest,
            score.secondTest,
            score.exam
          );

          await prisma.result.upsert({
            where: {
              studentId_subjectId_sessionId: {
                studentId: student.id,
                subjectId: score.subjectId,
                sessionId,
              },
            },
            update: {
              firstTest: score.firstTest,
              secondTest: score.secondTest,
              exam: score.exam,
              total: calculation.total,
              grade: calculation.grade,
            },
            create: {
              studentId: student.id,
              subjectId: score.subjectId,
              sessionId,
              firstTest: score.firstTest,
              secondTest: score.secondTest,
              exam: score.exam,
              total: calculation.total,
              grade: calculation.grade,
            },
          });

          subjectTotals.push(calculation.total);
        }

        const summary = calculateResultSummary(subjectTotals);
        await prisma.resultSummary.upsert({
          where: {
            studentId_sessionId: {
              studentId: student.id,
              sessionId,
            },
          },
          update: {
            totalCumulative: summary.totalCumulative,
            totalScore: summary.totalScore,
            percentageAvg: summary.percentageAvg,
            remark: summary.remark,
            noInClass: validation.data.noInClass ?? null,
            evaluation: validation.data.evaluation ?? null,
            classTeacherComment: validation.data.classTeacherComment ?? null,
            nextTermFees: validation.data.nextTermFees ?? null,
            outstandingFees: validation.data.outstandingFees ?? null,
            books: validation.data.books ?? null,
            nextTermBegins: validation.data.nextTermBegins ?? null,
            headTeacherComment: validation.data.headTeacherComment ?? null,
            parentName: validation.data.parentName ?? null,
          },
          create: {
            studentId: student.id,
            sessionId,
            totalCumulative: summary.totalCumulative,
            totalScore: summary.totalScore,
            percentageAvg: summary.percentageAvg,
            remark: summary.remark,
            noInClass: validation.data.noInClass ?? null,
            evaluation: validation.data.evaluation ?? null,
            classTeacherComment: validation.data.classTeacherComment ?? null,
            nextTermFees: validation.data.nextTermFees ?? null,
            outstandingFees: validation.data.outstandingFees ?? null,
            books: validation.data.books ?? null,
            nextTermBegins: validation.data.nextTermBegins ?? null,
            headTeacherComment: validation.data.headTeacherComment ?? null,
            parentName: validation.data.parentName ?? null,
          },
        });

        // Save social behaviour (same for every student in the batch)
        if (validation.data.socialBehaviour && behaviourScores) {
          await prisma.socialBehaviour.upsert({
            where: {
              studentId_sessionId: {
                studentId: student.id,
                sessionId,
              },
            },
            update: {
              ...validation.data.socialBehaviour,
              ...behaviourScores,
            },
            create: {
              studentId: student.id,
              sessionId,
              ...validation.data.socialBehaviour,
              ...behaviourScores,
            },
          });
        }

        // Save attendance (same for every student in the batch)
        if (validation.data.attendance) {
          await prisma.attendance.upsert({
            where: {
              studentId_sessionId: {
                studentId: student.id,
                sessionId,
              },
            },
            update: validation.data.attendance,
            create: {
              studentId: student.id,
              sessionId,
              ...validation.data.attendance,
            },
          });
        }

        processed++;
      } catch (err) {
        failed++;
        errors.push(`${studentResult.studentId}: Processing error`);
        console.error(`Error processing ${studentResult.studentId}:`, err);
      }
    }

    return NextResponse.json({
      success: true,
      processed,
      failed,
      errors: errors.length > 0 ? errors.slice(0, 10) : undefined,
      message: `Processed ${processed} students, ${failed} failed`,
    });
  } catch (error) {
    console.error("Bulk upload error:", error);
    return NextResponse.json(
      { error: "Failed to process bulk upload" },
      { status: 500 }
    );
  }
}