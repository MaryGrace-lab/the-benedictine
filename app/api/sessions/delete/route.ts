// app/api/sessions/delete/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromSession } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    const adminSession = await getAdminFromSession();

    if (!adminSession || adminSession.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId, confirmation } = await req.json();

    if (!sessionId || !confirmation) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (confirmation !== "DELETE") {
      return NextResponse.json({ error: "Invalid confirmation text" }, { status: 400 });
    }

    const session = await prisma.academicSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Check if session has results
    const resultCount = await prisma.result.count({
      where: { sessionId },
    });

    if (resultCount > 0) {
      return NextResponse.json({
        error: `Cannot delete this session. It contains ${resultCount} student results. Remove all results first or contact support.`,
      }, { status: 409 });
    }

    // Delete session — cascades to related records if any
    await prisma.academicSession.delete({
      where: { id: sessionId },
    });

    return NextResponse.json({
      success: true,
      message: `Session ${session.year} - ${session.term} has been permanently deleted.`,
    });
  } catch (error) {
    console.error("Session deletion error:", error);
    return NextResponse.json({ error: "Failed to delete session" }, { status: 500 });
  }
}