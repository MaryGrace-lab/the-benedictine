// app/api/auth/student-login/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyStudentPassword } from "@/lib/auth";
import { setStudentSession } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    const { studentId, password } = await req.json();

    if (!studentId || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    const student = await prisma.student.findUnique({
      where: { studentId },
    });

    if (!student) {
      return NextResponse.json({ error: "Invalid card ID or password" }, { status: 401 });
    }

    const isValid = await verifyStudentPassword(password, student.password);

    if (!isValid) {
      return NextResponse.json({ error: "Invalid card ID or password" }, { status: 401 });
    }

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
    console.error("Login error:", error);
    return NextResponse.json({ error: "An internal server error occurred" }, { status: 500 });
  }
}