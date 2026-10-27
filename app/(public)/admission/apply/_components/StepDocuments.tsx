//app/(public)/admission/apply/_components/StepDocuments.tsx
"use client";

import { useState } from "react";
import { useApplicationForm } from "../_hooks/useApplicationForm";
import { Label } from "@/components/ui/label";
import { Upload, FileText, X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

const documentFields = [
  {
    key: "birthCertificate" as const,
    label: "Birth Certificate",
    accept: ".pdf,.jpg,.jpeg,.png",
    required: true,
  },
  {
    key: "passportPhoto" as const,
    label: "Passport Photograph",
    accept: ".jpg,.jpeg,.png",
    required: true,
  },
  {
    key: "previousResult" as const,
    label: "Previous Academic Results",
    accept: ".pdf,.jpg,.jpeg,.png,.docx",
    required: true,
  },
  {
    key: "medicalReport" as const,
    label: "Medical Report",
    accept: ".pdf,.jpg,.jpeg,.png",
    required: false,
  },

];

export default function StepDocuments() {
  const { documents, setDocument } = useApplicationForm();
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [fileNames, setFileNames] = useState<Record<string, string | null>>({});
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({});

  const handleFileChange = async (
    key: (typeof documentFields)[number]["key"],
    file: File | null
  ) => {
    // Clear previous errors
    setUploadErrors((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });

    if (!file) {
      setDocument(key, null);
      setFileNames((prev) => ({ ...prev, [key]: null }));
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setUploadErrors((prev) => ({
        ...prev,
        [key]: "File must be less than 5MB",
      }));
      return;
    }

    // Store file name for display
    setFileNames((prev) => ({ ...prev, [key]: file.name }));

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
        // Store the URL/path from the server
        setDocument(key, data.filePath);
      } else {
        setDocument(key, null);
        setFileNames((prev) => ({ ...prev, [key]: null }));
        setUploadErrors((prev) => ({
          ...prev,
          [key]: data.error || "Upload failed",
        }));
      }
    } catch {
      setDocument(key, null);
      setFileNames((prev) => ({ ...prev, [key]: null }));
      setUploadErrors((prev) => ({
        ...prev,
        [key]: "Network error. Please try again.",
      }));
    } finally {
      setUploading((prev) => ({ ...prev, [key]: false }));
    }
  };

  const getFileDisplayName = (key: (typeof documentFields)[number]["key"]) => {
    const url = documents[key];
    const name = fileNames[key];
    
    if (url) {
      // Extract filename from URL if available
      const urlParts = url.split("/");
      return urlParts[urlParts.length - 1] || "Uploaded";
    }
    
    return name || null;
  };

  return (
    <div>
      <h2 className="mb-2 text-xl font-bold text-[#1B3A5C]">
        Document Upload
      </h2>
      <p className="mb-6 text-sm text-gray-500">
        Upload clear copies of required documents. Accepted formats: PDF,
        JPG, PNG, DOCX. Max size: 5MB per file.
      </p>

      <div className="space-y-4">
        {documentFields.map((doc) => {
          const isUploading = uploading[doc.key];
          const isUploaded = !!documents[doc.key];
          const fileName = getFileDisplayName(doc.key);
          const error = uploadErrors[doc.key];

          return (
            <div
              key={doc.key}
              className={`rounded-lg border-2 border-dashed p-4 transition-colors ${
                error
                  ? "border-red-300 bg-red-50"
                  : isUploaded
                  ? "border-green-300 bg-green-50"
                  : isUploading
                  ? "border-amber-300 bg-amber-50"
                  : "border-gray-300 hover:border-[#1B3A5C]"
              }`}
            >
              <Label
                htmlFor={doc.key}
                className="flex cursor-pointer items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      error
                        ? "bg-red-100"
                        : isUploaded
                        ? "bg-green-100"
                        : "bg-gray-100"
                    }`}
                  >
                    {isUploading ? (
                      <Loader2 className="h-5 w-5 animate-spin text-amber-600" />
                    ) : error ? (
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    ) : isUploaded ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <FileText className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">
                      {doc.label}
                      {doc.required && (
                        <span className="ml-1 text-red-500">*</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500">
                      {error ? (
                        <span className="text-red-500">{error}</span>
                      ) : isUploading ? (
                        "Uploading..."
                      ) : fileName ? (
                        <span className="text-green-600">✓ {fileName}</span>
                      ) : (
                        "Click to upload"
                      )}
                    </p>
                  </div>
                </div>

                {!isUploading && (
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

      <p className="mt-4 text-xs text-gray-400">
        Your documents are securely uploaded and will only be used for
        admission processing.
      </p>
    </div>
  );
}