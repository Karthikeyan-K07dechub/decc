"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import type { ImageId } from "@/lib/images";
import type { Project } from "@/lib/content";
import { Photo } from "./Photo";
import { Elevation } from "./Elevation";

/**
 * The house reveal: a teal line elevation draws itself on paper, then a clip-path wipe
 * (in reading direction) uncovers the real photo behind it, which settles from a slight zoom.
 */
export function LineToPhoto({
  image,
  elevation,
  sizes,
  className = "",
  ink = false,
  priority,
  immediate = false,
}: {
  image: ImageId;
  elevation: Project["elevation"];
  sizes: string;
  className?: string;
  ink?: boolean;
  priority?: boolean;
  /** Play on mount instead of on scroll (for heroes). */
  immediate?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const photo = el.querySelector<HTMLElement>("[data-photo]")!;
      const paths = el.querySelectorAll<SVGPathElement>("[data-elev] path");
      if (prefersReducedMotion()) {
        gsap.set(photo, { clipPath: "inset(0 0% 0 0%)" });
        return;
      }
      const rtl = document.documentElement.dir === "rtl";
      paths.forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      });
      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: "draw" },
      });
      tl.to(paths, { strokeDashoffset: 0, duration: 1.1, stagger: 0.05 })
        .fromTo(photo, { clipPath: rtl ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0%)", duration: 1.3 }, "-=0.3")
        .fromTo(photo.querySelector("img"), { scale: 1.12 }, { scale: 1, duration: 1.6 }, "<");
      if (immediate) tl.play(0.1);
      else
        gsap.timeline({
          scrollTrigger: { trigger: el, start: "top 80%", once: true, onEnter: () => void tl.play() },
        });
    },
    { scope: root }
  );

  return (
    <div ref={root} className={`relative overflow-hidden ${ink ? "bg-ink" : "drafting"} ${className}`}>
      <div className="absolute inset-[8%]" data-elev>
        <Elevation kind={elevation} tone={ink ? "soft" : "teal"} className="h-full w-full" />
      </div>
      <div data-photo className="absolute inset-0 [clip-path:inset(0_0%_0_0%)] [.js_&]:[clip-path:inset(0_100%_0_0)] rtl:[.js_&]:[clip-path:inset(0_0_0_100%)]">
        <Photo id={image} sizes={sizes} priority={priority} />
      </div>
    </div>
  );
}
