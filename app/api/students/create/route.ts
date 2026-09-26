// app/api/students/create/route.ts
// Student Creation API — Admin Only

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromSession } from "@/lib/jwt";
import {
  generateInitialStudentPassword,
  generateStudentPin,
  hashPin,
  hashPassword,
  validatePasswordStrength,
} from "@/lib/auth";
import { z } from "zod";

const CreateStudentSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  gender: z.enum(["MALE", "FEMALE"]).nullable().optional(),
  schoolId: z.string().max(50).min(1, "School ID is required"),
  studentId: z.string().min(1, "Card ID is required").max(30),
  studentClass: z.enum(
    ["JSS 1", "JSS 2", "JSS 3", "SSS 1", "SSS 2", "SSS 3"],
    { message: "Invalid class" }
  ),
  studentType: z.enum(["SCIENCE", "ART", "COMMERCIAL"]).nullable().optional(),
  guardianName: z.string().max(100).nullable().optional(),
  guardianPhone: z.string().max(20).nullable().optional(),
  password: z.string().min(8).max(72).optional(),
  pin: z.string().regex(/^\d{4,6}$/, "PIN must be 4–6 digits").optional(),
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
      gender,
      schoolId,
      studentId,
      studentClass,
      studentType,
      guardianName,
      guardianPhone,
      password: customPassword,
      pin: customPin,
    } = validation.data;

    // Generate or use custom password
    let plaintextPassword: string;
    let hashedPasswordValue: string;

    if (customPassword) {
      const strength = validatePasswordStrength(customPassword);
      if (!strength.valid) {
        return NextResponse.json({ error: strength.message }, { status: 400 });
      }
      hashedPasswordValue = await hashPassword(customPassword);
      plaintextPassword = customPassword;
    } else {
      const generated = await generateInitialStudentPassword(lastName, studentId);
      hashedPasswordValue = generated.hashed;
      plaintextPassword = generated.plaintext;
    }

    // Generate or use custom PIN
    let plaintextPin: string;
    let hashedPinValue: string;

    if (customPin) {
      hashedPinValue = await hashPin(customPin);
      plaintextPin = customPin;
    } else {
      plaintextPin = generateStudentPin();
      hashedPinValue = await hashPin(plaintextPin);
    }

    const student = await prisma.student.create({
      data: {
        studentId: studentId.trim(),
        schoolId: schoolId?.trim() || null,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        gender: gender || null,
        class: studentClass,
        studentType: studentType || null,
        password: hashedPasswordValue,
        pin: hashedPinValue,
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
        schoolId: student.schoolId,
        name: `${student.firstName} ${student.lastName}`,
        gender: student.gender,
        class: student.class,
        studentType: student.studentType,
      },
      cardDetails: {
        studentId: student.studentId,
        schoolId: student.schoolId,
        temporaryPassword: plaintextPassword,
        pin: plaintextPin,
        instruction:
          "Login with your Card ID and password. Enter the PIN to view results.",
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