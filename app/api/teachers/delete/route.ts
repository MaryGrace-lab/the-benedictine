import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromSession } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    const adminSession = await getAdminFromSession();
    if (!adminSession || adminSession.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { teacherId } = await req.json();
    const teacher = await prisma.user.findUnique({ where: { id: teacherId } });
    if (!teacher || teacher.role !== "TEACHER") {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    }

    await prisma.user.delete({ where: { id: teacherId } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete teacher" }, { status: 500 });
  }
}