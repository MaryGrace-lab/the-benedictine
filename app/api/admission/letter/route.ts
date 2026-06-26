import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateAdmissionLetterPDF } from "@/lib/pdf/renderLetter";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  const app = await prisma.admissionApplication.findUnique({ where: { id } });
  if (!app) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (app.status !== "ADMITTED" && app.status !== "ACCEPTED") {
    return NextResponse.json({ error: "Not admitted" }, { status: 403 });
  }

  const stream = await generateAdmissionLetterPDF({
    registrationNumber: app.registrationNumber || "",
    studentName: `${app.surname} ${app.firstName}`,
    applyingClass: app.applyingClass,
    session: app.session,
    parentName: app.fatherName,
    date: new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  });

  return new NextResponse(stream as any, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="admission-letter-${app.registrationNumber}.pdf"`,
    },
  });
}