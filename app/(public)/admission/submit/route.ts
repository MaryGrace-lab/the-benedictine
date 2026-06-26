import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
        middleName: body.middleName,
        gender: body.gender,
        dateOfBirth: body.dateOfBirth,
        placeOfBirth: body.placeOfBirth,
        nationality: body.nationality,
        stateOfOrigin: body.stateOfOrigin,
        lga: body.lga,
        religion: body.religion,
        bloodGroup: body.bloodGroup,
        genotype: body.genotype,

        // Parent
        fatherName: body.fatherName,
        motherName: body.motherName,
        guardianName: body.guardianName,
        occupation: body.occupation,
        email: body.email,
        phoneNumber: body.phoneNumber,
        alternatePhone: body.alternatePhone,
        residentialAddress: body.residentialAddress,
        emergencyContact: body.emergencyContact,
        emergencyPhone: body.emergencyPhone,

        // Academic
        previousSchool: body.previousSchool,
        previousClass: body.previousClass,
        applyingClass: body.applyingClass,
        session: body.session,

        // Medical
        allergies: body.allergies,
        medicalConditions: body.medicalConditions,
        specialNeeds: body.specialNeeds,
        emergencyMedicalInfo: body.emergencyMedicalInfo,

        // Documents
        birthCertificate: body.documents?.birthCertificate,
        passportPhoto: body.documents?.passportPhoto,
        previousResult: body.documents?.previousResult,
        medicalReport: body.documents?.medicalReport,
        recommendationLetter: body.documents?.recommendationLetter,

        submittedAt: new Date(),
      },
    });

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