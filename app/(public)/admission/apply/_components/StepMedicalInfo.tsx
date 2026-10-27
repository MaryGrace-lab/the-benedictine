"use client";

import { useApplicationForm } from "../_hooks/useApplicationForm";
import { Label } from "@/components/ui/label";

interface Props {
  errors?: Record<string, string>;
}

export default function StepMedicalInfo({ errors = {} }: Props) {
  const {
    allergies,
    medicalConditions,
    specialNeeds,
    emergencyMedicalInfo,
    updateField,
  } = useApplicationForm();

  const textareaClass = (field: string) =>
    `mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[#1B3A5C] focus:outline-none focus:ring-1 focus:ring-[#1B3A5C] dark:border-gray-700 dark:bg-gray-800 ${
      errors[field] ? "border-red-500 focus:border-red-500 focus:ring-red-200" : ""
    }`;

  return (
    <div>
      <h2 className="mb-6 text-xl font-bold text-[#1B3A5C]">Medical Information</h2>
      <p className="mb-6 text-sm text-gray-500">
        This information helps us provide proper care for your child. All
        information is kept confidential.
      </p>
      <div className="space-y-5">
        <div>
          <Label htmlFor="allergies">Allergies (if any)</Label>
          <textarea
            id="allergies"
            value={allergies}
            onChange={(e) => updateField("allergies", e.target.value)}
            rows={2}
            placeholder="List any known allergies (food, medication, environmental)"
            className={textareaClass("allergies")}
          />
        </div>

        <div>
          <Label htmlFor="medicalConditions">Existing Medical Conditions (if any)</Label>
          <textarea
            id="medicalConditions"
            value={medicalConditions}
            onChange={(e) => updateField("medicalConditions", e.target.value)}
            rows={2}
            placeholder="Describe any existing medical conditions"
            className={textareaClass("medicalConditions")}
          />
        </div>

        <div>
          <Label htmlFor="specialNeeds">Special Needs (if any)</Label>
          <textarea
            id="specialNeeds"
            value={specialNeeds}
            onChange={(e) => updateField("specialNeeds", e.target.value)}
            rows={2}
            placeholder="Describe any special needs or accommodations required"
            className={textareaClass("specialNeeds")}
          />
        </div>

        <div>
          <Label htmlFor="emergencyMedicalInfo">Emergency Medical Information</Label>
          <textarea
            id="emergencyMedicalInfo"
            value={emergencyMedicalInfo}
            onChange={(e) => updateField("emergencyMedicalInfo", e.target.value)}
            rows={2}
            placeholder="Doctor's name, hospital preference, blood type, etc."
            className={textareaClass("emergencyMedicalInfo")}
          />
        </div>
      </div>
    </div>
  );
}