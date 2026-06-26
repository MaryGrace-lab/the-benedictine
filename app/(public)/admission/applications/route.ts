import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const registrationNumber = searchParams.get("registrationNumber");

    if (!email && !registrationNumber) {
      return NextResponse.json(
        { error: "Email or registration number required" },
        { status: 400 }
      );
    }

    const where = registrationNumber
      ? { registrationNumber }
      : { email: email! };

    const application = await prisma.admissionApplication.findFirst({
      where,
      select: {
        id: true,
        registrationNumber: true,
        status: true,
        applyingClass: true,
        session: true,
        surname: true,
        firstName: true,
        submittedAt: true,
        reviewedAt: true,
        decisionAt: true,
        admissionLetter: true,
        paymentStatus: true,
        notes: true,
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ application });
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch application" },
      { status: 500 }
    );
  }
}