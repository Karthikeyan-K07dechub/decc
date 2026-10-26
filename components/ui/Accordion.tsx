"use client";

import { useId, useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

export interface AccordionItem {
  title: string;
  meta?: string;
  content: React.ReactNode;
}

/** Disclosure list with a smooth height animation; the plus mark turns into a minus. */
export function Accordion({ items, ink = false }: { items: AccordionItem[]; ink?: boolean }) {
  const [open, setOpen] = useState<number | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const base = useId();

  const { contextSafe } = useGSAP({ scope: root });

  const toggle = contextSafe((i: number) => {
    const next = open === i ? null : i;
    const panels = root.current!.querySelectorAll<HTMLElement>("[data-panel]");
    const reduced = prefersReducedMotion();
    panels.forEach((p, j) => {
      const shouldOpen = j === next;
      const isOpen = j === open;
      if (shouldOpen === isOpen) return;
      if (reduced) {
        gsap.set(p, { height: shouldOpen ? "auto" : 0 });
        return;
      }
      gsap.to(p, { height: shouldOpen ? "auto" : 0, duration: 0.8, ease: "draw" });
    });
    setOpen(next);
  });

  const line = ink ? "border-paper/20" : "border-ink/15";

  return (
    <div ref={root} className={`border-b ${line}`}>
      {items.map((it, i) => {
        const id = `${base}-${i}`;
        const isOpen = open === i;
        return (
          <div key={it.title} className={`border-t ${line}`}>
            <h3>
              <button
                type="button"
                id={`${id}-b`}
                aria-expanded={isOpen}
                aria-controls={`${id}-p`}
                onClick={() => toggle(i)}
                className="group flex w-full items-center justify-between gap-6 py-6 text-start"
              >
                <span className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
                  <span className="h3 text-[clamp(1.2rem,2vw,1.6rem)]">{it.title}</span>
                  {it.meta && <span className="mono opacity-70">{it.meta}</span>}
                </span>
                <span className="relative size-5 shrink-0" aria-hidden>
                  <span className="absolute inset-x-0 top-1/2 h-px bg-current" />
                  <span className={`absolute inset-y-0 start-1/2 w-px bg-current transition-transform duration-700 ${isOpen ? "scale-y-0" : ""}`} />
                </span>
              </button>
            </h3>
            <div id={`${id}-p`} role="region" aria-labelledby={`${id}-b`} data-panel className="h-0 overflow-hidden" hidden={false} inert={!isOpen}>
              <div className="max-w-[62ch] pb-8 opacity-90">{it.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
