"use client";

import { useApplicationForm } from "../_hooks/useApplicationForm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function StepPersonalInfo() {
  const {
    surname,
    firstName,
    middleName,
    gender,
    dateOfBirth,
    placeOfBirth,
    nationality,
    stateOfOrigin,
    lga,
    religion,
    bloodGroup,
    genotype,
    updateField,
  } = useApplicationForm();

  return (
    <div>
      <h2 className="mb-6 text-xl font-bold text-[#1B3A5C]">
        Personal Information
      </h2>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="surname">Surname *</Label>
          <Input
            id="surname"
            value={surname}
            onChange={(e) => updateField("surname", e.target.value)}
            placeholder="Enter surname"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => updateField("firstName", e.target.value)}
            placeholder="Enter first name"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="middleName">Middle Name</Label>
          <Input
            id="middleName"
            value={middleName}
            onChange={(e) => updateField("middleName", e.target.value)}
            placeholder="Enter middle name"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="gender">Gender *</Label>
          <select
            id="gender"
            title="Select gender"
            value={gender}
            onChange={(e) => updateField("gender", e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[#1B3A5C] focus:outline-none focus:ring-1 focus:ring-[#1B3A5C] dark:border-gray-700 dark:bg-gray-800"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div>
          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={dateOfBirth}
            onChange={(e) => updateField("dateOfBirth", e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="placeOfBirth">Place of Birth *</Label>
          <Input
            id="placeOfBirth"
            value={placeOfBirth}
            onChange={(e) => updateField("placeOfBirth", e.target.value)}
            placeholder="City, State"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="nationality">Nationality *</Label>
          <Input
            id="nationality"
            value={nationality}
            onChange={(e) => updateField("nationality", e.target.value)}
            placeholder="Enter nationality"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="stateOfOrigin">State of Origin *</Label>
          <Input
            id="stateOfOrigin"
            value={stateOfOrigin}
            onChange={(e) => updateField("stateOfOrigin", e.target.value)}
            placeholder="Enter state of origin"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="lga">Local Government Area *</Label>
          <Input
            id="lga"
            value={lga}
            onChange={(e) => updateField("lga", e.target.value)}
            placeholder="Enter LGA"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="religion">Religion *</Label>
          <select
            id="religion"
            title="Select religion"
            value={religion}
            onChange={(e) => updateField("religion", e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[#1B3A5C] focus:outline-none focus:ring-1 focus:ring-[#1B3A5C] dark:border-gray-700 dark:bg-gray-800"
          >
            <option value="">Select religion</option>
            <option value="christianity">Christianity</option>
            <option value="islam">Islam</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <Label htmlFor="bloodGroup">Blood Group</Label>
          <select
            id="bloodGroup"
            title="Select blood group"
            value={bloodGroup}
            onChange={(e) => updateField("bloodGroup", e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[#1B3A5C] focus:outline-none focus:ring-1 focus:ring-[#1B3A5C] dark:border-gray-700 dark:bg-gray-800"
          >
            <option value="">Select blood group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>

        <div>
          <Label htmlFor="genotype">Genotype</Label>
          <select
            id="genotype"
            title="Select genotype"
            value={genotype}
            onChange={(e) => updateField("genotype", e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[#1B3A5C] focus:outline-none focus:ring-1 focus:ring-[#1B3A5C] dark:border-gray-700 dark:bg-gray-800"
          >
            <option value="">Select genotype</option>
            <option value="AA">AA</option>
            <option value="AS">AS</option>
            <option value="SS">SS</option>
            <option value="AC">AC</option>
          </select>
        </div>
      </div>
    </div>
  );
}