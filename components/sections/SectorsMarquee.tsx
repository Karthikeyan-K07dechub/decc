"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/** Outlined sector names drifting across; scrolling speeds them up and skews them slightly. Reversed in Arabic. */
export function SectorsMarquee() {
  const t = useTranslations("home.sectors");
  const list = t.raw("list") as string[];
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const track = root.current!.querySelector<HTMLElement>("[data-marquee]")!;
      const dir = document.documentElement.dir === "rtl" ? 1 : -1;
      const wrap = gsap.utils.wrap(-50, 0);
      const skew = gsap.quickTo(track, "skewX", { duration: 0.5 });
      let x = 0;
      let boost = 0;
      let visible = false;

      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onToggle: (s) => void (visible = s.isActive),
        onUpdate: (s) => {
          const v = s.getVelocity();
          boost = gsap.utils.clamp(-6, 6, v / 400);
          skew(gsap.utils.clamp(-8, 8, -v / 250) * -dir);
        },
      });

      const tick = (_t: number, dt: number) => {
        if (!visible) return;
        boost *= 0.94;
        x += (dt / 1000) * (2.2 + Math.abs(boost) * 2.5) * dir;
        gsap.set(track, { xPercent: wrap(x) });
        if (Math.abs(boost) < 0.05) skew(0);
      };
      gsap.ticker.add(tick);
      return () => {
        gsap.ticker.remove(tick);
        st.kill();
      };
    },
    { scope: root }
  );

  const row = (hidden: boolean) =>
    list.map((s, i) => (
      <li key={`${hidden}-${i}`} className="flex items-center gap-[4vw] pe-[4vw]" aria-hidden={hidden || undefined}>
        <span className="display whitespace-nowrap text-[clamp(3.5rem,11vw,10rem)] text-transparent [-webkit-text-stroke:1px_var(--color-teal)] transition-colors duration-700 hover:text-teal">
          {s}
        </span>
        <span className="size-3 shrink-0 rotate-45 border border-clay" aria-hidden />
      </li>
    ));

  return (
    <section ref={root} className="overflow-hidden border-y border-ink/15 bg-paper py-14 lg:py-20" aria-labelledby="sectors-title">
      <h2 id="sectors-title" className="wrap mono mb-8 text-concrete-soft">
        {t("title")}
      </h2>
      <div dir="ltr">
        <ul data-marquee className="flex w-max will-change-transform" aria-label={list.join(", ")}>
          {row(false)}
          {row(true)}
        </ul>
      </div>
    </section>
  );
}
