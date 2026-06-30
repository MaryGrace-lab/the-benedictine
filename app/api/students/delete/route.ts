// app/api/students/delete/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromSession } from "@/lib/jwt";
import { z } from "zod";

const DeleteStudentSchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
  confirmation: z.literal("DELETE", {
    message: 'You must type "DELETE" to confirm',
  }),
});

export async function POST(req: Request) {
  try {
    const adminSession = await getAdminFromSession();

    if (!adminSession || adminSession.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validation = DeleteStudentSchema.safeParse(body);

    if (!validation.success) {
      // Zod 4 returns issues array, not errors
      const firstIssue = validation.error.issues[0];
      return NextResponse.json(
        { error: firstIssue?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { studentId } = validation.data;

    const student = await prisma.student.findUnique({
      where: { studentId },
      select: { firstName: true, lastName: true, id: true },
    });

    if (!student) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    await prisma.student.delete({
      where: { studentId },
    });

    return NextResponse.json({
      success: true,
      message: `Student ${student.firstName} ${student.lastName} and all associated records have been permanently deleted.`,
    });
  } catch (error) {
    console.error("Student deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete student" },
      { status: 500 }
    );
  }
}