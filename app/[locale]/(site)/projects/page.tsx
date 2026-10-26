import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import { company } from "@/lib/content";
import { PageHero } from "@/components/ui/PageHero";
import { ProjectsIndex } from "@/components/sections/ProjectsIndex";
import { CtaBand } from "@/components/ui/CtaBand";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "projects", "/projects");
}

/** Sheet P-300 — Projects */
export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "projects" });
  return (
    <>
      <PageHero code={company.sheets.projects} title={t("title")} text={t("intro")} />
      <ProjectsIndex />
      <CtaBand />
    </>
  );
}
