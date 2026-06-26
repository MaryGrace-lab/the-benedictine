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

export default function StepAcademicInfo() {
  const {
    previousSchool,
    previousClass,
    applyingClass,
    session,
    updateField,
  } = useApplicationForm();

  return (
    <div>
      <h2 className="mb-6 text-xl font-bold text-[#1B3A5C]">
        Academic Information
      </h2>

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
            className="mt-1 w-full rounded-lg ..."
            >
            <option value="">Select class</option>
            {classOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="session">Session *</Label>
          <Input
            id="session"
            value={session}
            onChange={(e) => updateField("session", e.target.value)}
            placeholder="2026/2027"
            className="mt-1"
            readOnly
          />
        </div>
      </div>
    </div>
  );
}