"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { images, type ImageId } from "@/lib/images";
import { Photo } from "./Photo";

/** Project gallery with a keyboard-accessible lightbox (Esc closes, arrows step, focus returns). */
export function Gallery({ ids }: { ids: ImageId[] }) {
  const t = useTranslations("common");
  const locale = useLocale();
  const [open, setOpen] = useState<number | null>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);

  const close = useCallback(() => {
    const el = dialog.current;
    const done = () => {
      setOpen(null);
      opener.current?.focus();
    };
    if (!el || prefersReducedMotion()) return done();
    gsap.to(el, { clipPath: "inset(50% 0 50% 0)", duration: 0.6, onComplete: done });
  }, []);

  const step = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + ids.length) % ids.length)), [ids.length]);

  useEffect(() => {
    if (open === null) return;
    const el = dialog.current!;
    el.querySelector<HTMLButtonElement>("[data-close]")?.focus();
    if (!prefersReducedMotion()) gsap.fromTo(el, { clipPath: "inset(50% 0 50% 0)" }, { clipPath: "inset(0% 0 0% 0)", duration: 0.8 });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      const rtl = document.documentElement.dir === "rtl";
      if (e.key === "ArrowRight") step(rtl ? -1 : 1);
      if (e.key === "ArrowLeft") step(rtl ? 1 : -1);
      if (e.key === "Tab") {
        const f = el.querySelectorAll<HTMLElement>("button");
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open === null]);

  return (
    <>
      <ul className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
        {ids.map((id, i) => (
          <li key={`${id}-${i}`} className={i === 0 ? "col-span-2 row-span-2" : ""}>
            <button
              type="button"
              className="group relative block aspect-[4/3] h-full w-full overflow-hidden"
              onClick={(e) => {
                opener.current = e.currentTarget;
                setOpen(i);
              }}
              aria-label={`${t("view")}: ${locale === "ar" ? images[id].alt.ar : images[id].alt.en}`}
              data-cursor={t("view")}
            >
              <Photo id={id} sizes={i === 0 ? "(min-width: 1024px) 60vw, 100vw" : "(min-width: 1024px) 30vw, 50vw"} imgClassName="transition-transform duration-[1.2s] ease-[var(--ease-draw)] group-hover:scale-[1.04]" />
            </button>
          </li>
        ))}
      </ul>

      {open !== null && (
        <div ref={dialog} role="dialog" aria-modal="true" aria-label={t("view")} className="on-ink fixed inset-0 z-[300] flex flex-col">
          <div className="wrap flex items-center justify-between py-5">
            <p className="mono ltr text-ink-muted">
              {String(open + 1).padStart(2, "0")} / {String(ids.length).padStart(2, "0")}
            </p>
            <button type="button" data-close onClick={close} className="draw-link mono">
              {t("close")} ✕
            </button>
          </div>
          <div className="relative mx-[var(--gutter)] flex-1">
            <Photo id={ids[open]} sizes="100vw" graded={false} imgClassName="!object-contain" />
          </div>
          <div className="wrap flex justify-between py-5">
            <button type="button" onClick={() => step(-1)} className="draw-link mono">
              <span className="arrow">←</span> {t("previous")}
            </button>
            <p className="mono hidden text-ink-muted md:block">{locale === "ar" ? images[ids[open]].alt.ar : images[ids[open]].alt.en}</p>
            <button type="button" onClick={() => step(1)} className="draw-link mono">
              {t("next")} <span className="arrow">→</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
