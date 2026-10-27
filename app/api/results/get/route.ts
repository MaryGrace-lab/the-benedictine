// app/api/results/get/route.ts
// ──────────────────────────────────────────────
// Get Results API — Admin & Teacher
// Fetches existing results for editing.
// ──────────────────────────────────────────────

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromSession, getTeacherFromSession } from "@/lib/jwt";

export async function GET(req: Request) {
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

    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");
    const sessionId = searchParams.get("sessionId");

    if (!studentId || !sessionId) {
      return NextResponse.json({ error: "Missing studentId or sessionId" }, { status: 400 });
    }

    const student = await prisma.student.findUnique({
      where: { studentId },
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

    // Determine correct subjects based on student's class and type
    const level = student.class?.startsWith("SSS") ? "SSS" : "JSS";
    const stream = student.studentType || undefined;

    const subjectWhere: any = { level };
    if (stream && level === "SSS") {
      subjectWhere.OR = [{ stream }, { stream: "ALL" }];
    }

    // Fetch sequentially to avoid connection pool exhaustion
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

    const subjects = await prisma.subject.findMany({
      where: subjectWhere,
      orderBy: { name: "asc" },
    });

    return NextResponse.json({
      student: {
        id: student.id,
        studentId: student.studentId,
        name: `${student.firstName} ${student.lastName}`,
        class: student.class,
      },
      results,
      socialBehaviour,
      attendance,
      resultSummary,
      subjects: subjects.map((s) => ({ id: s.id, name: s.name })),
    });
  } catch (error) {
    console.error("Failed to fetch results:", error);
    return NextResponse.json({ error: "Failed to fetch results" }, { status: 500 });
  }
}