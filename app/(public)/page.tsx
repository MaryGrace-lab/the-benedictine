// ──────────────────────────────────────────────
// Home Page — Server Component
// ──────────────────────────────────────────────

import type { Metadata } from "next";
import HomePageClient from "./HomePageClient";
import {
  homeStats,
  homeAnnouncements,
  homeHighlights,
  homeTestimonials,
} from "./_data/homepage";

export const metadata: Metadata = {
  title: "The Benedictine Academy",
  description:
    "The Benedictine Academy is a Catholic education centre in Benin City, Edo State. We offer Nursery, Primary, and Secondary programs with a focus on academic excellence, moral values, spiritual development, and character development. Check results online.",
  alternates: {
    canonical: "https://thebenedictineacademyportal.com",
  },
};

export default function HomePage() {
  return (
    <HomePageClient
      stats={homeStats}
      announcements={homeAnnouncements}
      highlights={homeHighlights}
      testimonials={homeTestimonials}
    />
  );
}