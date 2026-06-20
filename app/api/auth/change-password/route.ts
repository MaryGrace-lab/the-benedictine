// app/api/auth/change-password/route.ts
// ──────────────────────────────────────────────
// Change Password API — All Roles
// ──────────────────────────────────────────────

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyStudentPassword, hashPassword } from "@/lib/auth";
import { getStudentFromSession, getAdminFromSession, getTeacherFromSession } from "@/lib/jwt";
import * as bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { currentPassword, newPassword, role } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Missing password fields" }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "New password must be at least 6 characters" }, { status: 400 });
    }

    // ── Student Password Change ──
    if (role === "student") {
      const studentId = await getStudentFromSession();
      if (!studentId) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
      }

      const student = await prisma.student.findUnique({
        where: { studentId },
      });

      if (!student) {
        return NextResponse.json({ error: "Student not found" }, { status: 404 });
      }

      const isValid = await verifyStudentPassword(currentPassword, student.password);
      if (!isValid) {
        return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });
      }

      const hashedNewPassword = await hashPassword(newPassword);
      await prisma.student.update({
        where: { studentId },
        data: { password: hashedNewPassword },
      });

      return NextResponse.json({ success: true, message: "Password changed successfully" });
    }

    // ── Admin Password Change ──
    if (role === "admin") {
      const adminSession = await getAdminFromSession();
      if (!adminSession || adminSession.role !== "ADMIN") {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
      }

      const user = await prisma.user.findUnique({
        where: { id: adminSession.userId },
      });

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) {
        return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({
        where: { id: adminSession.userId },
        data: { password: hashedNewPassword },
      });

      return NextResponse.json({ success: true, message: "Password changed successfully" });
    }

    // ── Teacher Password Change ──
    if (role === "teacher") {
      const teacherSession = await getTeacherFromSession();
      if (!teacherSession || teacherSession.role !== "TEACHER") {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
      }

      const user = await prisma.user.findUnique({
        where: { id: teacherSession.userId },
      });

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) {
        return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({
        where: { id: teacherSession.userId },
        data: { password: hashedNewPassword },
      });

      return NextResponse.json({ success: true, message: "Password changed successfully" });
    }

    return NextResponse.json({ error: "Invalid role specified" }, { status: 400 });
  } catch (error) {
    console.error("Password change error:", error);
    return NextResponse.json({ error: "Failed to change password" }, { status: 500 });
  }
}