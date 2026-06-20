// app/api/auth/forgot-password/route.ts
// ──────────────────────────────────────────────
// Forgot Password API — Student Only
// Resets password to original auto-generated one.
// ──────────────────────────────────────────────

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateInitialStudentPassword, getPlaintextStudentPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { studentId, lastName } = await req.json();

    if (!studentId || !lastName) {
      return NextResponse.json(
        { error: "Card ID and Last Name are required" },
        { status: 400 }
      );
    }

    const trimmedId = studentId.trim();
    const trimmedName = lastName.trim();

    const student = await prisma.student.findUnique({
      where: { studentId: trimmedId },
    });

    // Generic error — prevents account enumeration
    if (
      !student ||
      student.lastName.toLowerCase() !== trimmedName.toLowerCase()
    ) {
      return NextResponse.json(
        { error: "Invalid Card ID or Last Name combination" },
        { status: 401 }
      );
    }

    // Reset password to original auto-generated one
    const hashedPassword = await generateInitialStudentPassword(
      student.lastName,
      student.studentId
    );

    await prisma.student.update({
      where: { studentId: student.studentId },
      data: { password: hashedPassword },
    });

    const plainPassword = getPlaintextStudentPassword(
      student.lastName,
      student.studentId
    );

    return NextResponse.json({
      success: true,
      password: plainPassword,
      studentName: `${student.firstName} ${student.lastName}`,
      studentId: student.studentId,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Failed to reset password. Please try again." },
      { status: 500 }
    );
  }
}