import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const application = await prisma.admissionApplication.findUnique({
      where: { id },
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, notes } = body;

    const updateData: any = {};

    if (status) {
      updateData.status = status;

      if (status === "UNDER_REVIEW") updateData.reviewedAt = new Date();
      if (["ACCEPTED", "REJECTED", "ADMITTED"].includes(status)) {
        updateData.decisionAt = new Date();
      }
    }

    if (notes !== undefined) {
      updateData.notes = notes;
    }

    const application = await prisma.admissionApplication.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, application });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: "Failed to update application" },
      { status: 500 }
    );
  }
}