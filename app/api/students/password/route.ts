// app/api/students/password/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromSession } from "@/lib/jwt";
import { generateInitialStudentPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const adminSession = await getAdminFromSession();

    if (!adminSession || adminSession.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { studentId } = await req.json();

    if (!studentId) {
      return NextResponse.json({ error: "Student ID is required" }, { status: 400 });
    }

    const student = await prisma.student.findUnique({
      where: { studentId },
      select: { firstName: true, lastName: true, studentId: true },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Generate a brand new random password instead of revealing the old one
    const { hashed, plaintext } = await generateInitialStudentPassword(
      student.lastName,
      student.studentId
    );

    // Update the student's password in the database
    await prisma.student.update({
      where: { studentId },
      data: {
        password: hashed,
        passwordResetRequired: true,
      },
    });

    return NextResponse.json({
      studentId: student.studentId,
      name: `${student.firstName} ${student.lastName}`,
      password: plaintext,
      note: "A new temporary password has been generated. The student must change it after logging in.",
    });
  } catch (error) {
    console.error("Password retrieval error:", error);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}