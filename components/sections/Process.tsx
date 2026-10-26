"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { SectionHead } from "@/components/ui/SectionHead";

/** Node x positions along the path (viewBox 1200 × 220), one per step. */
const NODES = [60, 330, 600, 870, 1140];
const PATH = "M60 110 C 195 30, 195 30, 330 110 S 465 190, 600 110 S 735 30, 870 110 S 1005 190, 1140 110";

/** Brief → handover: an SVG route with five nodes; a clay dot travels along it with the scroll. */
export function Process() {
  const t = useTranslations("home.process");
  const steps = t.raw("steps") as { title: string; text: string }[];
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const path = root.current!.querySelector<SVGPathElement>("[data-route]");
      const dot = root.current!.querySelector<SVGCircleElement>("[data-dot]");
      const nodes = gsap.utils.toArray<SVGCircleElement>("[data-node]");
      const items = gsap.utils.toArray<HTMLElement>("[data-step]");
      if (!path || !dot) return;
      const len = path.getTotalLength();
      const rtl = document.documentElement.dir === "rtl";

      if (prefersReducedMotion()) {
        nodes.forEach((n) => n.classList.add("is-on"));
        return;
      }
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
      gsap.set(items, { opacity: 0.35 });

      gsap.to(path, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top 60%",
          end: "bottom 70%",
          scrub: 0.6,
          onUpdate: (st) => {
            const pt = path.getPointAtLength(st.progress * len);
            dot.setAttribute("cx", String(pt.x));
            dot.setAttribute("cy", String(pt.y));
            const reached = Math.floor(st.progress * 4 + 0.02);
            nodes.forEach((n, i) => n.classList.toggle("is-on", i <= reached));
            items.forEach((el, i) => gsap.to(el, { opacity: i <= reached ? 1 : 0.35, duration: 0.6, overwrite: true }));
          },
        },
      });
      // Arabic reads right to left: mirror the route, not the text.
      if (rtl) gsap.set(root.current!.querySelector("[data-route-svg]"), { scaleX: -1 });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="section drafting" aria-labelledby="process-title">
      <div className="wrap">
        <SectionHead code="A-000.5" title={t("title")} />
        <svg data-route-svg viewBox="0 0 1200 220" className="mt-16 hidden w-full overflow-visible text-teal lg:block" aria-hidden>
          <path d={PATH} fill="none" stroke="currentColor" strokeOpacity="0.2" strokeDasharray="4 6" vectorEffect="non-scaling-stroke" />
          <path data-route d={PATH} fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          {NODES.map((x) => (
            <circle key={x} data-node cx={x} cy={110} r={9} className="fill-paper stroke-teal transition-[fill] duration-700 [&.is-on]:fill-teal" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          ))}
          <circle data-dot cx={60} cy={110} r={6} className="fill-clay" />
        </svg>
        <ol className="mt-10 grid gap-10 border-s border-teal/40 ps-6 lg:mt-6 lg:grid-cols-5 lg:gap-6 lg:border-0 lg:ps-0">
          {steps.map((s, i) => (
            <li key={s.title} data-step className="relative">
              <span className="absolute -start-[1.85rem] top-1 size-2.5 rounded-full bg-teal lg:hidden" aria-hidden />
              <p className="mono ltr text-teal">0{i + 1}</p>
              <h3 className="h3 mt-3 text-[1.35rem]">{s.title}</h3>
              <p className="mt-3 max-w-[30ch] text-concrete-soft">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
