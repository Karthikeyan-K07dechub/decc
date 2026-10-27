import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { pageMetadata } from "@/lib/seo";
import { images } from "@/lib/images";
import { projects, projectBySlug } from "@/lib/content";
import { LineToPhoto } from "@/components/ui/LineToPhoto";
import { Gallery } from "@/components/ui/Gallery";
import { BeforeAfter } from "@/components/ui/BeforeAfter";
import { CtaBand } from "@/components/ui/CtaBand";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => projects.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const p = projectBySlug(slug);
  if (!p) return {};
  const t = await getTranslations({ locale, namespace: "projects.items" });
  return pageMetadata(locale, "projects", `/projects/${slug}`, {
    title: t(`${slug}.title`),
    description: t(`${slug}.brief`),
    image: `${images[p.image].url}?w=1200&h=630&fit=crop&q=70`,
  });
}

/** Sheets P-301 … P-308 — project detail */
export default async function ProjectPage({ params }: Props) {
  const { locale, slug } = await params;
  const p = projectBySlug(slug);
  if (!p) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  const k = `projects.items.${p.slug}` as const;
  const i = projects.indexOf(p);
  const prev = projects[(i - 1 + projects.length) % projects.length];
  const next = projects[(i + 1) % projects.length];

  const schedule: [string, string, boolean?][] = [
    [t("projects.schedule.type"), t(`projects.sectors.${p.sector}`)],
    [t("projects.schedule.location"), t(`${k}.location`)],
    [t("projects.schedule.plotArea"), `${p.data.plotArea} m²`, true],
    [t("projects.schedule.floors"), p.data.floors],
    [t("projects.schedule.year"), p.data.year, true],
    [t("projects.schedule.status"), t(`projects.status.${p.status}`)],
  ];

  return (
    <>
      {/* Hero: elevation → photo, full bleed on ink */}
      <section className="on-ink relative">
        <LineToPhoto image={p.image} elevation={p.elevation} sizes="100vw" className="h-[78svh] min-h-[28rem] lg:h-[92svh]" ink priority immediate />
        <div className="wrap relative -mt-28 pb-12 lg:-mt-48">
          <div className="flex max-w-4xl flex-col justify-center gap-5 bg-ink pe-8 py-4">
            <p className="sheet-code mono ltr text-ink-muted">
              {p.code} · <span className="text-clay-soft">{t("common.sampleProject")}</span>
            </p>
            <h1 className="display h2 max-w-[18ch]" data-split>
              {t(`${k}.title`)}
            </h1>
          </div>
        </div>
      </section>

      {/* Schedule + brief/solution */}
      <section className="section bg-gypsum">
        <div className="wrap grid gap-14 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              <p className="mono mb-4 text-concrete-soft">{p.code} · {t("projects.scheduleTitle")}</p>
              <dl className="mono border-t border-ink">
                {schedule.map(([label, value, tbc]) => (
                  <div key={label} className="grid grid-cols-[9rem_1fr] gap-4 border-b border-ink/15 py-3">
                    <dt className="text-concrete-soft">{label}</dt>
                    <dd className={`${tbc ? "tbc ltr" : ""}`}>{value}</dd>
                  </div>
                ))}
                <div className="grid grid-cols-[9rem_1fr] gap-4 border-b border-ink/15 py-3">
                  <dt className="text-concrete-soft">{t("projects.schedule.scope")}</dt>
                  <dd>
                    <ul className="grid gap-1">
                      {p.scope.map((s) => (
                        <li key={s}>
                          <Link href={`/services/${s}`} className="draw-link">
                            {t(`services.items.${s}.title`)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              </dl>
            </div>
          </aside>

          <div className="grid gap-16 lg:col-span-7 lg:col-start-6">
            <div>
              <p className="mono text-teal">01 · {t("projects.brief")}</p>
              <p className="h3 mt-5 font-normal" data-split="lines">
                {t(`${k}.brief`)}
              </p>
            </div>
            <div>
              <p className="mono text-teal">02 · {t("projects.solution")}</p>
              <p className="mt-5 text-xl leading-relaxed text-concrete-soft" data-fade>
                {t(`${k}.solution`)}
              </p>
            </div>
            <BeforeAfter image={p.image} elevation={p.elevation} />
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="section drafting" aria-labelledby="gallery-title">
        <div className="wrap">
          <h2 id="gallery-title" className="mono mb-10 text-concrete-soft">
            03 · {t("projects.gallery")}
          </h2>
          <Gallery ids={p.gallery} />
        </div>
      </section>

      {/* Previous / next */}
      <nav className="border-t border-ink/15 bg-gypsum" aria-label={t("common.allProjects")}>
        <div className="wrap grid md:grid-cols-2">
          <Link href={`/projects/${prev.slug}`} className="group border-b border-ink/15 py-10 md:border-b-0 md:border-e md:pe-10">
            <p className="mono text-concrete-soft">
              <span className="arrow">←</span> {t("projects.previousProject")} · <span className="ltr">{prev.code}</span>
            </p>
            <p className="h3 mt-4 transition-colors duration-500 group-hover:text-clay">{t(`projects.items.${prev.slug}.title`)}</p>
          </Link>
          <Link href={`/projects/${next.slug}`} className="group py-10 text-end md:ps-10">
            <p className="mono text-concrete-soft">
              <span className="ltr">{next.code}</span> · {t("projects.nextProject")} <span className="arrow">→</span>
            </p>
            <p className="h3 mt-4 transition-colors duration-500 group-hover:text-clay">{t(`projects.items.${next.slug}.title`)}</p>
          </Link>
        </div>
      </nav>

      <CtaBand />
    </>
  );
}
