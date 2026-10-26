import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { company } from "@/lib/content";
import { images } from "@/lib/images";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://decc.ae").replace(/\/$/, "");

type PageKey = "home" | "about" | "services" | "projects" | "careers" | "contact" | "notFound";

/** Title, description, Open Graph and hreflang alternates for one page in one locale. */
export async function pageMetadata(
  locale: string,
  page: PageKey,
  path = "",
  override?: { title?: string; description?: string; image?: string }
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "meta" });
  const title = override?.title ?? t(`pages.${page}.title`);
  const description = override?.description ?? t(`pages.${page}.description`);
  const image = override?.image ?? `${images.villaHero.url}?w=1200&h=630&fit=crop&q=70`;
  const languages = Object.fromEntries(routing.locales.map((l) => [l === "ar" ? "ar-AE" : "en-AE", `/${l}${path}`]));

  return {
    title,
    description,
    alternates: { canonical: `/${locale}${path}`, languages: { ...languages, "x-default": `/en${path}` } },
    openGraph: {
      type: "website",
      siteName: t("siteName"),
      title: `${title} · DECC`,
      description,
      url: `/${locale}${path}`,
      locale: locale === "ar" ? "ar_AE" : "en_AE",
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

/** LocalBusiness / ProfessionalService structured data for the RAK office. */
export function businessJsonLd(locale: string) {
  const ar = locale === "ar";
  return {
    "@context": "https://schema.org",
    "@type": ["ProfessionalService", "LocalBusiness"],
    "@id": `${SITE_URL}/#decc`,
    name: ar ? "مكتب ديزاينر للإستشارات الهندسية" : "Designer Engineering Consultants LLC",
    alternateName: "DECC",
    url: `${SITE_URL}/${locale}`,
    image: `${images.villaHero.url}?w=1200&q=70`,
    telephone: "+97172336166",
    email: company.email,
    foundingDate: String(company.founded),
    address: {
      "@type": "PostalAddress",
      streetAddress: ar ? "برج جلفار، الطابق العاشر، المكتبان 1004–1005، شارع الحصن" : "Julphar Tower, 10th floor, offices 1004–1005, Al Hisn Street",
      addressLocality: ar ? "رأس الخيمة" : "Ras Al Khaimah",
      addressCountry: "AE",
    },
    geo: { "@type": "GeoCoordinates", latitude: company.coords.lat, longitude: company.coords.lng },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    areaServed: "Ras Al Khaimah",
    sameAs: [`https://instagram.com/${company.instagram}`],
    knowsAbout: ["Architectural design", "Structural engineering", "MEP design", "Construction supervision", "Building permits", "Interior design"],
  };
}
