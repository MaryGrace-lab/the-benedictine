// app/api/results/delete/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromSession, getTeacherFromSession } from "@/lib/jwt";
import { z } from "zod";

const DeleteSchema = z.object({
  studentId: z.string().min(1),
  sessionId: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const admin = await getAdminFromSession();
    const teacher = await getTeacherFromSession();

    if (
      (!admin || admin.role !== "ADMIN") &&
      (!teacher || teacher.role !== "TEACHER")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validation = DeleteSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    const { studentId, sessionId } = validation.data;

    // Verify student exists and teacher has permission
    const student = await prisma.student.findUnique({ where: { studentId } });
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    if (teacher && teacher.role === "TEACHER") {
      if (teacher.assignedClass !== student.class) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
      }
    }

    // Check if there are any results to delete
    const existingResult = await prisma.result.findFirst({
      where: { studentId: student.id, sessionId },
    });

    if (!existingResult) {
      return NextResponse.json(
        { error: "No results found for this student in the selected session" },
        { status: 404 }
      );
    }

    // Delete everything in a transaction
    await prisma.$transaction([
      prisma.result.deleteMany({
        where: { studentId: student.id, sessionId },
      }),
      prisma.socialBehaviour.deleteMany({
        where: { studentId: student.id, sessionId },
      }),
      prisma.attendance.deleteMany({
        where: { studentId: student.id, sessionId },
      }),
      prisma.resultSummary.deleteMany({
        where: { studentId: student.id, sessionId },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: `All results for ${student.firstName} ${student.lastName} in this session have been deleted.`,
    });
  } catch (error) {
    console.error("Delete results error:", error);
    return NextResponse.json(
      { error: "Failed to delete results" },
      { status: 500 }
    );
  }
}