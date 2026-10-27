import type { Metadata } from "next";
import { AdmissionClient } from "./_components/AdmissionClient";

export const metadata: Metadata = {
  title: "Admission Management | Admin Portal",
  description: "Manage student admission applications.",
};

export default function AdmissionPage() {
  return <AdmissionClient />;
}