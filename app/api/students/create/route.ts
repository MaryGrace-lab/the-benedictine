// app/api/students/create/route.ts
// Student Creation API — Admin Only

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromSession } from "@/lib/jwt";
import {
  generateInitialStudentPassword,
  hashPassword,
  validatePasswordStrength,
} from "@/lib/auth";
import { z } from "zod";

const CreateStudentSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  studentId: z.string().min(1, "Student ID is required").max(20),
  studentClass: z.enum(
    ["JSS 1", "JSS 2", "JSS 3", "SSS 1", "SSS 2", "SSS 3"],
    { message: "Invalid class" }
  ),
  studentType: z.enum(["SCIENCE", "ART", "COMMERCIAL"]).nullable().optional(),
  guardianName: z.string().max(100).nullable().optional(),
  guardianPhone: z.string().max(20).nullable().optional(),
  password: z.string().min(8).max(72).optional(),
});

export async function POST(req: Request) {
  try {
    const adminSession = await getAdminFromSession();
    if (!adminSession || adminSession.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validation = CreateStudentSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const {
      firstName,
      lastName,
      studentId,
      studentClass,
      studentType,
      guardianName,
      guardianPhone,
      password: customPassword,
    } = validation.data;

    // Generate or use custom password
    let plaintext: string;
    let hashed: string;

    if (customPassword) {
      const strength = validatePasswordStrength(customPassword);
      if (!strength.valid) {
        return NextResponse.json(
          { error: strength.message },
          { status: 400 }
        );
      }
      hashed = await hashPassword(customPassword);
      plaintext = customPassword;
    } else {
      const generated = await generateInitialStudentPassword(
        lastName,
        studentId
      );
      hashed = generated.hashed;
      plaintext = generated.plaintext;
    }

    const student = await prisma.student.create({
      data: {
        studentId: studentId.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        class: studentClass,
        studentType: studentType || null,
        password: hashed,
        passwordResetRequired: true,
        guardianName: guardianName?.trim() || null,
        guardianPhone: guardianPhone?.trim() || null,
      },
    });

    return NextResponse.json({
      success: true,
      student: {
        id: student.id,
        studentId: student.studentId,
        name: `${student.firstName} ${student.lastName}`,
        class: student.class,
        studentType: student.studentType,
      },
      cardDetails: {
        studentId: student.studentId,
        temporaryPassword: plaintext,
        instruction:
          "Login with your Card ID and this password. Change your password after first login.",
      },
    });
  } catch (error: any) {
    console.error("Student creation error:", error);

    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "A student with this Card ID already exists." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create student profile" },
      { status: 500 }
    );
  }
}