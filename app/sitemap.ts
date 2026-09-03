// app/sitemap.ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://thebenedictineacademyportal.com";

  // Define all your public routes
  const routes = [
    "",
    "/about",
    "/academics",
    "/admission",
    "/contact",
    "/FAQ",
    "/news",
    "/gallery",
    "/student-portal/login",
    "/admin-portal/login",
    "/teacher-portal/login",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: route === "" ? 1.0 : 0.8,
  }));
}