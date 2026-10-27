"use client";

import { useApplicationForm } from "../_hooks/useApplicationForm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  errors?: Record<string, string>;
}

export default function StepParentInfo({ errors = {} }: Props) {
  const {
    fatherName,
    motherName,
    guardianName,
    occupation,
    email,
    phoneNumber,
    alternatePhone,
    residentialAddress,
    emergencyContact,
    emergencyPhone,
    updateField,
  } = useApplicationForm();

  const inputClass = (field: string) =>
    `mt-1 ${errors[field] ? "border-red-500 focus:border-red-500 focus:ring-red-200" : ""}`;

  return (
    <div>
      <h2 className="mb-6 text-xl font-bold text-[#1B3A5C]">Parent / Guardian Information</h2>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="fatherName">Father&apos;s Name *</Label>
          <Input
            id="fatherName"
            value={fatherName}
            onChange={(e) => updateField("fatherName", e.target.value)}
            placeholder="Full name"
            className={inputClass("fatherName")}
          />
          {errors.fatherName && <p className="text-xs text-red-500 mt-1">{errors.fatherName}</p>}
        </div>

        <div>
          <Label htmlFor="motherName">Mother&apos;s Name *</Label>
          <Input
            id="motherName"
            value={motherName}
            onChange={(e) => updateField("motherName", e.target.value)}
            placeholder="Full name"
            className={inputClass("motherName")}
          />
          {errors.motherName && <p className="text-xs text-red-500 mt-1">{errors.motherName}</p>}
        </div>

        <div>
          <Label htmlFor="guardianName">Guardian&apos;s Name</Label>
          <Input
            id="guardianName"
            value={guardianName}
            onChange={(e) => updateField("guardianName", e.target.value)}
            placeholder="Full name (if different from parents)"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="occupation">Occupation *</Label>
          <Input
            id="occupation"
            value={occupation}
            onChange={(e) => updateField("occupation", e.target.value)}
            placeholder="Parent/Guardian occupation"
            className={inputClass("occupation")}
          />
          {errors.occupation && <p className="text-xs text-red-500 mt-1">{errors.occupation}</p>}
        </div>

        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => updateField("email", e.target.value)}
            placeholder="parent@email.com"
            className={inputClass("email")}
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>

        <div>
          <Label htmlFor="phoneNumber">Phone Number *</Label>
          <Input
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => updateField("phoneNumber", e.target.value)}
            placeholder="+234 800 000 0000"
            className={inputClass("phoneNumber")}
          />
          {errors.phoneNumber && <p className="text-xs text-red-500 mt-1">{errors.phoneNumber}</p>}
        </div>

        <div>
          <Label htmlFor="alternatePhone">Alternate Phone Number</Label>
          <Input
            id="alternatePhone"
            value={alternatePhone}
            onChange={(e) => updateField("alternatePhone", e.target.value)}
            placeholder="+234 800 000 0000"
            className="mt-1"
          />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="residentialAddress">Residential Address *</Label>
          <Input
            id="residentialAddress"
            value={residentialAddress}
            onChange={(e) => updateField("residentialAddress", e.target.value)}
            placeholder="Full residential address"
            className={inputClass("residentialAddress")}
          />
          {errors.residentialAddress && (
            <p className="text-xs text-red-500 mt-1">{errors.residentialAddress}</p>
          )}
        </div>

        <div>
          <Label htmlFor="emergencyContact">Emergency Contact Name *</Label>
          <Input
            id="emergencyContact"
            value={emergencyContact}
            onChange={(e) => updateField("emergencyContact", e.target.value)}
            placeholder="Full name"
            className={inputClass("emergencyContact")}
          />
          {errors.emergencyContact && (
            <p className="text-xs text-red-500 mt-1">{errors.emergencyContact}</p>
          )}
        </div>

        <div>
          <Label htmlFor="emergencyPhone">Emergency Contact Phone *</Label>
          <Input
            id="emergencyPhone"
            value={emergencyPhone}
            onChange={(e) => updateField("emergencyPhone", e.target.value)}
            placeholder="+234 800 000 0000"
            className={inputClass("emergencyPhone")}
          />
          {errors.emergencyPhone && (
            <p className="text-xs text-red-500 mt-1">{errors.emergencyPhone}</p>
          )}
        </div>
      </div>
    </div>
  );
}