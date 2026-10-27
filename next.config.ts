import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // Every image host used in lib/images.ts must be listed here.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
    ],
  },
  experimental: {
    // Leave room for multipart fields around the advertised 5 MB CV upload.
    serverActions: { bodySizeLimit: "6mb" },
    optimizePackageImports: ["gsap", "@react-three/drei"],
  },
};

export default (phase: string) => withNextIntl({
  ...nextConfig,
  // Development and production must never overwrite each other's chunks.
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next-dev" : ".next",
});
