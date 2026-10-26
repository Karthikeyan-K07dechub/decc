"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { gsap, useGSAP } from "@/lib/gsap";
import { sceneStore, activeLayer, separation } from "@/components/three/store";
import { ExplodedScene, useSceneMode } from "@/components/three/Scenes";
import { Elevation } from "@/components/ui/Elevation";

type Layer = { name: string; service: string; text: string };

/**
 * A G+4 block separates into Foundation, Frame, MEP, Facade and Interiors while the section
 * is pinned; the side copy names the layer and the service that draws it; then it re-stacks.
 */
export function Exploded() {
  const t = useTranslations("home.exploded");
  const layers = t.raw("layers") as Layer[];
  const root = useRef<HTMLElement>(null);
  const labels = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(-1);
  const mode = useSceneMode();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          desk: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
          mob: "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
        },
        (c) => {
          const desk = c.conditions?.desk;
          gsap.timeline({
            scrollTrigger: {
              trigger: desk ? root.current : "[data-exploded-stage]",
              start: desk ? "top top" : "top 70%",
              end: desk ? "+=300%" : "bottom 10%",
              pin: desk ? "[data-exploded-pin]" : false,
              scrub: desk ? 0.8 : true,
              onUpdate: (st) => {
                sceneStore.exploded = st.progress;
                const sep = separation(st.progress);
                setActive(sep > 0.5 ? activeLayer(st.progress) : st.progress > 0.9 ? 5 : -1);
              },
            },
          });
          return () => {
            sceneStore.exploded = 0;
          };
        }
      );
      return () => mm.revert();
    },
    { scope: root }
  );

  const current = active >= 0 && active < 5 ? layers[active] : null;

  return (
    <section ref={root} className="relative bg-gypsum" aria-labelledby="exploded-title">
      <div data-exploded-pin className="wrap grid min-h-[100svh] items-center gap-10 py-24 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:py-0">
        {/* Copy */}
        <div className="relative z-10 grid gap-8 lg:py-24">
          <p className="sheet-code mono ltr">S-200 · {t("complete")}</p>
          <h2 id="exploded-title" className="display h2 max-w-[14ch]" data-split>
            {t("title")}
          </h2>
          <p className="lead text-concrete-soft" data-fade>
            {t("intro")}
          </p>

          {/* Desktop: the active layer */}
          <div className="relative hidden min-h-[11rem] border-t border-ink/15 pt-6 lg:block" aria-live="polite">
            {current ? (
              <div key={active} className="animate-[fadeUp_0.7s_var(--ease-draw)_both]">
                <p className="mono text-teal ltr">
                  0{active + 1} / 05 · {current.service}
                </p>
                <p className="h3 mt-3">{current.name}</p>
                <p className="mt-3 max-w-[40ch] text-concrete-soft">{current.text}</p>
              </div>
            ) : (
              <p className="mono text-concrete-soft">{active === 5 ? t("complete") : `00 / 05`}</p>
            )}
          </div>

          {/* Mobile and reduced motion: all layers as a list */}
          <ol className="grid gap-5 lg:hidden">
            {layers.map((l, i) => (
              <li key={l.name} className="border-t border-ink/15 pt-4">
                <p className="mono text-teal ltr">
                  0{i + 1} · {l.service}
                </p>
                <p className="h3 mt-2">{l.name}</p>
                <p className="mt-2 text-concrete-soft">{l.text}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Stage */}
        <div data-exploded-stage className="drafting relative aspect-square w-full overflow-hidden border border-ink/10 lg:aspect-auto lg:h-[86svh]">
          {mode === "3d" ? (
            <>
              <ExplodedScene label={t("sceneLabel")} labels={labels} />
              {/* Leader labels, positioned by the scene every frame */}
              <div className="pointer-events-none absolute inset-0" dir="ltr" aria-hidden>
                {layers.map((l, i) => (
                  <span
                    key={l.name}
                    ref={(el) => void (labels.current[i] = el)}
                    className="group absolute left-0 top-0 flex items-center opacity-0 will-change-transform"
                    data-active="false"
                  >
                    <span className="block h-px w-10 bg-teal sm:w-16" />
                    <span className="mono whitespace-nowrap bg-gypsum/90 px-2 py-1 text-ink group-data-[active=true]:bg-teal group-data-[active=true]:text-paper">
                      0{i + 1} {l.name}
                    </span>
                  </span>
                ))}
              </div>
            </>
          ) : (
            <div className="absolute inset-[10%]">
              <Elevation kind="block" className="h-full w-full" draw />
            </div>
          )}
          <span className="mono ltr absolute bottom-4 start-4 text-concrete-soft" aria-hidden>
            AXO · G+4 · 1:200
          </span>
        </div>
      </div>
    </section>
  );
}
