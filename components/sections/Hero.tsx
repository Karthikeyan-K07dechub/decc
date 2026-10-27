"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { gsap, ScrollTrigger, SplitText, useGSAP, prefersReducedMotion, isDesktop } from "@/lib/gsap";
import { onRevealed } from "@/lib/preload";
import { company } from "@/lib/content";
import { sceneStore } from "@/components/three/store";
import { HeroScene, useSceneMode } from "@/components/three/Scenes";
import { Photo } from "@/components/ui/Photo";
import { Elevation } from "@/components/ui/Elevation";
import { Magnetic } from "@/components/ui/Magnetic";

/** Three Hajar mountain ridgelines, flat fills on ink, moving at different speeds. */
const RIDGES = [
  { d: "M0 300 L0 190 L90 150 L160 175 L250 110 L330 150 L420 95 L520 140 L610 85 L700 130 L800 70 L900 125 L1000 90 L1100 140 L1200 100 L1300 150 L1440 120 L1440 300 Z", fill: "#232b28", speed: 6 },
  { d: "M0 300 L0 215 L120 180 L220 205 L330 160 L450 195 L560 150 L690 190 L810 145 L930 185 L1060 150 L1180 195 L1310 165 L1440 190 L1440 300 Z", fill: "#27302c", speed: 12 },
  { d: "M0 300 L0 245 L160 220 L300 240 L470 210 L640 238 L820 215 L1000 240 L1180 220 L1440 236 L1440 300 Z", fill: "#2b3531", speed: 20 },
];

