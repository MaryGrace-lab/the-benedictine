"use client";

import { useApplicationForm } from "../_hooks/useApplicationForm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function StepParentInfo() {
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

  return (
    <div>
      <h2 className="mb-6 text-xl font-bold text-[#1B3A5C]">
        Parent / Guardian Information
      </h2>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="fatherName">Father&apos;s Name *</Label>
          <Input
            id="fatherName"
            value={fatherName}
            onChange={(e) => updateField("fatherName", e.target.value)}
            placeholder="Full name"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="motherName">Mother&apos;s Name *</Label>
          <Input
            id="motherName"
            value={motherName}
            onChange={(e) => updateField("motherName", e.target.value)}
            placeholder="Full name"
            className="mt-1"
          />
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
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => updateField("email", e.target.value)}
            placeholder="parent@email.com"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="phoneNumber">Phone Number *</Label>
          <Input
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => updateField("phoneNumber", e.target.value)}
            placeholder="+234 800 000 0000"
            className="mt-1"
          />
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
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="emergencyContact">Emergency Contact Name *</Label>
          <Input
            id="emergencyContact"
            value={emergencyContact}
            onChange={(e) => updateField("emergencyContact", e.target.value)}
            placeholder="Full name"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="emergencyPhone">Emergency Contact Phone *</Label>
          <Input
            id="emergencyPhone"
            value={emergencyPhone}
            onChange={(e) => updateField("emergencyPhone", e.target.value)}
            placeholder="+234 800 000 0000"
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
}