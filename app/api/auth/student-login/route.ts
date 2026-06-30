// app/api/auth/student-login/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyStudentPassword } from "@/lib/auth";
import { setStudentSession } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { studentId, password } = body;

    // Input validation
    if (!studentId || !password) {
      return NextResponse.json(
        { error: "Card ID and password are required" },
        { status: 400 }
      );
    }

    if (typeof studentId !== "string" || typeof password !== "string") {
      return NextResponse.json(
        { error: "Invalid input format" },
        { status: 400 }
      );
    }

    const trimmedStudentId = studentId.trim();
    const trimmedPassword = password.trim();

    if (!trimmedStudentId || !trimmedPassword) {
      return NextResponse.json(
        { error: "Card ID and password cannot be empty" },
        { status: 400 }
      );
    }

    const student = await prisma.student.findUnique({
      where: { studentId: trimmedStudentId },
    });

    // Generic error prevents account enumeration
    if (!student) {
      return NextResponse.json(
        { error: "Invalid card ID or password" },
        { status: 401 }
      );
    }

    const isValid = await verifyStudentPassword(trimmedPassword, student.password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid card ID or password" },
        { status: 401 }
      );
    }

    // Set session
    await setStudentSession(student.studentId);

    return NextResponse.json({
      success: true,
      student: {
        studentId: student.studentId,
        name: `${student.firstName} ${student.lastName}`,
        class: student.class,
      },
    });
  } catch (error) {
    console.error("Student login error:", error);
    return NextResponse.json(
      { error: "An internal server error occurred" },
      { status: 500 }
    );
  }
}