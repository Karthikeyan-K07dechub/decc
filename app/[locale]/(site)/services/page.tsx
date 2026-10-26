import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { pageMetadata } from "@/lib/seo";
import { company, services } from "@/lib/content";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHead } from "@/components/ui/SectionHead";
import { LineToPhoto } from "@/components/ui/LineToPhoto";
import { Icon } from "@/components/ui/Icon";
import { CtaBand } from "@/components/ui/CtaBand";
import type { Project } from "@/lib/content";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "services", "/services");
}

const ELEV: Record<string, Project["elevation"]> = {
  "architectural-design": "villa",
  "structural-engineering": "block",
  "mep-design": "tower",
  "construction-supervision": "block",
  "approvals-permits": "mosque",
  "interior-design": "villa",
};

/** Sheet S-200 — Services hub */
export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  const columns = t.raw("services.compare.columns") as string[];
  const rows = t.raw("services.compare.rows") as { label: string; values: boolean[] }[];

  return (
    <>
      <PageHero code={company.sheets.services} title={t("services.hubTitle")} text={t("services.hubIntro")} />

      <section className="bg-gypsum">
        <ul className="wrap">
          {services.map((s, i) => (
            <li key={s.slug} className="grid items-center gap-10 border-b border-ink/15 py-16 lg:grid-cols-12 lg:gap-16 lg:py-24">
              <div className={`lg:col-span-6 ${i % 2 ? "lg:order-2" : ""}`}>
                <LineToPhoto image={s.image} elevation={ELEV[s.slug]} sizes="(min-width: 1024px) 45vw, 100vw" className="aspect-[4/3]" />
              </div>
              <div className={`lg:col-span-5 ${i % 2 ? "lg:col-start-2" : "lg:col-start-8"}`}>
                <div className="flex items-center gap-5">
                  <Icon name={s.icon} className="size-12 text-teal" draw />
                  <span className="mono ltr text-concrete-soft">{s.code}</span>
                </div>
                <h2 className="display h2 mt-8 max-w-[14ch]" data-split>
                  {t(`services.items.${s.slug}.title`)}
                </h2>
                <p className="lead mt-6 text-concrete-soft">{t(`services.items.${s.slug}.short`)}</p>
                <Link href={`/services/${s.slug}`} className="btn btn-outline mt-10">
                  {t("common.explore")} <span className="arrow">→</span>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Scope comparison */}
      <section className="section drafting" aria-labelledby="compare-title">
        <div className="wrap">
          <SectionHead code="S-207" title={t("services.compare.title")} intro={t("services.compare.intro")} />
          <div className="mt-14 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-start">
              <caption className="sr-only">{t("services.compare.title")}</caption>
              <thead>
                <tr className="border-b border-ink">
                  <th scope="col" className="py-4 text-start" />
                  {columns.map((c, i) => (
                    <th key={c} scope="col" className={`mono px-4 py-4 text-center ${i === 2 ? "bg-ink text-paper" : ""}`}>
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.label} className="border-b border-ink/15">
                    <th scope="row" className="py-5 pe-4 text-start font-normal">
                      {r.label}
                    </th>
                    {r.values.map((v, i) => (
                      <td key={i} className={`px-4 py-5 text-center ${i === 2 ? "bg-ink/[0.04]" : ""}`}>
                        {v ? (
                          <svg viewBox="0 0 20 20" className="mx-auto size-5 text-teal" fill="none" stroke="currentColor" strokeWidth="1.5" role="img" aria-label={t("common.included")}>
                            <path d="M4 10.5l4 4 8-9" />
                          </svg>
                        ) : (
                          <span className="mx-auto block h-px w-4 bg-concrete" role="img" aria-label={t("common.notIncluded")} />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
