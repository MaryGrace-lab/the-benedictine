"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Loader2, CheckCircle, XCircle, Clock, FileText, ExternalLink } from "lucide-react";

const statusConfig: Record<string, { label: string; color: "default" | "secondary" | "success" | "warning" | "destructive" }> = {
  DRAFT: { label: "Draft", color: "secondary" },
  SUBMITTED: { label: "Submitted", color: "default" },
  UNDER_REVIEW: { label: "Under Review", color: "warning" },
  AWAITING_TEST: { label: "Awaiting Test", color: "warning" },
  TEST_SCHEDULED: { label: "Test Scheduled", color: "default" },
  TEST_COMPLETED: { label: "Test Completed", color: "success" },
  INTERVIEW_SCHEDULED: { label: "Interview Scheduled", color: "default" },
  ACCEPTED: { label: "Accepted", color: "success" },
  REJECTED: { label: "Rejected", color: "destructive" },
  ADMITTED: { label: "Admitted", color: "success" },
};

interface ApplicationDetail {
  id: string;
  registrationNumber: string;
  status: string;
  surname: string;
  firstName: string;
  middleName: string | null;
  gender: string;
  dateOfBirth: string;
  placeOfBirth: string;
  nationality: string;
  stateOfOrigin: string;
  lga: string;
  religion: string;
  bloodGroup: string | null;
  genotype: string | null;
  fatherName: string;
  motherName: string;
  guardianName: string | null;
  occupation: string;
  email: string;
  phoneNumber: string;
  residentialAddress: string;
  emergencyContact: string;
  emergencyPhone: string;
  previousSchool: string | null;
  previousClass: string | null;
  applyingClass: string;
  session: string;
  allergies: string | null;
  medicalConditions: string | null;
  specialNeeds: string | null;
  emergencyMedicalInfo: string | null;
  birthCertificate: string | null;
  passportPhoto: string | null;
  previousResult: string | null;
  medicalReport: string | null;
  recommendationLetter: string | null;
  paymentStatus: string;
  notes: string | null;
  submittedAt: string | null;
}

interface Props {
  applicationId: string;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => void;
}

