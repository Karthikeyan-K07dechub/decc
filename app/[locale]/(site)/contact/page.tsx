import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import { company } from "@/lib/content";
import { PageHero } from "@/components/ui/PageHero";
import { EnquiryForm } from "@/components/ui/Forms";
import { RakMap } from "@/components/ui/RakMap";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "contact", "/contact");
}

/** Sheet C-900 — Contact */
export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  const cards = [
    { label: t("common.call"), value: company.phone, href: company.phoneHref, ltr: true },
    { label: t("common.whatsapp"), value: company.whatsapp, href: `https://wa.me/${company.whatsappNumber}`, ltr: true, external: true },
    { label: t("common.email"), value: company.email, href: `mailto:${company.email}`, ltr: true },
    { label: t("common.hoursLabel"), value: t("common.hours") },
  ];

  return (
    <>
      <PageHero code={company.sheets.contact} title={t("contact.heroTitle")} text={t("contact.heroText")} />

      <section className="border-b border-ink/15 bg-gypsum">
        <ul className="wrap grid gap-px bg-ink/15 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <li key={c.label} className="bg-gypsum py-8 sm:px-6 lg:py-10">
              <p className="mono text-concrete-soft">{c.label}</p>
              {c.href ? (
                <a href={c.href} className={`draw-link mt-3 inline-block text-xl ${c.ltr ? "ltr" : ""}`} {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                  {c.value}
                </a>
              ) : (
                <p className="mt-3 text-xl">{c.value}</p>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="section drafting">
        <div className="wrap grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <h2 className="display h2" data-split>
              {t("contact.formTitle")}
            </h2>
            <div className="mt-12">
              <Suspense fallback={null}>
                <EnquiryForm />
              </Suspense>
            </div>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <RakMap label={t("contact.mapLabel")} caption={t("contact.mapCaption")} />
            <div className="mt-8 border-t border-ink/15 pt-6">
              <p className="mono text-concrete-soft">{t("contact.addressLabel")}</p>
              <address className="mt-3 text-lg not-italic">{t("contact.address")}</address>
              <p className="mono ltr mt-3 text-concrete-soft">{company.coords.label}</p>
              <a href={company.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline mt-8">
                {t("common.directions")} <span className="arrow">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
