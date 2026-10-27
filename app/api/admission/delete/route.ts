import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromSession } from "@/lib/jwt";
import { z } from "zod";

const DeleteSchema = z.object({
  ids: z.array(z.string()).min(1),
});

export async function POST(req: Request) {
  try {
    const admin = await getAdminFromSession();
    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 401 });
    }

    const body = await req.json();
    const validation = DeleteSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { ids } = validation.data;

    // Delete all applications with the given IDs
    const result = await prisma.admissionApplication.deleteMany({
      where: { id: { in: ids } },
    });

    return NextResponse.json({
      success: true,
      deleted: result.count,
      message: `${result.count} application(s) deleted`,
    });
  } catch (error) {
    console.error("Admission delete error:", error);
    return NextResponse.json({ error: "Failed to delete applications" }, { status: 500 });
  }
}