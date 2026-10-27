// app/api/students/route.ts
// ──────────────────────────────────────────────
// Students List API — Role-Based Access
// Teachers see only their assigned class.
// Admin sees all (or filtered by class).
// ──────────────────────────────────────────────

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTeacherFromSession, getAdminFromSession } from "@/lib/jwt";
import { z } from "zod";

// Validate class names – standardized to "JSS 1", "SSS 2" etc.
const classSchema = z.enum(
  ["JSS 1", "JSS 2", "JSS 3", "SSS 1", "SSS 2", "SSS 3"],
  { message: "Invalid class" }
);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const classFilter = searchParams.get("class");
    const search = searchParams.get("search");

    const teacherSession = await getTeacherFromSession();
    const adminSession = await getAdminFromSession();

    if (!teacherSession && !adminSession) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    let whereClause: any = {};

    // Teacher: only show their assigned class
    if (teacherSession && teacherSession.role === "TEACHER" && teacherSession.assignedClass) {
      whereClause.class = teacherSession.assignedClass;
    }
    // Admin with class filter
    else if (classFilter && adminSession) {
      const parsed = classSchema.safeParse(classFilter);
      if (!parsed.success) {
        return NextResponse.json(
          { error: "Invalid class parameter" },
          { status: 400 }
        );
      }
      whereClause.class = parsed.data;
    }

    // Search filter
    if (search && typeof search === "string" && search.trim()) {
      const searchTerm = search.trim();
      whereClause.OR = [
        { firstName: { contains: searchTerm, mode: "insensitive" } },
        { lastName: { contains: searchTerm, mode: "insensitive" } },
        { studentId: { contains: searchTerm, mode: "insensitive" } },
      ];
    }

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
      take: 100,
    });

    return NextResponse.json({
      students,
      count: students.length,
    });
  } catch (error) {
    console.error("Failed to fetch students:", error);
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}