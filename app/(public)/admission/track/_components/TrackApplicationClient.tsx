//app/(public)/admission/track/_components/TrackApplicationClient.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Loader2,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Calendar,
} from "lucide-react";
import Link from "next/link";

const statusConfig: Record<
  string,
  {
    label: string;
    color: "default" | "secondary" | "success" | "warning" | "destructive";
    icon: React.ElementType;
    description: string;
  }
> = {
  SUBMITTED: {
    label: "Submitted",
    color: "default",
    icon: FileText,
    description:
      "Your application has been received and is in the queue for review.",
  },
  UNDER_REVIEW: {
    label: "Under Review",
    color: "warning",
    icon: Clock,
    description:
      "Your application is currently being reviewed by the admission committee.",
  },
  AWAITING_TEST: {
    label: "Awaiting Test",
    color: "warning",
    icon: Clock,
    description:
      "You will receive an email with the entrance examination date and details.",
  },
  TEST_SCHEDULED: {
    label: "Test Scheduled",
    color: "default",
    icon: Calendar,
    description:
      "An entrance examination has been scheduled. Check your email for details.",
  },
  TEST_COMPLETED: {
    label: "Test Completed",
    color: "success",
    icon: CheckCircle,
    description:
      "Your child has completed the entrance examination. Results are being processed.",
  },
  INTERVIEW_SCHEDULED: {
    label: "Interview Scheduled",
    color: "default",
    icon: Calendar,
    description:
      "An interview has been scheduled. Check your email for date and time.",
  },
  ACCEPTED: {
    label: "Accepted",
    color: "success",
    icon: CheckCircle,
    description:
      "Congratulations! Your child has been accepted. Check your email for the admission letter.",
  },
  REJECTED: {
    label: "Rejected",
    color: "destructive",
    icon: AlertCircle,
    description:
      "Unfortunately, your application was not successful. An email with details has been sent.",
  },
  ADMITTED: {
    label: "Admitted",
    color: "success",
    icon: CheckCircle,
    description:
      "Welcome to The Benedictine Academy! Your child is now officially admitted.",
  },
};

export function TrackApplicationClient() {
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [application, setApplication] = useState<any>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setApplication(null);

    if (!registrationNumber.trim()) {
      setError("Please enter your registration number.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter the email used during application.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `/api/admission/applications?registrationNumber=${encodeURIComponent(registrationNumber)}&email=${encodeURIComponent(email)}`
      );
      const data = await response.json();

      if (data.application) {
        setApplication(data.application);
      } else {
        setError(
          "No application found. Please check your registration number and email."
        );
      }
    } catch (err) {
      setError("Failed to fetch application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const status = application ? statusConfig[application.status] : null;
  const StatusIcon = status?.icon;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900">
      <div className="w-full max-w-lg">
        {/* Back link */}
        <Link
          href="/admission"
          className="mb-6 inline-flex items-center text-sm text-gray-500 hover:text-[#1B3A5C]"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Admissions
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-[#1B3A5C] sm:text-3xl">
            Track Application
          </h1>
          <p className="mt-2 text-gray-600">
            Enter your registration number and email to check your application
            status.
          </p>
        </motion.div>

        {/* Search Form */}
        <Card className="mt-6">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <Label htmlFor="registrationNumber">
                  Registration Number
                </Label>
                <Input
                  id="registrationNumber"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  placeholder="e.g., TBA/2026/0001"
                  className="mt-1 font-mono"
                />
              </div>

              <div>
                <Label htmlFor="trackEmail">Email Address</Label>
                <Input
                  id="trackEmail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email used during application"
                  className="mt-1"
                />
              </div>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1B3A5C] hover:bg-[#1F4D7B]"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Check Status
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Result */}
        <AnimatePresence>
          {application && status && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-[#1B3A5C]">
                      Application Status
                    </h2>
                    <Badge variant={status.color}>
  {StatusIcon && <StatusIcon className="mr-1 h-3 w-3" />}
  {status.label}
</Badge>
                  </div>

                  <p className="mt-3 text-sm text-gray-600">
                    {status.description}
                  </p>

                  <div className="mt-6 space-y-3 border-t border-gray-100 pt-4 dark:border-gray-800">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Registration Number</span>
                      <span className="font-mono font-medium text-[#1B3A5C]">
                        {application.registrationNumber}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Child Name</span>
                      <span className="font-medium text-[#1B3A5C]">
                        {application.surname} {application.firstName}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Applying Class</span>
                      <span className="font-medium text-[#1B3A5C]">
                        {application.applyingClass}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Session</span>
                      <span className="font-medium text-[#1B3A5C]">
                        {application.session}
                      </span>
                    </div>
                    {application.submittedAt && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Submitted</span>
                        <span className="font-medium text-[#1B3A5C]">
                          {new Date(application.submittedAt).toDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-700 dark:bg-blue-950/30 dark:text-blue-400">
                    All updates will be sent to your registered email address.
                    Please check your inbox (and spam folder) regularly.
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}