import { useTranslations } from "next-intl";
import { company } from "@/lib/content";
import { ConsultationForm } from "@/components/ui/Forms";
import { Link } from "@/i18n/navigation";

/** Ink band with the short "request a call" form (Server Action). */
export function ConsultationCta() {
  const t = useTranslations();
  return (
    <section className="on-ink section relative overflow-hidden" aria-labelledby="cta-title">
      <div className="wrap grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="sheet-code mono ltr text-ink-muted">{company.sheets.contact}</p>
          <h2 id="cta-title" className="display h2 mt-6 max-w-[16ch]" data-split>
            {t("home.cta.title")}
          </h2>
          <p className="lead mt-6 text-ink-muted" data-fade>
            {t("home.cta.text")}
          </p>
          <p className="mono mt-8 text-ink-muted">
            <a href={company.phoneHref} className="draw-link ltr text-paper">
              {company.phone}
            </a>
            <span className="mx-3 opacity-50">/</span>
            <Link href="/contact" className="draw-link text-paper">
              {t("nav.contact")}
            </Link>
          </p>
        </div>
        <div className="lg:col-span-6 lg:col-start-7 lg:self-end" data-fade>
          <ConsultationForm />
        </div>
      </div>
    </section>
  );
}
