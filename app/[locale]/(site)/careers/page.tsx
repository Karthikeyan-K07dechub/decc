import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import { company } from "@/lib/content";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHead } from "@/components/ui/SectionHead";
import { Accordion } from "@/components/ui/Accordion";
import { ApplicationForm } from "@/components/ui/Forms";
import { Photo } from "@/components/ui/Photo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "careers", "/careers");
}

type Role = { title: string; type: string; text: string; requirements: string[] };

/** Sheet A-400 — Careers */
export default async function CareersPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "careers" });
  const why = t.raw("why") as { title: string; text: string }[];
  const roles = t.raw("roles") as Role[];

  return (
    <>
      <PageHero code={company.sheets.careers} title={t("heroTitle")} text={t("heroText")}>
        <div className="relative aspect-[4/5] overflow-hidden" data-wipe>
          <Photo id="engineersSite" sizes="(min-width: 1024px) 38vw, 100vw" priority />
        </div>
      </PageHero>

      <section className="section bg-gypsum" aria-labelledby="why-work-title">
        <div className="wrap">
          <SectionHead code="A-401" title={t("whyTitle")} />
          <ul className="mt-14 grid gap-px border border-ink/15 bg-ink/15 md:grid-cols-3">
            {why.map((w, i) => (
              <li key={w.title} className="bg-paper p-8 lg:p-10">
                <p className="mono ltr text-teal">0{i + 1}</p>
                <h3 className="h3 mt-10">{w.title}</h3>
                <p className="mt-4 text-concrete-soft">{w.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section drafting" aria-labelledby="roles-title">
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHead code="A-402" title={t("rolesTitle")} />
            <p className="mono mt-6 text-clay">{t("rolesNote")}</p>
          </div>
          <div className="lg:col-span-8">
            <Accordion
              items={roles.map((r) => ({
                title: r.title,
                meta: r.type,
                content: (
                  <div className="grid gap-5">
                    <p className="text-lg">{r.text}</p>
                    <ul className="grid gap-2">
                      {r.requirements.map((q) => (
                        <li key={q} className="flex gap-3 text-concrete-soft">
                          <span className="mt-2.5 h-px w-4 shrink-0 bg-teal" aria-hidden />
                          {q}
                        </li>
                      ))}
                    </ul>
                  </div>
                ),
              }))}
            />
          </div>
        </div>
      </section>

      <section id="apply" className="section bg-gypsum" aria-labelledby="apply-title">
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHead code="A-403" title={t("formTitle")} intro={t("formIntro")} />
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <ApplicationForm roles={roles.map((r) => r.title)} />
          </div>
        </div>
      </section>
    </>
  );
}
