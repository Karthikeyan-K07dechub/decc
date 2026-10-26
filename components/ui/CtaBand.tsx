import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { company } from "@/lib/content";

/** Closing call to action for inner pages. `service` preselects the service on the contact form. */
export function CtaBand({ title, text, service }: { title?: string; text?: string; service?: string }) {
  const t = useTranslations();
  return (
    <section className="on-ink section">
      <div className="wrap flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="sheet-code mono ltr text-ink-muted">{company.sheets.contact}</p>
          <h2 className="display h2 mt-6 max-w-[16ch]" data-split>
            {title ?? t("services.ctaTitle")}
          </h2>
          <p className="lead mt-6 text-ink-muted" data-fade>
            {text ?? t("services.ctaText")}
          </p>
        </div>
        <div className="flex flex-wrap gap-4" data-fade>
          <Link href={service ? { pathname: "/contact", query: { service } } : "/contact"} className="btn">
            {t("common.book")} <span className="arrow">→</span>
          </Link>
          <a href={`https://wa.me/${company.whatsappNumber}`} className="btn btn-outline text-paper" target="_blank" rel="noopener noreferrer">
            {t("common.whatsapp")}
          </a>
        </div>
      </div>
    </section>
  );
}
