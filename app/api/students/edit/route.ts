// app/api/students/edit/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromSession } from "@/lib/jwt";
import { Prisma } from "@prisma/client";

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
      gender,
      studentId,
      studentClass,
      studentType,
      guardianName,
      guardianPhone,
    } = await req.json();

    if (!originalStudentId) {
      return NextResponse.json(
        { error: "Original Student ID is required" },
        { status: 400 }
      );
    }

    const existing = await prisma.student.findUnique({
      where: { studentId: originalStudentId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

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

    const updateData: Prisma.StudentUpdateInput = {
      studentId: studentId?.trim() || existing.studentId,
      firstName: firstName?.trim() || existing.firstName,
      lastName: lastName?.trim() || existing.lastName,
      gender: gender !== undefined ? gender : existing.gender,
      class: studentClass?.trim() || existing.class,
      studentType: studentType !== undefined ? studentType : existing.studentType,
      guardianName: guardianName?.trim() ?? existing.guardianName,
      guardianPhone: guardianPhone?.trim() ?? existing.guardianPhone,
    };

    const updated = await prisma.student.update({
      where: { studentId: originalStudentId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      student: {
        id: updated.id,
        studentId: updated.studentId,
        firstName: updated.firstName,
        lastName: updated.lastName,
        gender: updated.gender,
        class: updated.class,
        studentType: updated.studentType,
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
    return NextResponse.json(
      { error: "Failed to update student" },
      { status: 500 }
    );
  }
}