"use client";

import { useApplicationForm } from "../_hooks/useApplicationForm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const classOptions = [
  { value: "pre-nursery-1", label: "Pre-Nursery 1" },
  { value: "pre-nursery-2", label: "Pre-Nursery 2" },
  { value: "nursery-1", label: "Nursery 1" },
  { value: "nursery-2", label: "Nursery 2" },
  { value: "nursery-3", label: "Nursery 3" },
  { value: "primary-1", label: "Primary 1" },
  { value: "primary-2", label: "Primary 2" },
  { value: "primary-3", label: "Primary 3" },
  { value: "primary-4", label: "Primary 4" },
  { value: "primary-5", label: "Primary 5" },
  { value: "primary-6", label: "Primary 6" },
  { value: "jss1", label: "JSS 1" },
  { value: "jss2", label: "JSS 2" },
  { value: "jss3", label: "JSS 3" },
  { value: "sss1", label: "SSS 1" },
  { value: "sss2", label: "SSS 2" },
  { value: "sss3", label: "SSS 3" },
];

interface Props {
  errors?: Record<string, string>;
}

export default function StepAcademicInfo({ errors = {} }: Props) {
  const { previousSchool, previousClass, applyingClass, session, updateField } =
    useApplicationForm();

  const inputClass = (field: string) =>
    `mt-1 ${errors[field] ? "border-red-500 focus:border-red-500 focus:ring-red-200" : ""}`;

  return (
    <div>
      <h2 className="mb-6 text-xl font-bold text-[#1B3A5C]">Academic Information</h2>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="previousSchool">Previous School</Label>
          <Input
            id="previousSchool"
            value={previousSchool}
            onChange={(e) => updateField("previousSchool", e.target.value)}
            placeholder="Name of previous school"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="previousClass">Previous Class</Label>
          <Input
            id="previousClass"
            value={previousClass}
            onChange={(e) => updateField("previousClass", e.target.value)}
            placeholder="Last class completed"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="applyingClass">Applying Class *</Label>
          <select
            id="applyingClass"
            title="Select applying class"
            value={applyingClass}
            onChange={(e) => updateField("applyingClass", e.target.value)}
            className={`mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[#1B3A5C] focus:outline-none focus:ring-1 focus:ring-[#1B3A5C] dark:border-gray-700 dark:bg-gray-800 ${
              errors.applyingClass ? "border-red-500 focus:border-red-500 focus:ring-red-200" : ""
            }`}
          >
            <option value="">Select class</option>
            {classOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {errors.applyingClass && (
            <p className="text-xs text-red-500 mt-1">{errors.applyingClass}</p>
          )}
        </div>

        <div>
          <Label htmlFor="session">Session *</Label>
          <Input
            id="session"
            value={session}
            onChange={(e) => updateField("session", e.target.value)}
            placeholder="2026/2027"
            className={inputClass("session")}
            readOnly
          />
        </div>
      </div>
    </div>
  );
}