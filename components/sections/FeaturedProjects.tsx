"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { gsap, useGSAP } from "@/lib/gsap";
import { featuredProjects, company } from "@/lib/content";
import { Photo } from "@/components/ui/Photo";
import { Elevation } from "@/components/ui/Elevation";

/**
 * Pinned horizontal run of four projects on ink. Each panel starts as a teal elevation; as it
 * reaches the centre a clip-path wipe uncovers the photo, which drifts with parallax.
 */
export function FeaturedProjects() {
  const t = useTranslations();
  const root = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const total = featuredProjects.length;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const rtl = document.documentElement.dir === "rtl";

      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const track = root.current!.querySelector<HTMLElement>("[data-track]")!;
        const distance = () => track.scrollWidth - window.innerWidth;
        const panels = gsap.utils.toArray<HTMLElement>("[data-panel]");

        // One paused timeline per panel: elevation draws, then the photo wipes in.
        const reveals = panels.map((panel) => {
          const photo = panel.querySelector<HTMLElement>("[data-photo]")!;
          const paths = panel.querySelectorAll<SVGPathElement>("[data-elev] path");
          paths.forEach((p) => {
            const len = p.getTotalLength();
            gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
          });
          return gsap
            .timeline({ paused: true, defaults: { ease: "none" } })
            .to(paths, { strokeDashoffset: 0, stagger: 0.03, duration: 0.5 })
            .fromTo(photo, { clipPath: rtl ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0%)", duration: 0.6 }, 0.4);
        });
        const imgs = panels.map((panel) => panel.querySelector<HTMLElement>("[data-photo] img"));
        imgs.forEach((im) => im && gsap.set(im, { scale: 1.15 }));

        // The first panel draws while the section scrolls into view.
        gsap.to(reveals[0], { progress: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top 75%", end: "top 5%", scrub: true } });

        gsap.to(track, {
          x: () => (rtl ? distance() : -distance()),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (st) => {
              const pos = st.progress * (total - 1);
              setIndex(Math.min(total - 1, Math.round(pos)));
              reveals.forEach((tl, i) => {
                if (i > 0) tl.progress(gsap.utils.clamp(0, 1, (pos - i + 0.85) / 0.65));
              });
              imgs.forEach((im, i) => im && gsap.set(im, { xPercent: (pos - i) * (rtl ? 6 : -6) }));
            },
          },
        });
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} className="on-ink relative overflow-hidden" aria-labelledby="featured-title">
      <div className="flex min-h-[100svh] flex-col py-20 lg:h-[100svh] lg:py-14">
        <div className="wrap flex items-end justify-between gap-6 pb-10">
          <div>
            <p className="sheet-code mono ltr text-ink-muted">{company.sheets.projects}</p>
            <h2 id="featured-title" className="display h2 mt-5" data-split>
              {t("home.projects.title")}
            </h2>
          </div>
          <div className="flex items-center gap-8">
            <p className="mono ltr hidden text-ink-muted lg:block" aria-live="polite">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </p>
            <Link href="/projects" className="draw-link mono">
              {t("common.allProjects")} <span className="arrow">→</span>
            </Link>
          </div>
        </div>

        <div data-track className="flex flex-1 flex-col gap-14 px-[var(--gutter)] lg:w-max lg:flex-row lg:gap-[4vw] lg:pe-[12vw]">
          {featuredProjects.map((p, i) => (
            <article key={p.slug} data-panel className="flex w-full flex-col gap-6 lg:h-full lg:w-[min(64vw,1100px)] lg:flex-row lg:gap-10">
              <Link
                href={`/projects/${p.slug}`}
                data-cursor={t("common.view")}
                className="relative block aspect-[4/3] w-full overflow-hidden bg-[#232b28] lg:aspect-auto lg:h-full lg:flex-[1_1_70%]"
                aria-label={t(`projects.items.${p.slug}.title`)}
              >
                <div className="absolute inset-[10%]" data-elev>
                  <Elevation kind={p.elevation} tone="soft" className="h-full w-full" />
                </div>
                <div data-photo className="absolute inset-0">
                  <Photo id={p.image} sizes="(min-width: 1024px) 50vw, 100vw" />
                </div>
                <span className="mono ltr absolute start-4 top-4 bg-ink/80 px-2 py-1 text-paper">{p.code}</span>
              </Link>

              {/* Schedule */}
              <div className="flex flex-col justify-end gap-6 lg:flex-[0_0_30%]">
                <p className="mono ltr text-ink-muted">
                  {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                </p>
                <h3 className="h3">{t(`projects.items.${p.slug}.title`)}</h3>
                <dl className="mono grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 border-t border-paper/20 pt-4 text-ink-muted">
                  <dt>{t("projects.schedule.type")}</dt>
                  <dd className="text-paper">{t(`projects.sectors.${p.sector}`)}</dd>
                  <dt>{t("projects.schedule.plotArea")}</dt>
                  <dd className="ltr tbc text-paper">{p.data.plotArea} m²</dd>
                  <dt>{t("projects.schedule.floors")}</dt>
                  <dd className="ltr text-paper">{p.data.floors}</dd>
                  <dt>{t("projects.schedule.status")}</dt>
                  <dd className="text-paper">{t(`projects.status.${p.status}`)}</dd>
                </dl>
                <p className="mono text-clay-soft">{t("common.sampleProject")}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
