// app/api/admission/submit/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { sendEmail, applicationSubmittedEmail } from "@/lib/email";

const AdmissionSchema = z.object({
  surname: z.string().min(1).max(50),
  firstName: z.string().min(1).max(50),
  middleName: z.string().max(50).nullable().optional(),
  gender: z.string().min(1),
  dateOfBirth: z.string().min(1),
  placeOfBirth: z.string().min(1),
  nationality: z.string().default("Nigerian"),
  stateOfOrigin: z.string().min(1),
  lga: z.string().min(1),
  religion: z.string().min(1),
  bloodGroup: z.string().nullable().optional(),
  genotype: z.string().nullable().optional(),

  fatherName: z.string().min(1),
  motherName: z.string().min(1),
  guardianName: z.string().nullable().optional(),
  occupation: z.string().min(1),
  email: z.string().email(),
  phoneNumber: z.string().min(1),
  alternatePhone: z.string().nullable().optional(),
  residentialAddress: z.string().min(1),
  emergencyContact: z.string().min(1),
  emergencyPhone: z.string().min(1),

  previousSchool: z.string().nullable().optional(),
  previousClass: z.string().nullable().optional(),
  applyingClass: z.string().min(1),
  session: z.string().default("2026/2027"),

  allergies: z.string().nullable().optional(),
  medicalConditions: z.string().nullable().optional(),
  specialNeeds: z.string().nullable().optional(),
  emergencyMedicalInfo: z.string().nullable().optional(),

  documents: z.object({
    birthCertificate: z.string().nullable().optional(),
    passportPhoto: z.string().nullable().optional(),
    previousResult: z.string().nullable().optional(),
    medicalReport: z.string().nullable().optional(),
    recommendationLetter: z.string().nullable().optional(),
  }).optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = AdmissionSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Optional: Prevent accidental duplicate for the *same* child
    const duplicate = await prisma.admissionApplication.findFirst({
      where: {
        email: data.email,
        surname: data.surname,
        firstName: data.firstName,
        applyingClass: data.applyingClass,
        status: { not: "REJECTED" },
      },
    });

    if (duplicate) {
      return NextResponse.json(
        { error: "An application for this child already exists." },
        { status: 409 }
      );
    }

    // Generate registration number
    const year = new Date().getFullYear();
    const count = await prisma.admissionApplication.count();
    const registrationNumber = `TBA/${year}/${String(count + 1).padStart(4, "0")}`;

    const application = await prisma.admissionApplication.create({
      data: {
        registrationNumber,
        status: "SUBMITTED",
        currentStep: 6,
        surname: data.surname,
        firstName: data.firstName,
        middleName: data.middleName ?? null,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth,
        placeOfBirth: data.placeOfBirth,
        nationality: data.nationality,
        stateOfOrigin: data.stateOfOrigin,
        lga: data.lga,
        religion: data.religion,
        bloodGroup: data.bloodGroup ?? null,
        genotype: data.genotype ?? null,
        fatherName: data.fatherName,
        motherName: data.motherName,
        guardianName: data.guardianName ?? null,
        occupation: data.occupation,
        email: data.email,
        phoneNumber: data.phoneNumber,
        alternatePhone: data.alternatePhone ?? null,
        residentialAddress: data.residentialAddress,
        emergencyContact: data.emergencyContact,
        emergencyPhone: data.emergencyPhone,
        previousSchool: data.previousSchool ?? null,
        previousClass: data.previousClass ?? null,
        applyingClass: data.applyingClass,
        session: data.session,
        allergies: data.allergies ?? null,
        medicalConditions: data.medicalConditions ?? null,
        specialNeeds: data.specialNeeds ?? null,
        emergencyMedicalInfo: data.emergencyMedicalInfo ?? null,
        birthCertificate: data.documents?.birthCertificate ?? null,
        passportPhoto: data.documents?.passportPhoto ?? null,
        previousResult: data.documents?.previousResult ?? null,
        medicalReport: data.documents?.medicalReport ?? null,
        recommendationLetter: data.documents?.recommendationLetter ?? null,
        submittedAt: new Date(),
      },
    });

    // Send confirmation to parent
    const emailData = applicationSubmittedEmail({
      parentName: data.fatherName,
      childName: `${data.surname} ${data.firstName}`,
      registrationNumber: application.registrationNumber!,
      applyingClass: data.applyingClass,
      session: data.session,
    });
    sendEmail({ to: data.email, ...emailData });

    // Send alert to school
    sendEmail({
      to: "thebenedictineacademy@gmail.com",
      subject: `New Application – ${application.registrationNumber}`,
      html: `
        <p>A new admission application has been submitted:</p>
        <p><strong>Student:</strong> ${data.surname} ${data.firstName}</p>
        <p><strong>Class:</strong> ${data.applyingClass}</p>
        <p><strong>Registration:</strong> ${application.registrationNumber}</p>
        <p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin-portal/admission">
            Review in Admin Portal
          </a>
        </p>
      `,
    });

    return NextResponse.json({
      success: true,
      registrationNumber: application.registrationNumber,
      applicationId: application.id,
      message: "Application submitted successfully",
    });
  } catch (error) {
    console.error("Admission submit error:", error);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}