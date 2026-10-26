"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Project } from "@/lib/content";
import { LineToPhoto } from "./LineToPhoto";

/** Project card: line-to-photo reveal; on hover a crosshair and the sheet code appear over the image. */
export function ProjectTile({ project: p, priority }: { project: Project; priority?: boolean }) {
  const t = useTranslations();
  return (
    <Link href={`/projects/${p.slug}`} className="group block" data-cursor={t("common.view")}>
      <div className="relative">
        <LineToPhoto image={p.image} elevation={p.elevation} sizes="(min-width: 1024px) 45vw, (min-width: 768px) 50vw, 100vw" className="aspect-[4/3]" priority={priority} />
        {/* Crosshair + sheet code on hover */}
        <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 group-focus-visible:opacity-100" aria-hidden>
          <span className="absolute inset-x-0 top-1/2 h-px bg-paper/70" />
          <span className="absolute inset-y-0 start-1/2 w-px bg-paper/70" />
          <span className="absolute start-1/2 top-1/2 size-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-paper rtl:translate-x-1/2" />
          <span className="mono ltr absolute end-3 top-3 bg-ink px-2 py-1 text-paper">{p.code}</span>
        </span>
      </div>
      <div className="mt-5 flex items-start justify-between gap-6">
        <div>
          <h3 className="h3 text-[clamp(1.3rem,2vw,1.7rem)]">{t(`projects.items.${p.slug}.title`)}</h3>
          <p className="mono mt-2 text-concrete-soft">
            {t(`projects.sectors.${p.sector}`)} · {t(`projects.status.${p.status}`)}
          </p>
        </div>
        <span className="mono shrink-0 text-clay">{t("common.sampleProject")}</span>
      </div>
    </Link>
  );
}
