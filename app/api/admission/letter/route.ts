// app/api/admission/letter/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromSession } from "@/lib/jwt";
import { generateAdmissionLetterPDF } from "@/lib/pdf/renderLetter";

export async function GET(request: NextRequest) {
  try {
    const adminSession = await getAdminFromSession();
    if (!adminSession || adminSession.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing application ID" },
        { status: 400 }
      );
    }

    const app = await prisma.admissionApplication.findUnique({
      where: { id },
      select: {
        id: true,
        registrationNumber: true,
        surname: true,
        firstName: true,
        applyingClass: true,
        session: true,
        fatherName: true,
        status: true,
      },
    });

    if (!app) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    if (app.status !== "ADMITTED" && app.status !== "ACCEPTED") {
      return NextResponse.json(
        { error: "Student has not been admitted yet" },
        { status: 403 }
      );
    }

    const pdfBuffer = await generateAdmissionLetterPDF({
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

    // Convert Buffer to Uint8Array for NextResponse compatibility
    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="admission-letter-${app.registrationNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Admission letter error:", error);
    return NextResponse.json(
      { error: "Failed to generate admission letter" },
      { status: 500 }
    );
  }
}