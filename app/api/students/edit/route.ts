// app/api/students/edit/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromSession } from "@/lib/jwt";

export async function PUT(req: Request) {
  try {
    const adminSession = await getAdminFromSession();

    if (!adminSession || adminSession.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      originalStudentId,
      firstName,
      lastName,
      studentId,
      studentClass,
      studentType, // ← ADDED
      guardianName,
      guardianPhone,
    } = await req.json();

    if (!originalStudentId) {
      return NextResponse.json({ error: "Original Student ID is required" }, { status: 400 });
    }

    // Check if student exists
    const existing = await prisma.student.findUnique({
      where: { studentId: originalStudentId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // If studentId is being changed, check it doesn't conflict
    if (studentId && studentId !== originalStudentId) {
      const duplicate = await prisma.student.findUnique({
        where: { studentId },
      });
      if (duplicate) {
        return NextResponse.json(
          { error: "A student with this Card ID already exists" },
          { status: 409 }
        );
      }
    }

    const updated = await prisma.student.update({
      where: { studentId: originalStudentId },
      data: {
        studentId: studentId?.trim() || existing.studentId,
        firstName: firstName?.trim() || existing.firstName,
        lastName: lastName?.trim() || existing.lastName,
        class: studentClass?.trim() || existing.class,
        studentType: studentType !== undefined ? studentType : existing.studentType, // ← ADDED
        guardianName: guardianName?.trim() ?? existing.guardianName,
        guardianPhone: guardianPhone?.trim() ?? existing.guardianPhone,
      } as any,
    });

    return NextResponse.json({
      success: true,
      student: {
        id: updated.id,
        studentId: updated.studentId,
        firstName: updated.firstName,
        lastName: updated.lastName,
        class: updated.class,
        studentType: updated.studentType, // ← ADDED to response
        guardianName: updated.guardianName,
        guardianPhone: updated.guardianPhone,
      },
    });
  } catch (error: any) {
    console.error("Student edit error:", error);
    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "A student with this Card ID already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Failed to update student" }, { status: 500 });
  }
}