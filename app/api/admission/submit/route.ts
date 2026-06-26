import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail, applicationSubmittedEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Generate registration number
    const year = new Date().getFullYear();
    const count = await prisma.admissionApplication.count();
    const registrationNumber = `TBA/${year}/${String(count + 1).padStart(4, "0")}`;

    const application = await prisma.admissionApplication.create({
      data: {
        registrationNumber,
        status: "SUBMITTED",
        currentStep: 6,

        // Personal
        surname: body.surname,
        firstName: body.firstName,
        middleName: body.middleName || null,
        gender: body.gender,
        dateOfBirth: body.dateOfBirth,
        placeOfBirth: body.placeOfBirth,
        nationality: body.nationality || "Nigerian",
        stateOfOrigin: body.stateOfOrigin,
        lga: body.lga,
        religion: body.religion,
        bloodGroup: body.bloodGroup || null,
        genotype: body.genotype || null,

        // Parent
        fatherName: body.fatherName,
        motherName: body.motherName,
        guardianName: body.guardianName || null,
        occupation: body.occupation,
        email: body.email,
        phoneNumber: body.phoneNumber,
        alternatePhone: body.alternatePhone || null,
        residentialAddress: body.residentialAddress,
        emergencyContact: body.emergencyContact,
        emergencyPhone: body.emergencyPhone,

        // Academic
        previousSchool: body.previousSchool || null,
        previousClass: body.previousClass || null,
        applyingClass: body.applyingClass,
        session: body.session,

        // Medical
        allergies: body.allergies || null,
        medicalConditions: body.medicalConditions || null,
        specialNeeds: body.specialNeeds || null,
        emergencyMedicalInfo: body.emergencyMedicalInfo || null,

        // Documents (paths from upload)
        birthCertificate: body.documents?.birthCertificate || null,
        passportPhoto: body.documents?.passportPhoto || null,
        previousResult: body.documents?.previousResult || null,
        medicalReport: body.documents?.medicalReport || null,
        recommendationLetter: body.documents?.recommendationLetter || null,

        submittedAt: new Date(),
      },
    });

    const emailData = applicationSubmittedEmail({
      parentName: body.fatherName,
      childName: `${body.surname} ${body.firstName}`,
      registrationNumber: application.registrationNumber!,
      applyingClass: body.applyingClass,
      session: body.session,
    });

    sendEmail({ to: body.email, ...emailData });

    return NextResponse.json({
      success: true,
      registrationNumber: application.registrationNumber,
      applicationId: application.id,
    });
  } catch (error) {
    console.error("Submit error:", error);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}