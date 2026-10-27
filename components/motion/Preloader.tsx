"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { getLenis } from "./SmoothScroll";

import { PRELOAD_KEY as KEY } from "@/lib/preload";


/**
 * First visit only (per browser session), about 2.2s. Ink screen; a teal compass arc draws
 * the "DECC" monogram; the office coordinates and a 0–100 counter count up in mono;
 * then the screen splits into two clip-path panels to reveal the hero.
 */
export function Preloader({ label }: { label: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(true);

  useEffect(() => {
    // The inline head script adds html.preload on a first visit (see PRELOAD_SCRIPT).
    const html = document.documentElement;
    if (!html.classList.contains("preload") || prefersReducedMotion()) {
      html.classList.remove("preload");
      setShow(false);
      return;
    }
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {}

    const el = root.current!;
    const previousOverflow = html.style.overflow;
    getLenis()?.stop();
    document.documentElement.style.overflow = "hidden";
    const lat = el.querySelector<HTMLElement>("[data-lat]")!;
    const lng = el.querySelector<HTMLElement>("[data-lng]")!;
    const pct = el.querySelector<HTMLElement>("[data-pct]")!;
    const strokes = el.querySelectorAll<SVGGeometryElement>("[data-stroke]");

    const v = { lat: 0, lng: 0, pct: 0 };
    const tl = gsap.timeline({
      paused: true,
      onComplete: () => {
        html.style.overflow = previousOverflow;
        html.classList.remove("preload");
        getLenis()?.start();
        setShow(false);
        window.dispatchEvent(new Event("decc:revealed"));
      },
    });
    tl.to(strokes, { strokeDashoffset: 0, autoRound: false, duration: 1.3, stagger: 0.12 }, 0)
      .to(
        v,
        {
          lat: 25.7911,
          lng: 55.9602,
          pct: 100,
          duration: 1.6,
          ease: "power2.out",
          onUpdate: () => {
            lat.textContent = v.lat.toFixed(4);
            lng.textContent = v.lng.toFixed(4);
            pct.textContent = String(Math.round(v.pct)).padStart(3, "0");
          },
        },
        0
      )
      .to(el.querySelector("[data-top]"), { clipPath: "inset(0 0 100% 0)", duration: 0.75 }, 1.55)
      .to(el.querySelector("[data-bottom]"), { clipPath: "inset(100% 0 0 0)", duration: 0.75 }, 1.55)
      .to(el.querySelector("[data-content]"), { opacity: 0, duration: 0.3 }, 1.5);

    // Count rendered frames, rather than startup stalls, toward the sequence.
    let frame = 0;
    let elapsed = 0;
    let previous: number | null = null;
    const tick = (now: number) => {
      if (previous !== null && document.visibilityState === "visible") {
        elapsed += Math.min(now - previous, 50) / 1000;
      }
      previous = now;
      tl.totalTime(Math.min(elapsed, tl.duration()));
      if (elapsed < tl.duration()) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      tl.kill();
      html.style.overflow = previousOverflow;
      getLenis()?.start();
    };
  }, []);

  if (!show) return null;

  return (
    <div ref={root} className="preloader fixed inset-0 z-[280]" role="status" aria-label={label}>
      <div data-top className="on-ink absolute inset-x-0 top-0 h-1/2" />
      <div data-bottom className="on-ink absolute inset-x-0 bottom-0 h-1/2" />
      <div data-content className="absolute inset-0 grid place-items-center text-paper">
        <svg viewBox="0 0 240 120" className="w-[min(60vw,22rem)]" fill="none" stroke="var(--color-teal-soft)" strokeWidth="1.2" aria-hidden="true" direction="ltr">
          {/* compass arc and construction line */}
          <path data-stroke pathLength="1" strokeDasharray="1" strokeDashoffset="1" d="M20 100 A100 100 0 0 1 220 100" opacity="0.5" />
          <path data-stroke pathLength="1" strokeDasharray="1" strokeDashoffset="1" d="M120 100 L120 4" opacity="0.4" />
          {/* D */}
          <path data-stroke pathLength="1" strokeDasharray="1" strokeDashoffset="1" d="M30 40 V90 H44 A25 25 0 0 0 44 40 Z" />
          {/* E */}
          <path data-stroke pathLength="1" strokeDasharray="1" strokeDashoffset="1" d="M90 40 H76 V90 H90 M76 65 H88" />
          {/* C */}
          <path data-stroke pathLength="1" strokeDasharray="1" strokeDashoffset="1" d="M146 46 A20 25 0 1 0 146 84" />
          {/* C */}
          <path data-stroke pathLength="1" strokeDasharray="1" strokeDashoffset="1" d="M206 46 A20 25 0 1 0 206 84" />
        </svg>
        <div className="mono ltr absolute bottom-10 start-[var(--gutter)] flex gap-4 text-paper/80">
          <span>
            <span data-lat>00.0000</span>°N
          </span>
          <span>
            <span data-lng>00.0000</span>°E
          </span>
        </div>
        <div className="mono ltr absolute bottom-10 end-[var(--gutter)] text-paper/80">
          <span data-pct>000</span>
        </div>
      </div>
    </div>
  );
}
