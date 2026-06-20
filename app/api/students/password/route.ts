// app/api/students/password/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromSession } from "@/lib/jwt";
import { getPlaintextStudentPassword } from "@/lib/auth";

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

    const plainPassword = getPlaintextStudentPassword(student.lastName, student.studentId);

    return NextResponse.json({
      studentId: student.studentId,
      name: `${student.firstName} ${student.lastName}`,
      password: plainPassword,
      note: "This is the auto-generated password. Student may have changed it.",
    });
  } catch (error) {
    console.error("Password retrieval error:", error);
    return NextResponse.json({ error: "Failed to retrieve password" }, { status: 500 });
  }
}