"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { gsap, useGSAP, isDesktop, prefersReducedMotion } from "@/lib/gsap";
import { services, company } from "@/lib/content";
import { Icon } from "@/components/ui/Icon";
import { SectionHead } from "@/components/ui/SectionHead";

/** 3×2 gypsum cards: clip-path stagger in, hover tilt (≤ 8°), icon redraw and arrow. */
export function ServicesGrid({ showHead = true }: { showHead?: boolean }) {
  const t = useTranslations();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]");
      const reduced = prefersReducedMotion();
      if (!reduced) {
        gsap.fromTo(
          cards,
          { clipPath: "inset(100% 0 0 0)" },
          { clipPath: "inset(0% 0 0 0)", duration: 1.2, stagger: 0.09, scrollTrigger: { trigger: "[data-cards]", start: "top 80%", once: true } }
        );
      }
      if (!isDesktop() || reduced) return;

      const offs: (() => void)[] = [];
      cards.forEach((card) => {
        const rx = gsap.quickTo(card, "rotationX", { duration: 0.8 });
        const ry = gsap.quickTo(card, "rotationY", { duration: 0.8 });
        const paths = card.querySelectorAll<SVGPathElement>("[data-icon] path");
        const move = (e: PointerEvent) => {
          const r = card.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          rx(-y * 8 * 2 * 0.5);
          ry(x * 8 * 2 * 0.5);
        };
        const enter = () => {
          paths.forEach((p) => {
            const len = p.getTotalLength();
            gsap.fromTo(p, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 0.9 });
          });
        };
        const leave = () => {
          rx(0);
          ry(0);
        };
        card.addEventListener("pointermove", move);
        card.addEventListener("pointerenter", enter);
        card.addEventListener("pointerleave", leave);
        offs.push(() => {
          card.removeEventListener("pointermove", move);
          card.removeEventListener("pointerenter", enter);
          card.removeEventListener("pointerleave", leave);
        });
      });
      return () => offs.forEach((f) => f());
    },
    { scope: root }
  );

  return (
    <section ref={root} className="section drafting" aria-labelledby={showHead ? "services-title" : undefined}>
      <div className="wrap">
        {showHead && (
          <div className="mb-14 flex flex-wrap items-end justify-between gap-8 lg:mb-20">
            <SectionHead code={company.sheets.services} title={t("home.services.title")} intro={t("home.services.intro")} />
            <Link href="/services" className="draw-link mono">
              {t("common.allServices")} <span className="arrow">→</span>
            </Link>
          </div>
        )}
        <ul data-cards className="grid gap-px border border-ink/15 bg-ink/15 [perspective:1200px] sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <li key={s.slug} className="bg-paper">
              <Link
                href={`/services/${s.slug}`}
                data-card
                className="group relative flex h-full min-h-[22rem] flex-col bg-gypsum p-7 transition-colors duration-700 [transform-style:preserve-3d] hover:bg-paper lg:p-9"
              >
                <div className="flex items-start justify-between">
                  <Icon name={s.icon} className="size-14 text-teal" />
                  <span className="mono ltr text-concrete-soft">{s.code}</span>
                </div>
                <h3 className="h3 mt-auto pt-12">{t(`services.items.${s.slug}.title`)}</h3>
                <p className="mt-4 max-w-[34ch] text-concrete-soft">{t(`services.items.${s.slug}.short`)}</p>
                <span className="mono mt-8 flex items-center gap-3 text-clay">
                  {t("common.explore")}
                  <span className="arrow transition-transform duration-700 group-hover:translate-x-2 rtl:group-hover:-translate-x-2">→</span>
                </span>
                <span className="absolute inset-x-0 bottom-0 h-0.5 origin-[left_center] scale-x-0 bg-clay transition-transform duration-700 group-hover:scale-x-100 rtl:origin-[right_center]" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
