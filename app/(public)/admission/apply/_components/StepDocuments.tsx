"use client";

import { useState } from "react";
import { useApplicationForm } from "../_hooks/useApplicationForm";
import { Label } from "@/components/ui/label";
import { Upload, FileText, X, Loader2, CheckCircle2 } from "lucide-react";

const documentFields = [
  {
    key: "birthCertificate" as const,
    label: "Birth Certificate",
    accept: ".pdf,.jpg,.jpeg,.png",
  },
  {
    key: "passportPhoto" as const,
    label: "Passport Photograph",
    accept: ".jpg,.jpeg,.png",
  },
  {
    key: "previousResult" as const,
    label: "Previous Academic Results",
    accept: ".pdf,.jpg,.jpeg,.png,.docx",
  },
  {
    key: "medicalReport" as const,
    label: "Medical Report",
    accept: ".pdf,.jpg,.jpeg,.png",
  },
  {
    key: "recommendationLetter" as const,
    label: "Recommendation Letter",
    accept: ".pdf,.docx",
  },
];

export default function StepDocuments() {
  const { documents, setDocument } = useApplicationForm();
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [uploaded, setUploaded] = useState<Record<string, string | null>>({});

  const handleFileChange = async (
    key: (typeof documentFields)[number]["key"],
    file: File | null
  ) => {
    if (!file) {
      setDocument(key, null);
      setUploaded((prev) => ({ ...prev, [key]: null }));
      return;
    }

    // Store file reference locally first
    setDocument(key, file);

    // Upload to server
    setUploading((prev) => ({ ...prev, [key]: true }));

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "admissions");

      const response = await fetch("/api/admission/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setUploaded((prev) => ({ ...prev, [key]: data.filePath }));
      } else {
        console.error("Upload failed:", data.error);
        setDocument(key, null);
        alert(`Upload failed: ${data.error}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      setDocument(key, null);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading((prev) => ({ ...prev, [key]: false }));
    }
  };

  return (
    <div>
      <h2 className="mb-6 text-xl font-bold text-[#1B3A5C]">
        Document Upload
      </h2>
      <p className="mb-6 text-sm text-gray-500">
        Upload clear copies of all required documents. Accepted formats: PDF,
        JPG, PNG, DOCX. Max size: 5MB per file.
      </p>

      <div className="space-y-4">
        {documentFields.map((doc) => {
          const file = documents[doc.key];
          const isUploading = uploading[doc.key];
          const isUploaded = uploaded[doc.key];

          return (
            <div
              key={doc.key}
              className={`rounded-lg border-2 border-dashed p-4 transition-colors ${
                isUploaded
                  ? "border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-950/20"
                  : file
                  ? "border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20"
                  : "border-gray-300 hover:border-[#1B3A5C] dark:border-gray-700"
              }`}
            >
              <Label
                htmlFor={doc.key}
                className="flex cursor-pointer items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      isUploaded
                        ? "bg-green-100"
                        : "bg-amber-100"
                    }`}
                  >
                    {isUploading ? (
                      <Loader2 className="h-5 w-5 animate-spin text-amber-600" />
                    ) : isUploaded ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <FileText className="h-5 w-5 text-amber-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-700 dark:text-gray-300">
                      {doc.label}
                      <span className="ml-1 text-red-500">*</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      {isUploading
                        ? "Uploading..."
                        : isUploaded
                        ? "Uploaded ✓"
                        : file
                        ? file.name
                        : "No file selected"}
                    </p>
                  </div>
                </div>

                {file && !isUploading ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleFileChange(doc.key, null);
                    }}
                    className="rounded-full p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                  >
                    <X className="h-4 w-4" />
                  </button>
                ) : (
                  <Upload className="h-5 w-5 text-gray-400" />
                )}
              </Label>
              <input
                id={doc.key}
                type="file"
                accept={doc.accept}
                aria-label={`Upload ${doc.label}`}
                title={`Upload ${doc.label}`}
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  handleFileChange(doc.key, file);
                }}
                className="hidden"
                disabled={isUploading}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}