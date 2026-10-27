import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { images } from "@/lib/images";
import { services, serviceBySlug, projectBySlug } from "@/lib/content";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHead } from "@/components/ui/SectionHead";
import { Accordion } from "@/components/ui/Accordion";
import { CtaBand } from "@/components/ui/CtaBand";
import { ProjectTile } from "@/components/ui/ProjectTile";
import { ServiceModel } from "@/components/ui/ServiceModel";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => services.map((s) => ({ locale, slug: s.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const s = serviceBySlug(slug);
  if (!s) return {};
  const t = await getTranslations({ locale, namespace: "services.items" });
  return pageMetadata(locale, "services", `/services/${slug}`, {
    title: t(`${s.slug}.title`),
    description: t(`${s.slug}.short`),
    image: `${images[s.image].url}?w=1200&h=630&fit=crop&q=70`,
  });
}

/** Sheets S-201 … S-206 — one per service */
export default async function ServicePage({ params }: Props) {
  const { locale, slug } = await params;
  const s = serviceBySlug(slug);
  if (!s) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  const k = `services.items.${s.slug}` as const;
  const deliverables = t.raw(`${k}.deliverables`) as string[];
  const steps = t.raw(`${k}.process`) as { title: string; text: string }[];
  const faq = t.raw(`${k}.faq`) as { q: string; a: string }[];
  const related = s.related.map(projectBySlug).filter((p) => !!p);

  return (
    <>
      <PageHero
        code={s.code}
        title={t(`${k}.hero`)}
        text={t(`${k}.intro`)}
        crumbs={[
          { href: "/services", label: t("nav.services") },
          { href: `/services/${s.slug}`, label: t(`${k}.title`) },
        ]}
      >
        <ServiceModel kind={s.model} image={s.image} label={t(`${k}.title`)} />
      </PageHero>

      {/* Deliverables */}
      <section className="section bg-gypsum" aria-labelledby="deliverables-title">
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHead
              code={`${s.code}.1`}
              title={t("services.deliverables")}
              size="h2-compact"
            />
          </div>
          <ol className="lg:col-span-7">
            {deliverables.map((d, i) => (
              <li key={d} className="flex items-baseline gap-6 border-t border-ink/15 py-5 last:border-b" data-fade data-delay={String(i * 0.05)}>
                <span className="mono ltr text-teal">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-lg">{d}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Process */}
      <section className="section drafting" aria-labelledby="steps-title">
        <div className="wrap">
          <SectionHead code={`${s.code}.2`} title={t("services.process")} />
          <ol className={`mt-14 grid gap-px border border-ink/15 bg-ink/15 sm:grid-cols-2 ${steps.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
            {steps.map((st, i) => (
              <li key={st.title} className="relative bg-gypsum p-7" data-fade data-delay={String(i * 0.08)}>
                <span className="mono ltr text-teal">0{i + 1}</span>
                <h3 className="h3 mt-10 text-[1.4rem]">{st.title}</h3>
                <p className="mt-3 text-concrete-soft">{st.text}</p>
                {i < steps.length - 1 && (
                  <span className="arrow absolute end-5 top-7 hidden text-concrete lg:inline-block" aria-hidden>
                    →
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Related projects */}
      {related.length > 0 && (
        <section className="section bg-gypsum" aria-labelledby="related-title">
          <div className="wrap">
            <SectionHead code={`${s.code}.3`} title={t("services.related")} />
            <ul className="mt-14 grid gap-10 md:grid-cols-2">
              {related.map((p) => (
                <li key={p.slug}>
                  <ProjectTile project={p} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="section drafting" aria-labelledby="faq-title">
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHead code={`${s.code}.4`} title={t("services.faq")} />
          </div>
          <div className="lg:col-span-8">
            <Accordion items={faq.map((f) => ({ title: f.q, content: <p className="text-lg text-concrete-soft">{f.a}</p> }))} />
          </div>
        </div>
      </section>

      <CtaBand service={s.slug} />
    </>
  );
}
