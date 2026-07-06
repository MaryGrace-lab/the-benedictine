// app/api/results/view/route.ts
// ──────────────────────────────────────────────
// Result View API — Student, Admin, Teacher
// Student sees ONLY their own results.
// Admin/Teacher can view any student.
// ──────────────────────────────────────────────

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStudentFromSession, getAdminFromSession, getTeacherFromSession } from "@/lib/jwt";

export async function GET(req: Request) {
  try {
    // Auth: Student, Admin, or Teacher
    const studentSession = await getStudentFromSession();
    const adminSession = await getAdminFromSession();
    const teacherSession = await getTeacherFromSession();

    if (!studentSession && !adminSession && !teacherSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const requestedStudentId = searchParams.get("studentId");
    const sessionId = searchParams.get("sessionId");

    if (!requestedStudentId || !sessionId) {
      return NextResponse.json({ error: "Missing studentId or sessionId" }, { status: 400 });
    }

    // Security: Students can ONLY view their own results
    if (studentSession && studentSession !== requestedStudentId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const student = await prisma.student.findUnique({
      where: { studentId: requestedStudentId },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
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

    // Fetch sequentially to avoid connection pool exhaustion
    const session = await prisma.academicSession.findUnique({ where: { id: sessionId } });

    if (!session) {
      return NextResponse.json({ error: "Academic session not found" }, { status: 404 });
    }

    const results = await prisma.result.findMany({
      where: { studentId: student.id, sessionId },
      include: { subject: true },
      orderBy: { subject: { name: "asc" } },
    });

    const socialBehaviour = await prisma.socialBehaviour.findUnique({
      where: { studentId_sessionId: { studentId: student.id, sessionId } },
    });

    const attendance = await prisma.attendance.findUnique({
      where: { studentId_sessionId: { studentId: student.id, sessionId } },
    });

    const resultSummary = await prisma.resultSummary.findUnique({
      where: { studentId_sessionId: { studentId: student.id, sessionId } },
    });

    if (!resultSummary) {
      return NextResponse.json(
        { error: "No results compiled for this student in this session" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      student: {
        name: `${student.firstName} ${student.lastName}`,
        class: student.class,
        studentId: student.studentId,
      },
      session: { year: session.year, term: session.term },
      results,
      socialBehaviour,
      attendance,
      summary: resultSummary,
    });
  } catch (error) {
    console.error("Failed to fetch results:", error);
    return NextResponse.json({ error: "Failed to fetch results" }, { status: 500 });
  }
}