export default function AdmissionDetailModal({ applicationId, onClose, onStatusChange }: Props) {
  const [data, setData] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/admission/${applicationId}`);
        const json = await res.json();
        setData(json.application);
      } catch (error) {
        console.error("Failed to fetch", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [applicationId]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="rounded-xl bg-white p-8 dark:bg-gray-950">
          <Loader2 className="h-8 w-8 animate-spin text-[#1B3A5C]" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  const status = statusConfig[data.status];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50">
      <div className="flex min-h-screen items-start justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl dark:bg-gray-950 my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-800">
            <div>
              <h2 className="text-xl font-bold text-[#1B3A5C]">
                {data.surname} {data.firstName} {data.middleName || ""}
              </h2>
              <p className="font-mono text-sm text-gray-500">{data.registrationNumber}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={status.color}>{status.label}</Badge>
              <button onClick={onClose} className="rounded-lg p-1 hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="max-h-[60vh] overflow-y-auto p-6 space-y-4">
            {/* Personal */}
            <Card>
              <CardContent className="p-4 grid gap-2 sm:grid-cols-3 text-sm">
                <div><span className="text-gray-500">Gender:</span> <span className="capitalize font-medium">{data.gender}</span></div>
                <div><span className="text-gray-500">DOB:</span> <span className="font-medium">{data.dateOfBirth}</span></div>
                <div><span className="text-gray-500">Nationality:</span> <span className="font-medium">{data.nationality}</span></div>
                <div><span className="text-gray-500">State:</span> <span className="font-medium">{data.stateOfOrigin}</span></div>
                <div><span className="text-gray-500">LGA:</span> <span className="font-medium">{data.lga}</span></div>
                <div><span className="text-gray-500">Religion:</span> <span className="font-medium capitalize">{data.religion}</span></div>
              </CardContent>
            </Card>

            {/* Parent */}
            <Card>
              <CardContent className="p-4 text-sm space-y-2">
                <p><span className="text-gray-500">Father:</span> {data.fatherName}</p>
                <p><span className="text-gray-500">Mother:</span> {data.motherName}</p>
                <p><span className="text-gray-500">Email:</span> {data.email}</p>
                <p><span className="text-gray-500">Phone:</span> {data.phoneNumber}</p>
                <p><span className="text-gray-500">Address:</span> {data.residentialAddress}</p>
              </CardContent>
            </Card>

            {/* Academic */}
            <Card>
              <CardContent className="p-4 grid gap-2 sm:grid-cols-2 text-sm">
                <div><span className="text-gray-500">Class:</span> <span className="font-medium">{data.applyingClass}</span></div>
                <div><span className="text-gray-500">Session:</span> <span className="font-medium">{data.session}</span></div>
                <div><span className="text-gray-500">Prev School:</span> <span className="font-medium">{data.previousSchool || "—"}</span></div>
                <div><span className="text-gray-500">Prev Class:</span> <span className="font-medium">{data.previousClass || "—"}</span></div>
              </CardContent>
            </Card>

            {/* Medical */}
            <Card>
              <CardContent className="p-4 text-sm space-y-1">
                <p><span className="text-gray-500">Allergies:</span> {data.allergies || "None"}</p>
                <p><span className="text-gray-500">Conditions:</span> {data.medicalConditions || "None"}</p>
                <p><span className="text-gray-500">Special Needs:</span> {data.specialNeeds || "None"}</p>
              </CardContent>
            </Card>

{/* Documents */}
<Card>
  <CardContent className="p-4">
    <p className="text-sm font-medium mb-2">Documents</p>
    <div className="flex flex-wrap gap-2">
      {data.passportPhoto && (
        <a
          href={`/api/admission/view-file?url=${encodeURIComponent(data.passportPhoto)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-xs font-semibold hover:bg-green-100 transition-all border border-green-200 hover:border-green-300 hover:shadow-sm cursor-pointer"
          title="Click to view"
        >
          <FileText className="h-3 w-3" />
          Passport
          <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
        </a>
      )}
      {data.birthCertificate && (
        <a
          href={`/api/admission/view-file?url=${encodeURIComponent(data.birthCertificate)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-xs font-semibold hover:bg-green-100 transition-all border border-green-200 hover:border-green-300 hover:shadow-sm cursor-pointer"
          title="Click to view"
        >
          <FileText className="h-3 w-3" />
          Birth Cert
          <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
        </a>
      )}
      {data.previousResult && (
        <a
          href={`/api/admission/view-file?url=${encodeURIComponent(data.previousResult)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-xs font-semibold hover:bg-green-100 transition-all border border-green-200 hover:border-green-300 hover:shadow-sm cursor-pointer"
          title="Click to view"
        >
          <FileText className="h-3 w-3" />
          Results
          <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
        </a>
      )}
      {data.medicalReport && (
        <a
          href={`/api/admission/view-file?url=${encodeURIComponent(data.medicalReport)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-xs font-semibold hover:bg-green-100 transition-all border border-green-200 hover:border-green-300 hover:shadow-sm cursor-pointer"
          title="Click to view"
        >
          <FileText className="h-3 w-3" />
          Medical
          <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
        </a>
      )}
      {data.recommendationLetter && (
        <a
          href={`/api/admission/view-file?url=${encodeURIComponent(data.recommendationLetter)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-xs font-semibold hover:bg-green-100 transition-all border border-green-200 hover:border-green-300 hover:shadow-sm cursor-pointer"
          title="Click to view"
        >
          <FileText className="h-3 w-3" />
          Recommendation
          <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
        </a>
      )}
      {!data.passportPhoto && !data.birthCertificate && !data.previousResult && !data.medicalReport && !data.recommendationLetter && (
        <span className="text-xs text-gray-400">No documents uploaded</span>
      )}
    </div>
  </CardContent>
</Card>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between border-t border-gray-200 p-6 dark:border-gray-800">
            <Button
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50"
              onClick={() => onStatusChange(data.id, "REJECTED")}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <div className="flex gap-2">
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => onStatusChange(data.id, "ADMITTED")}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Admit
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}