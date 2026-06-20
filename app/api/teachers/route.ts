// app/api/teachers/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromSession } from "@/lib/jwt";

export async function GET() {
  try {
    const adminSession = await getAdminFromSession();
    if (!adminSession || adminSession.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const teachers = await prisma.user.findMany({
      where: { role: "TEACHER" },
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, role: true, assignedClass: true, createdAt: true },
    });

    return NextResponse.json({ teachers });
  } catch {
    return NextResponse.json({ error: "Failed to fetch teachers" }, { status: 500 });
  }
}