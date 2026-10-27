import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ── Image Optimization ──
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // {
      //   protocol: "https",
      //   hostname: "images.unsplash.com",
      // },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // ── Compression ──
  compress: true,

  // ── Caching Headers (Production Only) ──
  async headers() {
    // Only apply caching in production
    if (process.env.NODE_ENV === "production") {
      return [
        {
          source: "/:path*.{jpg,jpeg,png,gif,webp,avif,svg}",
          headers: [
            {
              key: "Cache-Control",
              value: "public, max-age=31536000, immutable",
            },
          ],
        },
        {
          source: "/_next/static/:path*",
          headers: [
            {
              key: "Cache-Control",
              value: "public, max-age=31536000, immutable",
            },
          ],
        },
        {
          source: "/manifest.json",
          headers: [
            {
              key: "Cache-Control",
              value: "public, max-age=86400",
            },
          ],
        },
        {
          source: "/:path*.{ico,icns}",
          headers: [
            {
              key: "Cache-Control",
              value: "public, max-age=31536000, immutable",
            },
          ],
        },
      ];
    }
    
    // Return empty headers in development
    return [];
  },
};

export default nextConfig;