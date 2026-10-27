import { useTranslations } from "next-intl";
import { company, projects, yearsActive } from "@/lib/content";

/** Company credentials and the current portfolio size, set between dimension lines. */
export function Credentials() {
  const t = useTranslations("home.credentials");
  const years = yearsActive();
  const items = [
    { k: t("since"), v: String(company.founded), count: company.founded, from: 1990 },
    { k: t("years"), v: String(years), count: years },
    { k: t("projects"), v: String(projects.length), count: projects.length },
    { k: t("approvals"), v: t("approvalsShort") },
  ];
  return (
    <section className="drafting border-b border-ink/15" aria-label={t("label")}>
      <div className="wrap py-14 lg:py-20">
        {/* Dimension line spanning the strip */}
        <div className="mb-10 flex items-center gap-3 text-teal" aria-hidden>
          <span className="h-3 w-px bg-current" />
          <span className="h-px flex-1 origin-[left_center] bg-current rtl:origin-[right_center]" data-rule />
          <span className="mono ltr shrink-0">
            {company.founded} — {company.founded + years} · {t("dimension")}
          </span>
          <span className="h-px flex-1 origin-[right_center] bg-current rtl:origin-[left_center]" data-rule />
          <span className="h-3 w-px bg-current" />
        </div>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {items.map((it, i) => (
            <div key={i} className="border-s border-ink/20 ps-5" data-fade data-delay={String(i * 0.08)}>
              <dt className="mono text-concrete-soft">{it.k}</dt>
              <dd className="display mt-3 text-[clamp(2.6rem,6vw,5.2rem)] ltr">
                <span data-count={it.count} data-from={it.from}>
                  {it.v}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
