// components/StructuredData.tsx
"use client";

import Script from "next/script";

export default function StructuredData() {
  const schoolData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "The Benedictine Academy",
    alternateName: "Benedictine Academy",
    description:
      "The Benedictine Academy is a Catholic education centre in Benin City, Edo State. We offer Nursery, Primary, and Secondary programs with a focus on academic excellence, moral values, and spiritual development.",
    url: "https://thebenedictineacademyportal.com",
    logo: "https://thebenedictineacademyportal.com/logo.png",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Benin City",
      addressRegion: "Edo State",
      addressCountry: "NG",
    },
    parentOrganization: {
      "@type": "Organization",
      name: "Catholic Education Centre",
    },
    // ✅ Social media handles removed (school doesn't have them)
  };

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schoolData) }}
      strategy="afterInteractive"
    />
  );
}