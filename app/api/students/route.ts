// app/api/students/route.ts
// ──────────────────────────────────────────────
// Students List API — Role-Based Access
// Teachers see only their assigned class.
// Admin sees all (or filtered by class).
// ──────────────────────────────────────────────

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTeacherFromSession, getAdminFromSession } from "@/lib/jwt";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const classFilter = searchParams.get("class");

    const teacherSession = await getTeacherFromSession();
    const adminSession = await getAdminFromSession();
        if (!teacherSession && !adminSession) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    let whereClause: any = {};

    if (teacherSession && teacherSession.role === "TEACHER" && teacherSession.assignedClass) {
      // Teacher: only show their assigned class
      whereClause.class = teacherSession.assignedClass;
    } else if (classFilter) {
      // Admin with class filter
      whereClause.class = classFilter;
    }
    // Admin without filter sees all students

    const students = await prisma.student.findMany({
      where: whereClause,
      orderBy: [{ class: "asc" }, { lastName: "asc" }],
      select: {
        id: true,
        studentId: true,
        firstName: true,
        lastName: true,
        class: true,
        studentType: true,
        guardianName: true,
        guardianPhone: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ students });
  } catch (error) {
    console.error("Failed to fetch students:", error);
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
  }
}