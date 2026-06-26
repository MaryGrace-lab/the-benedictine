"use client";

import { useApplicationForm } from "../_hooks/useApplicationForm";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Users, GraduationCap, Heart, FileText } from "lucide-react";

export default function StepReview() {
  const formData = useApplicationForm();

  const sections = [
    {
      title: "Personal Information",
      icon: User,
      fields: [
        { label: "Surname", value: formData.surname },
        { label: "First Name", value: formData.firstName },
        { label: "Middle Name", value: formData.middleName || "—" },
        { label: "Gender", value: formData.gender },
        { label: "Date of Birth", value: formData.dateOfBirth },
        { label: "Place of Birth", value: formData.placeOfBirth },
        { label: "Nationality", value: formData.nationality },
        { label: "State of Origin", value: formData.stateOfOrigin },
        { label: "LGA", value: formData.lga },
        { label: "Religion", value: formData.religion },
        { label: "Blood Group", value: formData.bloodGroup || "—" },
        { label: "Genotype", value: formData.genotype || "—" },
      ],
    },
    {
      title: "Parent Information",
      icon: Users,
      fields: [
        { label: "Father's Name", value: formData.fatherName },
        { label: "Mother's Name", value: formData.motherName },
        { label: "Guardian", value: formData.guardianName || "—" },
        { label: "Occupation", value: formData.occupation },
        { label: "Email", value: formData.email },
        { label: "Phone", value: formData.phoneNumber },
        { label: "Alternate Phone", value: formData.alternatePhone || "—" },
        { label: "Address", value: formData.residentialAddress },
        { label: "Emergency Contact", value: formData.emergencyContact },
        { label: "Emergency Phone", value: formData.emergencyPhone },
      ],
    },
    {
      title: "Academic Information",
      icon: GraduationCap,
      fields: [
        { label: "Previous School", value: formData.previousSchool || "—" },
        { label: "Previous Class", value: formData.previousClass || "—" },
        { label: "Applying Class", value: formData.applyingClass },
        { label: "Session", value: formData.session },
      ],
    },
    {
      title: "Medical Information",
      icon: Heart,
      fields: [
        { label: "Allergies", value: formData.allergies || "None" },
        { label: "Medical Conditions", value: formData.medicalConditions || "None" },
        { label: "Special Needs", value: formData.specialNeeds || "None" },
        {
          label: "Emergency Medical Info",
          value: formData.emergencyMedicalInfo || "None",
        },
      ],
    },
  ];

  return (
    <div>
      <h2 className="mb-2 text-xl font-bold text-[#1B3A5C]">
        Review Your Application
      </h2>
      <p className="mb-6 text-sm text-gray-500">
        Please review all information before submitting. You can go back to any
        section to make changes.
      </p>

      <div className="space-y-4">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Card key={section.title}>
              <CardContent className="p-5">
                <div className="mb-3 flex items-center gap-2">
                  <Icon className="h-5 w-5 text-amber-500" />
                  <h3 className="font-semibold text-[#1B3A5C]">
                    {section.title}
                  </h3>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {section.fields.map((field) => (
                    <div
                      key={field.label}
                      className="flex justify-between rounded bg-gray-50 px-3 py-2 text-sm dark:bg-gray-800"
                    >
                      <span className="text-gray-500">{field.label}</span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {field.value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Documents Review */}
        <Card>
          <CardContent className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5 text-amber-500" />
              <h3 className="font-semibold text-[#1B3A5C]">
                Uploaded Documents
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.documents.birthCertificate ? (
                <Badge variant="success">Birth Certificate ✓</Badge>
              ) : (
                <Badge variant="destructive">Birth Certificate ✗</Badge>
              )}
              {formData.documents.passportPhoto ? (
                <Badge variant="success">Passport Photo ✓</Badge>
              ) : (
                <Badge variant="destructive">Passport Photo ✗</Badge>
              )}
              {formData.documents.previousResult ? (
                <Badge variant="success">Academic Results ✓</Badge>
              ) : (
                <Badge variant="warning">Academic Results —</Badge>
              )}
              {formData.documents.medicalReport ? (
                <Badge variant="success">Medical Report ✓</Badge>
              ) : (
                <Badge variant="destructive">Medical Report ✗</Badge>
              )}
              {formData.documents.recommendationLetter ? (
                <Badge variant="success">Recommendation ✓</Badge>
              ) : (
                <Badge variant="warning">Recommendation —</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}