// app/api/auth/change-password/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import {
  verifyStudentPassword,
  hashPassword,
  validatePasswordStrength,
} from "@/lib/auth";
import {
  getStudentFromSession,
  getAdminFromSession,
  getTeacherFromSession,
} from "@/lib/jwt";
import { verifyCsrfToken } from "@/lib/csrf";

export async function POST(req: Request) {
  const csrfToken = req.headers.get("x-csrf-token");
  if (!csrfToken || !(await verifyCsrfToken(csrfToken))) {
    return NextResponse.json(
      { error: "Invalid security token" },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { currentPassword, newPassword, role } = body;

    // Input validation
    if (!currentPassword || !newPassword || !role) {
      return NextResponse.json(
        { error: "Current password, new password, and role are required" },
        { status: 400 }
      );
    }

    if (typeof currentPassword !== "string" || typeof newPassword !== "string") {
      return NextResponse.json(
        { error: "Invalid input format" },
        { status: 400 }
      );
    }

    const trimmedCurrent = currentPassword.trim();
    const trimmedNew = newPassword.trim();

    if (!trimmedCurrent || !trimmedNew) {
      return NextResponse.json(
        { error: "Passwords cannot be empty" },
        { status: 400 }
      );
    }

    // Validate password strength
    const strengthCheck = validatePasswordStrength(trimmedNew);
    if (!strengthCheck.valid) {
      return NextResponse.json(
        { error: strengthCheck.message },
        { status: 400 }
      );
    }

    // Prevent using same password
    if (trimmedCurrent === trimmedNew) {
      return NextResponse.json(
        { error: "New password must be different from current password" },
        { status: 400 }
      );
    }

    // ── Student Password Change ──
    if (role === "student") {
      const studentId = await getStudentFromSession();
      if (!studentId) {
        return NextResponse.json(
          { error: "Not authenticated" },
          { status: 401 }
        );
      }

      const student = await prisma.student.findUnique({
        where: { studentId },
      });

      if (!student) {
        return NextResponse.json(
          { error: "Student not found" },
          { status: 404 }
        );
      }

      const isValid = await verifyStudentPassword(trimmedCurrent, student.password);
      if (!isValid) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 401 }
        );
      }

      // Prevent reuse of last 5 passwords
      const previousPasswords = await prisma.passwordHistory.findMany({
        where: { studentId: student.id },
        orderBy: { createdAt: "desc" },
        take: 5,
      });

      for (const record of previousPasswords) {
        const usedBefore = await bcrypt.compare(trimmedNew, record.passwordHash);
        if (usedBefore) {
          return NextResponse.json(
            { error: "You cannot reuse any of your last 5 passwords" },
            { status: 400 }
          );
        }
      }

      // Save current password to history before update
      await prisma.passwordHistory.create({
        data: {
          studentId: student.id,
          passwordHash: student.password,
        },
      });

      // Update to new password
      const hashedNewPassword = await hashPassword(trimmedNew);
      await prisma.student.update({
        where: { studentId },
        data: {
          password: hashedNewPassword,
          passwordResetRequired: false,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Password changed successfully. Please login with your new password.",
      });
    }

    // ── Admin Password Change ──
    if (role === "admin") {
      const adminSession = await getAdminFromSession();
      if (!adminSession || adminSession.role !== "ADMIN") {
        return NextResponse.json(
          { error: "Not authenticated" },
          { status: 401 }
        );
      }

      const user = await prisma.user.findUnique({
        where: { id: adminSession.userId },
      });

      if (!user) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }

      const isValid = await bcrypt.compare(trimmedCurrent, user.password);
      if (!isValid) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 401 }
        );
      }

      const hashedNewPassword = await bcrypt.hash(trimmedNew, 10);
      await prisma.user.update({
        where: { id: adminSession.userId },
        data: { password: hashedNewPassword },
      });

      return NextResponse.json({
        success: true,
        message: "Password changed successfully. Please login with your new password.",
      });
    }

    // ── Teacher Password Change ──
    if (role === "teacher") {
      const teacherSession = await getTeacherFromSession();
      if (!teacherSession || teacherSession.role !== "TEACHER") {
        return NextResponse.json(
          { error: "Not authenticated" },
          { status: 401 }
        );
      }

      const user = await prisma.user.findUnique({
        where: { id: teacherSession.userId },
      });

      if (!user) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }

      const isValid = await bcrypt.compare(trimmedCurrent, user.password);
      if (!isValid) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 401 }
        );
      }

      const hashedNewPassword = await bcrypt.hash(trimmedNew, 10);
      await prisma.user.update({
        where: { id: teacherSession.userId },
        data: { password: hashedNewPassword },
      });

      return NextResponse.json({
        success: true,
        message: "Password changed successfully. Please login with your new password.",
      });
    }

    return NextResponse.json(
      { error: "Invalid role specified" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Password change error:", error);
    return NextResponse.json(
      { error: "Failed to change password" },
      { status: 500 }
    );
  }
}