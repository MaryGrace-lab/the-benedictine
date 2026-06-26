import type { Metadata } from "next";
import { ApplicationWizard } from "./_components";

export const metadata: Metadata = {
  title: "Apply for Admission | The Benedictine Academy",
  description:
    "Complete your admission application to The Benedictine Academy for the 2026/2027 academic session.",
};

export default function ApplyPage() {
  return <ApplicationWizard />;
}