export function Hero() {
  const t = useTranslations();
  const root = useRef<HTMLElement>(null);
  const mode = useSceneMode();

  useGSAP(
    () => {
      const el = root.current!;
      const reduced = prefersReducedMotion();
      const headline = el.querySelector<HTMLElement>("[data-hero-title]")!;
      const after = el.querySelectorAll<HTMLElement>("[data-hero-after]");

      /* Entrance: lines draw in, then the headline rises word by word */
      let split: SplitText | null = null;
      if (!reduced) {
        split = SplitText.create(headline, { type: "words", mask: "words" });
        gsap.set(split.words, { yPercent: 110 });
        gsap.set(after, { opacity: 0, y: 16 });
      }
      const stop = onRevealed(() => {
        if (reduced) {
          sceneStore.heroDraw = 1;
          return;
        }
        gsap.to(sceneStore, { heroDraw: 1, duration: 2.8, ease: "draw" });
        gsap.to(split!.words, { yPercent: 0, duration: 1.3, stagger: 0.07, delay: 0.25 });
        gsap.to(after, { opacity: 1, y: 0, duration: 1.1, stagger: 0.08, delay: 0.7 });
        gsap.fromTo(el.querySelectorAll("[data-ridge]"), { yPercent: 12 }, { yPercent: 0, duration: 1.6, stagger: 0.08 });
      });

      /* Pointer tilt (desktop) */
      const onMove = (e: PointerEvent) => {
        sceneStore.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
        sceneStore.pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
      };
      if (isDesktop()) window.addEventListener("pointermove", onMove, { passive: true });

      /* Pin when the content fits, including laptop viewports below 640px tall. */
      const mm = gsap.matchMedia();
      mm.add(
        {
          desk: "(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
          flow: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        },
        (c) => {
          const copy = el.querySelector<HTMLElement>("[data-hero-copy]")!;
          let scrollContext: gsap.Context | undefined;
          let pinned: boolean | undefined;
          let frame = 0;

          const sync = () => {
            const desk = Boolean(c.conditions?.desk) && copy.offsetHeight <= window.innerHeight + 1;
            if (desk === pinned) return;
            scrollContext?.revert();
            pinned = desk;
            scrollContext = gsap.context(() => {
              const tl = gsap.timeline({
                defaults: { ease: "none" },
                scrollTrigger: {
                  trigger: el,
                  start: "top top",
                  end: () => desk ? `+=${window.innerHeight * (window.innerHeight <= 720 ? 1 : 2)}` : "bottom top",
                  pin: desk,
                  scrub: desk ? 0.6 : true,
                  invalidateOnRefresh: true,
                },
              });
              // The finished building hands over to the real photograph.
              tl.to("[data-hero-photo]", { opacity: 0.6, duration: 0.3 }, 0.66)
                .to("[data-hero-scene]", { opacity: 0.12, duration: 0.3 }, 0.68)
                .to("[data-hero-copy]", { opacity: desk ? 0.92 : 0.6, duration: 1 }, 0);
              el.querySelectorAll<HTMLElement>("[data-ridge]").forEach((r) => {
                tl.to(r, { y: -Number(r.dataset.speed) * (desk ? 6 : 3), duration: 1 }, 0);
              });
              // The WebGL model follows the same scrubbed progress as the photo handover.
              tl.eventCallback("onUpdate", () => { sceneStore.hero = tl.progress(); });
            }, el);
          };

          const resize = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
              sync();
              ScrollTrigger.refresh();
            });
          };
          sync();
          const observer = new ResizeObserver(resize);
          observer.observe(copy);
          window.addEventListener("resize", resize, { passive: true });
          return () => {
            cancelAnimationFrame(frame);
            observer.disconnect();
            window.removeEventListener("resize", resize);
            scrollContext?.revert();
            sceneStore.hero = 0;
          };
        }
      );

      // Mobile gets its own sequence; keep the checked desktop/laptop timeline above intact.
      mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
        const copy = el.querySelector<HTMLElement>("[data-hero-copy]")!;
        let drawingFollowsScroll = false;
        let frame = 0;
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: el,
            // Let short phones reveal the full copy before holding the hero in place.
            start: () => copy.offsetHeight > document.documentElement.clientHeight + 1 ? "bottom bottom" : "top top",
            end: () => `+=${document.documentElement.clientHeight}`,
            pin: true,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        tl.to("[data-hero-photo]", { opacity: 0.6, duration: 0.3 }, 0.66)
          .to("[data-hero-scene]", { opacity: 0.12, duration: 0.3 }, 0.68)
          .to("[data-hero-copy]", { opacity: 0.6, duration: 1 }, 0);
        el.querySelectorAll<HTMLElement>("[data-ridge]").forEach((r) => {
          tl.to(r, { y: -Number(r.dataset.speed) * 3, duration: 1 }, 0);
        });
        tl.eventCallback("onUpdate", () => {
          const progress = tl.progress();
          sceneStore.hero = progress;
          if (progress > 0) {
            // A quick swipe must finish drawing the model before the photo handover.
            if (!drawingFollowsScroll) {
              gsap.killTweensOf(sceneStore, "heroDraw");
              drawingFollowsScroll = true;
            }
            sceneStore.heroDraw = Math.max(sceneStore.heroDraw, Math.min(1, progress / 0.25));
          }
        });
        const refresh = () => {
          cancelAnimationFrame(frame);
          frame = requestAnimationFrame(() => ScrollTrigger.refresh());
        };
        const observer = new ResizeObserver(refresh);
        observer.observe(copy);
        window.addEventListener("resize", refresh, { passive: true });
        return () => {
          cancelAnimationFrame(frame);
          observer.disconnect();
          window.removeEventListener("resize", refresh);
          sceneStore.hero = 0;
        };
      });

      return () => {
        stop();
        split?.revert();
        window.removeEventListener("pointermove", onMove);
        mm.revert();
        sceneStore.heroDraw = 0;
        ScrollTrigger.refresh();
      };
    },
    { scope: root }
  );

  return (
    <section ref={root} className="hero on-ink relative overflow-hidden" aria-labelledby="hero-title">
      {/* Photo the drawing becomes (static fallback for reduced motion / no WebGL) */}
      <div data-hero-photo className={`absolute inset-0 ${mode === "static" ? "opacity-60" : "opacity-0"}`}>
        <Photo id="villaHero" sizes="100vw" priority />
        <span className="absolute inset-0 bg-ink/45" aria-hidden />
      </div>

      {/* Mountains */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%]" aria-hidden>
        {RIDGES.map((r) => (
          <svg key={r.speed} data-ridge data-speed={r.speed} viewBox="0 0 1440 300" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-full w-full">
            <path d={r.d} fill={r.fill} fillOpacity={mode === "static" ? 0.85 : 1} stroke="#6fb0b8" strokeOpacity="0.18" vectorEffect="non-scaling-stroke" />
          </svg>
        ))}
      </div>

      {/* 3D villa, over a static line poster until it loads */}
      <div data-hero-scene className="hero-scene pointer-events-none absolute" aria-hidden={mode !== "3d"}>
        {mode === "pending" && (
          <div className="absolute inset-[18%_8%_22%] opacity-50">
            <Elevation kind="villa" tone="soft" className="h-full w-full" />
          </div>
        )}
        {mode === "3d" && <HeroScene label={t("home.hero.sceneLabel")} />}
      </div>

      {/* Copy */}
      <div data-hero-copy className="hero-copy wrap relative flex flex-col justify-center">
        <div className="hero-content min-w-0">
          <p className="sheet-code mono ltr mb-5 text-ink-muted" data-hero-after>
            {company.sheets.home} · {t("brand.name")}
          </p>
          <h1 id="hero-title" data-hero-title className="hero-title display text-paper">
            {t("home.hero.headline")}
          </h1>
          <p className="lead mt-5 text-ink-muted" data-hero-after>
            {t("home.hero.subline")}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-4" data-hero-after>
            <Magnetic>
              <Link href="/contact" className="btn">
                {t("common.book")} <span className="arrow" aria-hidden>→</span>
              </Link>
            </Magnetic>
            <Link href="/projects" className="btn btn-outline text-paper">
              {t("common.seeProjects")}
            </Link>
          </div>
        </div>
      </div>

      {/* Corner annotations */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden pb-6 lg:block" aria-hidden>
        <div className="wrap mono flex justify-between text-ink-muted">
          <span className="ltr">{company.coords.label}</span>
          <span className="ltr">
            {t("common.scale")} 1:100 · {t("common.sheet")} {company.sheets.home}
          </span>
          <span className="flex items-center gap-3">
            {t("common.scroll")} <span className="block h-8 w-px bg-teal-soft" />
          </span>
        </div>
      </div>
    </section>
  );
}
