// app/api/subjects/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const level = searchParams.get("level");
    const stream = searchParams.get("stream");

    const where: any = {};
    if (level) where.level = level;

    if (stream && level === "SSS") {
      // For SSS: show ALL subjects + stream-specific subjects
      where.OR = [
        { stream },
        { stream: "ALL" },
      ];
    }

    const subjects = await prisma.subject.findMany({
      where,
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ subjects });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch subjects" }, { status: 500 });
  }
}