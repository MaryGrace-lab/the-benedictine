import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail, statusUpdateEmail } from "@/lib/email";

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

    // Send status update email
    if (status) {
      const messages: Record<string, string> = {
        UNDER_REVIEW: "Your application is being reviewed by our admission committee.",
        AWAITING_TEST: "Your child has been shortlisted for the entrance test. Details coming soon.",
        TEST_SCHEDULED: "The entrance test has been scheduled. Check your email for details.",
        TEST_COMPLETED: "Your child has completed the test. Results being processed.",
        INTERVIEW_SCHEDULED: "An interview has been scheduled. Date and time sent to your email.",
        ACCEPTED: "Congratulations! Your child has been accepted. Admission letter available soon.",
        ADMITTED: "Welcome to The Benedictine Academy! Your child is now officially admitted.",
        REJECTED: "Unfortunately, the application was not successful. We wish you the best.",
      };

      if (messages[status]) {
        const emailData = statusUpdateEmail({
          parentName: application.fatherName,
          childName: `${application.surname} ${application.firstName}`,
          registrationNumber: application.registrationNumber!,
          status,
          message: messages[status],
        });
        sendEmail({ to: application.email, ...emailData });
      }
    }

    return NextResponse.json({ success: true, application });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: "Failed to update application" },
      { status: 500 }
    );
  }
}