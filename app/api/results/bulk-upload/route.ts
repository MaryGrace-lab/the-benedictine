// app/api/results/bulk-upload/route.ts
// ──────────────────────────────────────────────
// Bulk Upload API — Admin & Teacher
// ──────────────────────────────────────────────

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { calculateSubjectResult, calculateResultSummary } from "@/lib/grading";
import { getAdminFromSession, getTeacherFromSession } from "@/lib/jwt";

const BulkUploadSchema = z.object({
  sessionId: z.string().min(1),
  class: z.string().min(1),
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
      ),
    })
  ),
});

export async function POST(req: Request) {
  try {
    // Allow both Admin and Teacher
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
        { error: "Validation failed", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { sessionId, results } = validation.data;
    let processed = 0;
    let failed = 0;

    await prisma.$transaction(
      async (tx) => {
        for (const studentResult of results) {
          try {
            const student = await tx.student.findUnique({
              where: { studentId: studentResult.studentId },
            });

            if (!student) {
              failed++;
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
                } as any,
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
              } as any,
            });

            processed++;
          } catch {
            failed++;
          }
        }
      },
      { timeout: 60000 }
    );

    return NextResponse.json({
      success: true,
      processed,
      failed,
    });
  } catch (error) {
    console.error("Bulk upload error:", error);
    return NextResponse.json({ error: "Failed to process bulk upload" }, { status: 500 });
  }
}