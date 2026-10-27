import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromSession } from "@/lib/jwt";
import { z } from "zod";

const PromoteSchema = z.object({
  studentIds: z.array(z.string()).min(1, "Select at least one student"),
  targetClass: z.enum(["JSS 1", "JSS 2", "JSS 3", "SSS 1", "SSS 2", "SSS 3"], {
    message: "Invalid target class",
  }),
});

export async function POST(req: Request) {
  try {
    const admin = await getAdminFromSession();
    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 401 });
    }

    const body = await req.json();
    const validation = PromoteSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 });
    }

    const { studentIds, targetClass } = validation.data;

    // Update all selected students to the new class
    const result = await prisma.student.updateMany({
      where: { studentId: { in: studentIds } },
      data: { class: targetClass },
    });

    return NextResponse.json({
      success: true,
      promoted: result.count,
      message: `${result.count} student(s) promoted to ${targetClass}`,
    });
  } catch (error) {
    console.error("Promotion error:", error);
    return NextResponse.json({ error: "Failed to promote students" }, { status: 500 });
  }
}