// app/api/results/bulk-upload/route.ts
// Bulk Upload API — Admin & Teacher

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { calculateSubjectResult, calculateResultSummary } from "@/lib/grading";
import { getAdminFromSession, getTeacherFromSession } from "@/lib/jwt";

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
});

export async function POST(req: Request) {
  try {
    const adminSession = await getAdminFromSession();
    const teacherSession = await getTeacherFromSession();

    if (
      (!adminSession || adminSession.role !== "ADMIN") &&
      (!teacherSession || teacherSession.role !== "TEACHER")
    ) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validation = BulkUploadSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { 
          error: "Validation failed", 
          details: validation.error.flatten().fieldErrors 
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

    await prisma.$transaction(async (tx) => {
      for (const studentResult of results) {
        try {
          const student = await tx.student.findUnique({
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

            await tx.result.upsert({
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
          await tx.resultSummary.upsert({
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
            },
            create: {
              studentId: student.id,
              sessionId,
              totalCumulative: summary.totalCumulative,
              totalScore: summary.totalScore,
              percentageAvg: summary.percentageAvg,
              remark: summary.remark,
            },
          });

          processed++;
        } catch {
          failed++;
          errors.push(`${studentResult.studentId}: Processing error`);
        }
      }
    });

    return NextResponse.json({
      success: true,
      processed,
      failed,
      errors: errors.length > 0 ? errors.slice(0, 10) : undefined, // Limit error messages
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