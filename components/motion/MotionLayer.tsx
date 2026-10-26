"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger, SplitText, prefersReducedMotion } from "@/lib/gsap";

/**
 * Site-wide motion driven by data attributes, so server components can opt in:
 *  - [data-split]  heading split into words (or lines with data-split="lines") that rise from masks
 *  - [data-fade]   element fades and rises once (optional data-delay in seconds)
 *  - [data-rule]   hairline rule that draws across
 *  - [data-draw]   SVG whose strokes draw in with stroke-dasharray / stroke-dashoffset
 *  - [data-count]  number that counts up to its text value
 *  - [data-wipe]   clip-path wipe in reading direction
 * A fresh GSAP context per route; reverted on route change.
 */
export function MotionLayer() {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.classList.add("js");
    const reduced = prefersReducedMotion();
    const rtl = document.documentElement.dir === "rtl";
    const splits: SplitText[] = [];

    const ctx = gsap.context(() => {
      /* Headings: word masks */
      gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
        if (el.dataset.splitDone) return;
        el.dataset.splitDone = "1";
        if (reduced) {
          gsap.from(el, { opacity: 0, duration: 0.8, scrollTrigger: { trigger: el, start: "top 90%", once: true } });
          return;
        }
        const type = el.dataset.split === "lines" ? "lines" : "words";
        const split = SplitText.create(el, { type, mask: type, linesClass: "split-line", wordsClass: "split-word" });
        splits.push(split);
        const targets = type === "lines" ? split.lines : split.words;
        gsap.from(targets, {
          yPercent: 110,
          duration: 1.2,
          stagger: type === "lines" ? 0.1 : 0.06,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
          delay: Number(el.dataset.delay ?? 0),
        });
      });

      /* Fades */
      gsap.utils.toArray<HTMLElement>("[data-fade]").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: reduced ? 0 : 24 },
          {
            opacity: 1,
            y: 0,
            duration: reduced ? 0.6 : 1.1,
            delay: Number(el.dataset.delay ?? 0),
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          }
        );
      });

      /* Hairline rules */
      gsap.utils.toArray<HTMLElement>("[data-rule]").forEach((el) => {
        if (reduced) return;
        gsap.fromTo(el, { scaleX: 0 }, { scaleX: 1, duration: 1.4, scrollTrigger: { trigger: el, start: "top 92%", once: true } });
      });

      /* SVG line drawings */
      gsap.utils.toArray<SVGSVGElement>("[data-draw]").forEach((svg) => {
        const paths = svg.querySelectorAll<SVGGeometryElement>("path, line, polyline, circle, rect, ellipse");
        if (reduced) return;
        paths.forEach((p) => {
          const len = typeof p.getTotalLength === "function" ? p.getTotalLength() : 400;
          p.style.strokeDasharray = `${len}`;
          p.style.strokeDashoffset = `${len}`;
        });
        gsap.to(paths, {
          strokeDashoffset: 0,
          duration: Number(svg.dataset.duration ?? 1.4),
          stagger: Number(svg.dataset.stagger ?? 0.04),
          scrollTrigger: { trigger: svg, start: "top 85%", once: true },
        });
      });

      /* Counters (mono numbers) */
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const target = Number(el.dataset.count);
        if (!Number.isFinite(target) || reduced) return;
        const pad = el.textContent?.length ?? 0;
        const obj = { v: el.dataset.from ? Number(el.dataset.from) : 0 };
        gsap.to(obj, {
          v: target,
          duration: 1.4,
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          onUpdate: () => {
            el.textContent = String(Math.round(obj.v)).padStart(pad, "0");
          },
        });
      });

      /* Clip-path wipes */
      gsap.utils.toArray<HTMLElement>("[data-wipe]").forEach((el) => {
        if (reduced) return;
        const from = rtl ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)";
        gsap.fromTo(
          el,
          { clipPath: from },
          {
            clipPath: "inset(0 0% 0 0%)",
            duration: 1.3,
            delay: Number(el.dataset.delay ?? 0),
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          }
        );
      });
    });

    // Layout may change once fonts and images settle.
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 400);

    return () => {
      window.clearTimeout(t);
      ctx.revert();
      splits.forEach((s) => s.revert());
      document.querySelectorAll<HTMLElement>("[data-split-done]").forEach((el) => delete el.dataset.splitDone);
    };
  }, [pathname]);

  return null;
}
