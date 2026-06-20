// app/api/students/create/route.ts
// ──────────────────────────────────────────────
// Student Creation API — Admin Only
// ──────────────────────────────────────────────

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromSession } from "@/lib/jwt";
import { generateInitialStudentPassword, getPlaintextStudentPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    // Auth: Admin only
    const adminSession = await getAdminFromSession();
    if (!adminSession || adminSession.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      firstName,
      lastName,
      studentId,
      studentClass,
      studentType,
      guardianName,
      guardianPhone,
    } = await req.json();

    if (!firstName || !lastName || !studentId || !studentClass) {
      return NextResponse.json(
        { error: "Missing required student data fields" },
        { status: 400 }
      );
    }

    const hashedPassword = await generateInitialStudentPassword(lastName, studentId);

    const student = await prisma.student.create({
      data: {
        studentId: studentId.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        class: studentClass.trim(),
        studentType: studentType || null,
        password: hashedPassword,
        guardianName: guardianName ? guardianName.trim() : null,
        guardianPhone: guardianPhone ? guardianPhone.trim() : null,
      } as any,
    });

    const tempPassword = getPlaintextStudentPassword(lastName, studentId);

    return NextResponse.json({
      success: true,
      student: {
        id: student.id,
        studentId: student.studentId,
        name: `${student.firstName} ${student.lastName}`,
        class: student.class,
        studentType: student.studentType,
      },
      cardDetails: {
        studentId: student.studentId,
        temporaryPassword: tempPassword,
        instruction:
          "Login with your Card ID and this password. Change your password after first login.",
      },
    });
  } catch (error: any) {
    console.error("Student creation error:", error);

    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "A student with this Card ID already exists. Please use a different Card ID." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create student profile" },
      { status: 500 }
    );
  }
}