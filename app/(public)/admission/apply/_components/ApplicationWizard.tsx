"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApplicationForm } from "../_hooks/useApplicationForm";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  User,
  Users,
  GraduationCap,
  Heart,
  Upload,
  ClipboardCheck,
  Loader2,
  CheckCircle2,
  Mail,
} from "lucide-react";
import StepPersonalInfo from "./StepPersonalInfo";
import StepParentInfo from "./StepParentInfo";
import StepAcademicInfo from "./StepAcademicInfo";
import StepMedicalInfo from "./StepMedicalInfo";
import StepDocuments from "./StepDocuments";
import StepReview from "./StepReview";
import Link from "next/link";
import { Search } from "lucide-react";

const steps = [
  { number: 1, title: "Personal Info", icon: User },
  { number: 2, title: "Parent Info", icon: Users },
  { number: 3, title: "Academic", icon: GraduationCap },
  { number: 4, title: "Medical", icon: Heart },
  { number: 5, title: "Documents", icon: Upload },
  { number: 6, title: "Review", icon: ClipboardCheck },
];

export default function ApplicationWizard() {
  const formData = useApplicationForm();
  const { currentStep, nextStep, prevStep } = formData;
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [error, setError] = useState("");

  const progress = (currentStep / 6) * 100;

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/admission/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surname: formData.surname,
          firstName: formData.firstName,
          middleName: formData.middleName,
          gender: formData.gender,
          dateOfBirth: formData.dateOfBirth,
          placeOfBirth: formData.placeOfBirth,
          nationality: formData.nationality,
          stateOfOrigin: formData.stateOfOrigin,
          lga: formData.lga,
          religion: formData.religion,
          bloodGroup: formData.bloodGroup,
          genotype: formData.genotype,
          fatherName: formData.fatherName,
          motherName: formData.motherName,
          guardianName: formData.guardianName,
          occupation: formData.occupation,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          alternatePhone: formData.alternatePhone,
          residentialAddress: formData.residentialAddress,
          emergencyContact: formData.emergencyContact,
          emergencyPhone: formData.emergencyPhone,
          previousSchool: formData.previousSchool,
          previousClass: formData.previousClass,
          applyingClass: formData.applyingClass,
          session: formData.session,
          allergies: formData.allergies,
          medicalConditions: formData.medicalConditions,
          specialNeeds: formData.specialNeeds,
          emergencyMedicalInfo: formData.emergencyMedicalInfo,
          documents: formData.documents,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setRegistrationNumber(data.registrationNumber);
        setSubmitted(true);
        formData.resetForm();
      } else {
        setError(data.error || "Submission failed. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <StepPersonalInfo />;
      case 2: return <StepParentInfo />;
      case 3: return <StepAcademicInfo />;
      case 4: return <StepMedicalInfo />;
      case 5: return <StepDocuments />;
      case 6: return <StepReview />;
      default: return null;
    }
  };

  // Success screen
  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md text-center"
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-[#1B3A5C]">
            Application Submitted!
          </h1>
          <p className="mt-3 text-gray-600">
            Your application has been received and is being processed.
          </p>

          <div className="mt-6 rounded-xl bg-white p-6 shadow-sm dark:bg-gray-950">
            <p className="text-sm text-gray-500">Registration Number</p>
            <p className="mt-1 font-mono text-xl font-bold text-[#1B3A5C]">
              {registrationNumber}
            </p>
            <p className="mt-4 text-sm text-gray-500">
              Please save this number for future reference.
            </p>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
            <Mail className="h-4 w-4" />
            A confirmation email has been sent to your email address.
          </div>

<div className="mt-6 rounded-lg bg-blue-50 p-4 text-sm text-blue-700 dark:bg-blue-950/30 dark:text-blue-400">
  <p className="font-medium">What happens next?</p>
  <ul className="mt-2 list-inside list-disc space-y-1">
    <li>Your application will be reviewed within <strong>2-7 working days</strong></li>
    <li>All updates will be sent to your email address</li>
    <li>You can track your application status anytime</li>
  </ul>
</div>

<div className="mt-4">
  <Link
    href="/admission/track"
    className="inline-flex items-center text-sm font-medium text-[#1B3A5C] hover:underline"
  >
    <Search className="mr-1 h-4 w-4" />
    Track Your Application
  </Link>
</div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 dark:bg-gray-900">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-[#1B3A5C] sm:text-3xl">
            Admission Application
          </h1>
          <p className="mt-2 text-gray-600">
            The Benedictine Academy — 2026/2027 Academic Session
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-2">
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Indicators */}
        <div className="mb-8 flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;

            return (
              <div key={step.number} className="flex flex-col items-center gap-1">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                    isCompleted
                      ? "bg-green-500 text-white"
                      : isActive
                      ? "bg-[#1B3A5C] text-white"
                      : "bg-gray-200 text-gray-500 dark:bg-gray-700"
                  }`}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </div>
                <span
                  className={`hidden text-xs font-medium sm:block ${
                    isActive
                      ? "text-[#1B3A5C]"
                      : isCompleted
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Step Content */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="border-gray-300"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          {currentStep < 6 && (
            <Button
              onClick={nextStep}
              className="bg-[#1B3A5C] hover:bg-[#1F4D7B]"
            >
              Save & Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}

          {currentStep === 6 && (
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Submit Application
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}