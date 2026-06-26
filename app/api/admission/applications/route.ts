import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const registrationNumber = searchParams.get("registrationNumber");

    // Admin: list all applications
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const applyingClass = searchParams.get("class");

    // If email or registrationNumber provided, return single application (public tracking)
    if (email || registrationNumber) {
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
        },
      });

      if (!application) {
        return NextResponse.json(
          { error: "Application not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ application });
    }

    // Admin: build filters
    const where: any = {};

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