"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { gsap, Flip, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { projects, sectors, type Sector, type ProjectStatus } from "@/lib/content";
import { ProjectTile } from "@/components/ui/ProjectTile";

type SectorFilter = "all" | Sector;
type StatusFilter = "all" | ProjectStatus;

/** Filterable project grid. Tiles that stay re-flow with GSAP Flip; others fade out. */
export function ProjectsIndex() {
  const t = useTranslations("projects");
  const [sector, setSector] = useState<SectorFilter>("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const grid = useRef<HTMLUListElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);

  const visible = (s: SectorFilter, st: StatusFilter) => projects.filter((p) => (s === "all" || p.sector === s) && (st === "all" || p.status === st));
  const shown = new Set(visible(sector, status).map((p) => p.slug));

  const { contextSafe } = useGSAP({ scope: grid });

  const change = contextSafe((s: SectorFilter, st: StatusFilter) => {
    if (!prefersReducedMotion()) flipState.current = Flip.getState("[data-tile]");
    setSector(s);
    setStatus(st);
  });

  // After React re-renders, animate from the recorded state.
  useGSAP(
    () => {
      const state = flipState.current;
      if (!state) return;
      flipState.current = null;
      Flip.from(state, {
        duration: 0.9,
        ease: "draw",
        absolute: true,
        nested: true,
        onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.7 }),
        onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.96, duration: 0.5 }),
        onComplete: () => ScrollTrigger.refresh(),
      });
    },
    { dependencies: [sector, status], scope: grid }
  );

  const chip = (active: boolean) =>
    `mono border px-4 py-2.5 transition-colors duration-500 ${active ? "border-ink bg-ink text-paper" : "border-ink/25 hover:border-ink"}`;

  return (
    <section className="section bg-gypsum" aria-label={t("title")}>
      <div className="wrap">
        <div className="mb-14 grid gap-6 border-b border-ink/15 pb-8 lg:grid-cols-[auto_1fr] lg:gap-x-10">
          <p className="mono pt-3 text-concrete-soft" id="filter-sector">
            {t("filterSector")}
          </p>
          <div className="flex flex-wrap gap-2" role="group" aria-labelledby="filter-sector">
            {(["all", ...sectors] as SectorFilter[]).map((s) => (
              <button key={s} type="button" aria-pressed={sector === s} className={chip(sector === s)} onClick={() => change(s, status)}>
                {s === "all" ? t("all") : t(`sectors.${s}`)}
              </button>
            ))}
          </div>
          <p className="mono pt-3 text-concrete-soft" id="filter-status">
            {t("filterStatus")}
          </p>
          <div className="flex flex-wrap gap-2" role="group" aria-labelledby="filter-status">
            {(["all", "completed", "construction"] as StatusFilter[]).map((s) => (
              <button key={s} type="button" aria-pressed={status === s} className={chip(status === s)} onClick={() => change(sector, s)}>
                {s === "all" ? t("all") : t(`status.${s}`)}
              </button>
            ))}
          </div>
        </div>

        <p className="sr-only" aria-live="polite">
          {shown.size}
        </p>
        <ul ref={grid} className="grid gap-x-8 gap-y-16 md:grid-cols-2">
          {projects.map((p, i) => (
            <li key={p.slug} data-tile data-flip-id={p.slug} className={shown.has(p.slug) ? "" : "hidden"}>
              <ProjectTile project={p} priority={i < 2} />
            </li>
          ))}
        </ul>
        {shown.size === 0 && <p className="mono py-20 text-center text-concrete-soft">{t("empty")}</p>}
      </div>
    </section>
  );
}
