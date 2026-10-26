import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { company } from "@/lib/content";

/** Sheet X-404 — a torn sheet. */
export default function NotFound() {
  const t = useTranslations();
  return (
    <section className="drafting flex min-h-[100svh] items-center pt-28">
      <div className="wrap grid items-center gap-14 py-20 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="sheet-code mono ltr">{company.sheets.notFound}</p>
          <h1 className="display h-display mt-6 max-w-[12ch]" data-split>
            {t("notFound.title")}
          </h1>
          <p className="lead mt-6 text-concrete-soft">{t("notFound.text")}</p>
          <Link href="/" className="btn mt-10">
            <span className="arrow">←</span> {t("notFound.home")}
          </Link>
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <svg viewBox="0 0 400 300" className="w-full text-teal" fill="none" stroke="currentColor" aria-hidden data-draw data-stagger="0.05">
            {/* left half of the sheet */}
            <path d="M20 20 H 190 L 176 60 L 200 95 L 182 140 L 205 180 L 186 225 L 198 280 H 20 Z" fill="var(--color-gypsum)" vectorEffect="non-scaling-stroke" />
            {/* right half, slipped and rotated */}
            <g transform="translate(24 14) rotate(4 300 150)">
              <path d="M200 20 H 380 V 280 H 208 L 196 225 L 215 180 L 192 140 L 210 95 L 186 60 Z" fill="var(--color-gypsum)" vectorEffect="non-scaling-stroke" />
              <path d="M240 210 H 360 M240 230 H 360 M240 250 H 360 M300 210 V 270" strokeOpacity="0.6" vectorEffect="non-scaling-stroke" />
            </g>
            {/* drawing fragments */}
            <path d="M50 230 V 130 H 150 V 230 M 50 130 L 100 90 L 150 130" vectorEffect="non-scaling-stroke" />
            <path d="M40 250 H 160 M40 244 V 256 M160 244 V 256" strokeOpacity="0.6" vectorEffect="non-scaling-stroke" />
            <text x="60" y="270" fill="currentColor" stroke="none" fontFamily="var(--font-mono)" fontSize="11" letterSpacing="1">X-404</text>
          </svg>
        </div>
      </div>
    </section>
  );
}
