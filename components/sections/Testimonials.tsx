import { useTranslations } from "next-intl";
import { SHOW_TESTIMONIALS } from "@/lib/content";

/**
 * Client quotes. Built but hidden (SHOW_TESTIMONIALS = false in lib/content) — no quotes are
 * invented. To publish: add real, approved quotes below and set the flag to true.
 */
const QUOTES: { quote: { en: string; ar: string }; name: string; project: { en: string; ar: string } }[] = [];

export function Testimonials({ locale }: { locale: string }) {
  const t = useTranslations("home.testimonials");
  if (!SHOW_TESTIMONIALS || QUOTES.length === 0) return null;
  const lang = locale === "ar" ? "ar" : "en";
  return (
    <section className="section drafting" aria-labelledby="testimonials-title">
      <div className="wrap">
        <h2 id="testimonials-title" className="display h2" data-split>
          {t("title")}
        </h2>
        <ul className="mt-14 grid gap-10 md:grid-cols-2">
          {QUOTES.map((q) => (
            <li key={q.name} className="border-t border-ink/15 pt-6">
              <blockquote className="h3">“{q.quote[lang]}”</blockquote>
              <p className="mono mt-5 text-concrete-soft">
                {q.name} · {q.project[lang]}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
