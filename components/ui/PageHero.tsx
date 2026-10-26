import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

/** Paper hero for inner pages: sheet code, split headline, intro, and an optional figure on the side. */
export function PageHero({
  code,
  title,
  text,
  children,
  crumbs,
}: {
  code: string;
  title: string;
  text?: string;
  children?: React.ReactNode;
  crumbs?: { href: string; label: string }[];
}) {
  const crumbsLabel = useTranslations("common")("breadcrumb");
  return (
    <section className="drafting relative border-b border-ink/15 pt-32 lg:pt-40">
      <div className={`wrap grid gap-12 pb-16 lg:pb-24 ${children ? "lg:grid-cols-12 lg:items-end" : ""}`}>
        <div className={children ? "lg:col-span-7" : ""}>
          <div className="mb-8 flex flex-wrap items-center gap-4">
            <p className="sheet-code mono ltr" data-fade>
              {code}
            </p>
            {crumbs && (
              <nav aria-label={crumbsLabel} className="mono text-concrete-soft" data-fade>
                {crumbs.map((c, i) => (
                  <span key={c.href}>
                    {i > 0 && <span className="mx-2 opacity-50">/</span>}
                    <Link href={c.href} className="draw-link">
                      {c.label}
                    </Link>
                  </span>
                ))}
              </nav>
            )}
          </div>
          <h1 className="display h-display max-w-[16ch]" data-split>
            {title}
          </h1>
          {text && (
            <p className="lead mt-8 text-concrete-soft" data-fade data-delay="0.2">
              {text}
            </p>
          )}
        </div>
        {children && <div className="lg:col-span-5">{children}</div>}
      </div>
    </section>
  );
}
