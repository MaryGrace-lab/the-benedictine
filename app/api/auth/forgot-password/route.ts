// app/api/auth/forgot-password/route.ts
// Resets student password to a NEW random auto-generated one
// Returns the plaintext password for one-time display

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateInitialStudentPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { studentId, lastName } = body;

    // Input validation
    if (!studentId || !lastName) {
      return NextResponse.json(
        { error: "Card ID and Last Name are required" },
        { status: 400 }
      );
    }

    if (typeof studentId !== "string" || typeof lastName !== "string") {
      return NextResponse.json(
        { error: "Invalid input format" },
        { status: 400 }
      );
    }

    const trimmedId = studentId.trim();
    const trimmedName = lastName.trim();

    if (!trimmedId || !trimmedName) {
      return NextResponse.json(
        { error: "Card ID and Last Name cannot be empty" },
        { status: 400 }
      );
    }

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

    // Generate NEW password with random component
    const { hashed, plaintext } = await generateInitialStudentPassword(
      student.lastName,
      student.studentId
    );

    // Update password in database
    await prisma.student.update({
      where: { studentId: student.studentId },
      data: { 
        password: hashed,
        passwordResetRequired: true,
      },
    });

    // Return the plaintext password for one-time display
    return NextResponse.json({
      success: true,
      password: plaintext,
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