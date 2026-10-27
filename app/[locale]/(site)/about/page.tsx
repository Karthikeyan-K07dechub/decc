import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import { company } from "@/lib/content";
import { PageHero } from "@/components/ui/PageHero";
import { Photo } from "@/components/ui/Photo";
import { SectionHead } from "@/components/ui/SectionHead";
import { CtaBand } from "@/components/ui/CtaBand";
import { Portrait } from "@/components/ui/Portrait";
import type { ImageId } from "@/lib/images";

const TEAM_PORTRAITS: ImageId[] = ["teamDirector", "teamArchitect", "teamStructural", "teamMep", "teamSite", "teamInterior"];

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "about", "/about");
}

/** Sheet A-100 — About */
export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "about" });
  const tc = await getTranslations({ locale, namespace: "common" });
  const timeline = t.raw("timeline") as { year: string; text: string; confirmed: boolean }[];
  const values = t.raw("values") as { title: string; text: string }[];
  const team = t.raw("team") as { name: string; role: string }[];
  const licences = t.raw("licences") as { title: string; value: string }[];

  return (
    <>
      <PageHero code={company.sheets.about} title={t("heroTitle")} text={t("heroText")}>
        <div className="relative aspect-[4/5] overflow-hidden" data-wipe>
          <Photo id="architectDesk" sizes="(min-width: 1024px) 38vw, 100vw" priority />
        </div>
      </PageHero>

      {/* Timeline */}
      <section className="section bg-gypsum" aria-labelledby="story-title">
        <div className="wrap">
          <SectionHead code="A-101" title={t("storyTitle")} />
          {timeline.some((it) => !it.confirmed) && (
            <p className="mt-6 text-sm text-concrete-soft">{t("timelineNote")}</p>
          )}
          <ol className="relative mt-16 grid gap-0 border-s border-teal/50 lg:grid-cols-6 lg:border-s-0 lg:border-t">
            {timeline.map((it, i) => (
              <li key={i} className="relative ps-8 pb-10 lg:ps-0 lg:pe-6 lg:pt-8" data-fade data-delay={String(i * 0.06)}>
                <span className="absolute -start-[5px] top-1.5 size-2.5 bg-teal lg:start-0 lg:-top-[5px]" aria-hidden />
                <p className={`display ltr text-[clamp(2rem,3.4vw,3rem)] ${it.confirmed ? "" : "tbc text-concrete-soft"}`}>{it.year}</p>
                <p className="mt-3 max-w-[24ch] text-concrete-soft">{it.text}</p>
                {!it.confirmed && <p className="mono mt-2 text-clay">{tc("toConfirm")}</p>}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Values */}
      <section className="section drafting" aria-labelledby="values-title">
        <div className="wrap">
          <SectionHead code="A-102" title={t("valuesTitle")} />
          <ul className="mt-14 grid gap-px border border-ink/15 bg-ink/15 md:grid-cols-3">
            {values.map((v, i) => (
              <li key={v.title} className="bg-gypsum p-8 lg:p-10">
                <p className="mono ltr text-teal">0{i + 1}</p>
                <h3 className="h3 mt-10">{v.title}</h3>
                <p className="mt-4 text-concrete-soft">{v.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Team */}
      <section className="section bg-gypsum" aria-labelledby="team-title">
        <div className="wrap">
          <SectionHead code="A-103" title={t("teamTitle")} intro={t("teamIntro")} />
          <p className="mt-6 text-sm text-concrete-soft">{t("teamSampleNote")}</p>
          <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-6">
            {team.map((m, i) => (
              <li key={i} data-fade data-delay={String(i * 0.05)}>
                <Portrait image={TEAM_PORTRAITS[i]} />
                <p className="mt-4 font-medium">{m.name}</p>
                <p className="mono mt-1 text-concrete-soft">{m.role}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Licences */}
      <section className="section drafting" aria-labelledby="licences-title">
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHead code="A-104" title={t("licencesTitle")} />
          </div>
          <dl className="grid gap-0 lg:col-span-7">
            {licences.map((l) => (
              <div key={l.title} className="flex flex-wrap items-baseline justify-between gap-4 border-t border-ink/15 py-6 last:border-b">
                <dt className="text-lg">{l.title}</dt>
                <dd className="mono ltr tbc text-concrete-soft">{l.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Office */}
      <section className="on-ink relative overflow-hidden" aria-labelledby="office-title">
        <div className="grid lg:grid-cols-2">
          <div className="relative min-h-[60svh]" data-wipe>
            <Photo id="officeTower" sizes="(min-width: 1024px) 50vw, 100vw" />
          </div>
          <div className="wrap section flex flex-col justify-center max-lg:pb-8">
            <p className="sheet-code mono ltr text-ink-muted">A-105 · {company.coords.label}</p>
            <h2 id="office-title" className="display h2 mt-6 max-w-[14ch]" data-split>
              {t("officeTitle")}
            </h2>
            <p className="lead mt-6 text-ink-muted">{t("officeText")}</p>
            <a href={company.mapsUrl} target="_blank" rel="noopener noreferrer" className="draw-link mono mt-10 self-start text-paper">
              {tc("directions")} <span className="arrow">→</span>
            </a>
          </div>
        </div>
      </section>

      <CtaBand className="max-lg:pt-8" />
    </>
  );
}
