"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const statusOptions = [
  { value: "ALL", label: "All Status" },
  { value: "SUBMITTED", label: "Submitted" },
  { value: "UNDER_REVIEW", label: "Under Review" },
  { value: "AWAITING_TEST", label: "Awaiting Test" },
  { value: "TEST_SCHEDULED", label: "Test Scheduled" },
  { value: "TEST_COMPLETED", label: "Test Completed" },
  { value: "INTERVIEW_SCHEDULED", label: "Interview Scheduled" },
  { value: "ACCEPTED", label: "Accepted" },
  { value: "REJECTED", label: "Rejected" },
  { value: "ADMITTED", label: "Admitted" },
];

const classOptions = [
  { value: "ALL", label: "All Classes" },
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

interface FiltersProps {
  search: string;
  status: string;
  classFilter: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onClassChange: (value: string) => void;
}

export default function AdmissionFilters({
  search,
  status,
  classFilter,
  onSearchChange,
  onStatusChange,
  onClassChange,
}: FiltersProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8B5E3C]/40" />
        <Input
          placeholder="Search by name, email, reg number..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 bg-white border-[#8B5E3C]/10 rounded-xl focus:border-[#8B5E3C] focus:ring-[#8B5E3C]/20"
        />
      </div>
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        title="Filter by status"
        className="rounded-xl border border-[#8B5E3C]/10 bg-white px-4 py-2.5 text-sm text-[#3D1902] focus:border-[#8B5E3C] focus:outline-none focus:ring-1 focus:ring-[#8B5E3C]"
      >
        {statusOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <select
        value={classFilter}
        onChange={(e) => onClassChange(e.target.value)}
        title="Filter by class"
        className="rounded-xl border border-[#8B5E3C]/10 bg-white px-4 py-2.5 text-sm text-[#3D1902] focus:border-[#8B5E3C] focus:outline-none focus:ring-1 focus:ring-[#8B5E3C]"
      >
        {classOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}