import { useLocale, useTranslations } from "next-intl";
import { company } from "@/lib/content";

/** Real map preview; clicking anywhere opens the same office coordinates in Google Maps. */
export function RakMap({ label, caption }: { label: string; caption: string }) {
  const locale = useLocale();
  const t = useTranslations("contact");
  const query = new URLSearchParams({
    q: `${company.coords.lat},${company.coords.lng}`,
    z: "16",
    hl: locale,
    output: "embed",
  });
  return (
    <figure className="relative min-w-0">
      <div className="relative aspect-[4/3] min-h-[280px] w-full min-w-0 overflow-hidden border border-ink/15 bg-paper">
        <iframe
          src={`https://maps.google.com/maps?${query}`}
          title={label}
          className="pointer-events-none absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          tabIndex={-1}
          aria-hidden="true"
        />
        <a
          href={company.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${t("openMap")}: ${caption}`}
          className="group absolute inset-0 flex items-end justify-center p-4 focus-visible:outline-offset-[-4px]"
        >
          <span className="btn shadow-lg group-hover:bg-clay-deep">
            {t("openMap")} <span aria-hidden>↗</span>
          </span>
        </a>
      </div>
      <figcaption className="mono mt-3 text-concrete-soft">{caption}</figcaption>
    </figure>
  );
}
