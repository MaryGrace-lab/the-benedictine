// app/api/students/delete/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromSession } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    const adminSession = await getAdminFromSession();

    if (!adminSession || adminSession.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { studentId, confirmation } = await req.json();

    if (!studentId || !confirmation) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Require typing "DELETE" to confirm
    if (confirmation !== "DELETE") {
      return NextResponse.json({ error: "Invalid confirmation text" }, { status: 400 });
    }

    // Find student first
    const student = await prisma.student.findUnique({
      where: { studentId },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Delete student — cascades to all related records
    // (Result, SocialBehaviour, Attendance, ResultSummary)
    await prisma.student.delete({
      where: { studentId },
    });

    return NextResponse.json({
      success: true,
      message: `Student ${student.firstName} ${student.lastName} and all associated records have been permanently deleted.`,
    });
  } catch (error) {
    console.error("Student deletion error:", error);
    return NextResponse.json({ error: "Failed to delete student" }, { status: 500 });
  }
}