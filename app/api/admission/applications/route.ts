//app/api/admission/applications/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromSession } from "@/lib/jwt";
import { z } from "zod";

// Validation for public tracking
const TrackingSchema = z.object({
  email: z.string().email().optional(),
  registrationNumber: z.string().optional(),
}).refine((data) => data.email || data.registrationNumber, {
  message: "Email or Registration Number is required",
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const registrationNumber = searchParams.get("registrationNumber");

    // PUBLIC: Track single application by email or registration number
    if (email || registrationNumber) {
      const trackingValidation = TrackingSchema.safeParse({ email, registrationNumber });
      
      if (!trackingValidation.success) {
        return NextResponse.json(
          { error: "Email or Registration Number is required" },
          { status: 400 }
        );
      }

      const where = registrationNumber
        ? { registrationNumber: registrationNumber.trim() }
        : { email: email!.trim().toLowerCase() };

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
        },
      });

      if (!application) {
        return NextResponse.json(
          { error: "Application not found. Please check your details." },
          { status: 404 }
        );
      }

      return NextResponse.json({ application });
    }

    // ADMIN: List all applications (requires authentication)
    const adminSession = await getAdminFromSession();
    if (!adminSession || adminSession.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Admin access required to view all applications" },
        { status: 401 }
      );
    }

    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const applyingClass = searchParams.get("class");

    const where: Record<string, unknown> = {};

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (applyingClass && applyingClass !== "ALL") {
      where.applyingClass = applyingClass;
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { surname: { contains: search, mode: "insensitive" } },
        { registrationNumber: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const [applications, total] = await Promise.all([
      prisma.admissionApplication.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          registrationNumber: true,
          surname: true,
          firstName: true,
          gender: true,
          applyingClass: true,
          status: true,
          email: true,
          phoneNumber: true,
          submittedAt: true,
          createdAt: true,
        },
      }),
      prisma.admissionApplication.count({ where }),
    ]);

    return NextResponse.json({
      applications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}