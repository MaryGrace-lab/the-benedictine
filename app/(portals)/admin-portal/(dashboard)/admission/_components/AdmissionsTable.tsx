"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

const statusConfig: Record<string, { label: string; color: "default" | "secondary" | "success" | "warning" | "destructive" }> = {
  DRAFT: { label: "Draft", color: "secondary" },
  SUBMITTED: { label: "Submitted", color: "default" },
  UNDER_REVIEW: { label: "Under Review", color: "warning" },
  AWAITING_TEST: { label: "Awaiting Test", color: "warning" },
  TEST_SCHEDULED: { label: "Test Scheduled", color: "default" },
  TEST_COMPLETED: { label: "Test Completed", color: "success" },
  INTERVIEW_SCHEDULED: { label: "Interview", color: "default" },
  ACCEPTED: { label: "Accepted", color: "success" },
  REJECTED: { label: "Rejected", color: "destructive" },
  ADMITTED: { label: "Admitted", color: "success" },
};

interface Application {
  id: string;
  registrationNumber: string;
  surname: string;
  firstName: string;
  gender: string;
  applyingClass: string;
  status: string;
  email: string;
  phoneNumber: string;
  submittedAt: string | null;
}

interface AdmissionsTableProps {
  applications: Application[];
  onView: (id: string) => void;
}

export default function AdmissionsTable({ applications, onView }: AdmissionsTableProps) {
  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#8B5E3C]/10 p-12 text-center">
        <p className="text-sm text-[#8B5E3C]/50">No applications found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#8B5E3C]/10 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#FAF7F2]">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-bold text-[#8B5E3C] uppercase tracking-wider">Reg Number</th>
              <th className="px-5 py-3 text-left text-xs font-bold text-[#8B5E3C] uppercase tracking-wider">Name</th>
              <th className="px-5 py-3 text-left text-xs font-bold text-[#8B5E3C] uppercase tracking-wider hidden sm:table-cell">Gender</th>
              <th className="px-5 py-3 text-left text-xs font-bold text-[#8B5E3C] uppercase tracking-wider">Class</th>
              <th className="px-5 py-3 text-left text-xs font-bold text-[#8B5E3C] uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 text-left text-xs font-bold text-[#8B5E3C] uppercase tracking-wider hidden md:table-cell">Email</th>
              <th className="px-5 py-3 text-right text-xs font-bold text-[#8B5E3C] uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#8B5E3C]/5">
            {applications.map((app) => {
              const status = statusConfig[app.status] || statusConfig.DRAFT;
              return (
                <tr key={app.id} className="hover:bg-[#FAF7F2] transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs text-[#8B5E3C]">{app.registrationNumber}</td>
                  <td className="px-5 py-3.5 font-bold text-[#3D1902]">
                    {app.surname} {app.firstName}
                  </td>
                  <td className="px-5 py-3.5 capitalize hidden sm:table-cell text-[#8B5E3C]/70">{app.gender}</td>
                  <td className="px-5 py-3.5 text-[#8B5E3C]/70">{app.applyingClass}</td>
                  <td className="px-5 py-3.5">
                    <Badge variant={status.color}>{status.label}</Badge>
                  </td>
                  <td className="px-5 py-3.5 text-[#8B5E3C]/60 hidden md:table-cell text-xs">{app.email}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => onView(app.id)}
                      className="p-2 rounded-xl hover:bg-[#8B5E3C]/10 text-[#8B5E3C] transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}