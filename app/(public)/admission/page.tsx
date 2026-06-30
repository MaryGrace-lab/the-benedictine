//app/(public)/admission/page.tsx
import type { Metadata } from "next";
import {
  AdmissionHero,
  AdmissionProcess,
  AdmissionRequirements,
  FeesInfo,
  FAQ,
  ContactAdmission,
} from "./_components";

export const metadata: Metadata = {
  title: "Admissions | The Benedictine Academy",
  description:
    "Apply for admission to The Benedictine Academy. Pre-Nursery, Nursery, Primary, and Secondary school admissions for the 2026/2027 academic session.",
};

export default function AdmissionPage() {
  return (
    <main>
      <AdmissionHero />
      <AdmissionProcess />
      <AdmissionRequirements />
      <FeesInfo />
      <FAQ />
      <ContactAdmission />
    </main>
  );
}