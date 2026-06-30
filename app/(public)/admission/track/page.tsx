//app/(public)/admission/track/page.tsx
import type { Metadata } from "next";
import { TrackApplicationClient } from "./_components/TrackApplicationClient";

export const metadata: Metadata = {
  title: "Track Application | The Benedictine Academy",
  description: "Track your child's admission application status.",
};

export default function TrackApplicationPage() {
  return <TrackApplicationClient />;
}