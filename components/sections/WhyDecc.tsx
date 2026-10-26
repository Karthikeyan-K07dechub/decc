"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { Photo } from "@/components/ui/Photo";
import { SectionHead } from "@/components/ui/SectionHead";

/** Three numbered reasons with line masks, a teal column-and-beam drawing and a structure photo in parallax. */
export function WhyDecc() {
  const t = useTranslations("home.why");
  const reasons = t.raw("reasons") as { title: string; text: string }[];
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        "[data-parallax] img",
        { yPercent: -8, scale: 1.15 },
        { yPercent: 8, scale: 1.15, ease: "none", scrollTrigger: { trigger: "[data-parallax]", start: "top bottom", end: "bottom top", scrub: true } }
      );
    },
    { scope: root }
  );

  return (
    <section ref={root} className="section bg-gypsum" aria-labelledby="why-title">
      <div className="wrap grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <SectionHead code="A-000.6" title={t("title")} />
          <ol className="mt-14 grid gap-12">
            {reasons.map((r, i) => (
              <li key={r.title} className="grid grid-cols-[3.5rem_1fr] gap-4 border-t border-ink/15 pt-6">
                <span className="mono ltr text-teal">0{i + 1}</span>
                <div>
                  <h3 className="h3" data-split="lines">
                    {r.title}
                  </h3>
                  <p className="mt-3 max-w-[44ch] text-concrete-soft" data-split="lines">
                    {r.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="relative lg:col-span-5 lg:col-start-8">
          {/* Column-and-beam elevation */}
          <svg viewBox="0 0 400 140" className="mb-6 w-full text-teal" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden data-draw data-stagger="0.08">
            <path d="M10 20h380M10 32h380" vectorEffect="non-scaling-stroke" />
            <path d="M40 32v100M52 32v100M194 32v100M206 32v100M348 32v100M360 32v100" vectorEffect="non-scaling-stroke" />
            <path d="M30 132h32M184 132h32M338 132h32" vectorEffect="non-scaling-stroke" />
            <path d="M46 10v6M200 10v6M354 10v6M46 13h308" vectorEffect="non-scaling-stroke" />
            <path d="M120 32l-14 14M280 32l-14 14" vectorEffect="non-scaling-stroke" />
          </svg>
          <div data-parallax className="relative aspect-[4/5] overflow-hidden">
            <Photo id="concreteFrame" sizes="(min-width: 1024px) 40vw, 100vw" />
          </div>
          <p className="mono mt-3 text-concrete-soft">{t("title")} · 1:50</p>
        </div>
      </div>
    </section>
  );
}
