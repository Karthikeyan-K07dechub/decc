import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import { Hero } from "@/components/sections/Hero";
import { Credentials } from "@/components/sections/Credentials";
import { Exploded } from "@/components/sections/Exploded";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { Process } from "@/components/sections/Process";
import { SectorsMarquee } from "@/components/sections/SectorsMarquee";
import { WhyDecc } from "@/components/sections/WhyDecc";
import { Testimonials } from "@/components/sections/Testimonials";
import { ConsultationCta } from "@/components/sections/ConsultationCta";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "home", "");
}

/** Sheet A-000 — Home */
export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <Hero />
      <Credentials />
      <Exploded />
      <ServicesGrid />
      <FeaturedProjects />
      <Process />
      <SectorsMarquee />
      <WhyDecc />
      <Testimonials locale={locale} />
      <ConsultationCta />
    </>
  );
}
