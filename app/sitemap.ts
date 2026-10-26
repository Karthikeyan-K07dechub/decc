import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/seo";
import { services, projects } from "@/lib/content";

/** Every page in both languages, with hreflang alternates. */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/about", "/services", "/projects", "/careers", "/contact", ...services.map((s) => `/services/${s.slug}`), ...projects.map((p) => `/projects/${p.slug}`)];
  const now = new Date();
  return paths.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : path.split("/").length > 2 ? 0.6 : 0.8,
      alternates: { languages: { "en-AE": `${SITE_URL}/en${path}`, "ar-AE": `${SITE_URL}/ar${path}` } },
    }))
  );
}
