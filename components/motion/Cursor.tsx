"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, isDesktop, prefersReducedMotion } from "@/lib/gsap";

/**
 * Custom cursor (desktop only): a small crosshair with a trailing circle.
 * Grows over links and buttons; shows a label over anything with data-cursor="LABEL".
 */
export function Cursor() {
  const cross = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (!isDesktop() || prefersReducedMotion() || !cross.current || !ring.current) return;
    setOn(true);
    document.documentElement.classList.add("has-cursor");
    const xC = gsap.quickTo(cross.current, "x", { duration: 0.15, ease: "power3" });
    const yC = gsap.quickTo(cross.current, "y", { duration: 0.15, ease: "power3" });
    const xR = gsap.quickTo(ring.current, "x", { duration: 0.6, ease: "draw" });
    const yR = gsap.quickTo(ring.current, "y", { duration: 0.6, ease: "draw" });

    let seen = false;
    const move = (e: PointerEvent) => {
      if (!seen) {
        // Appear only once the pointer has actually moved (no stray cursor in the corner).
        seen = true;
        gsap.set([cross.current, ring.current], { x: e.clientX, y: e.clientY });
        cross.current!.style.opacity = "1";
        if (ring.current!.dataset.state === "hidden") ring.current!.dataset.state = "idle";
      }
      xC(e.clientX);
      yC(e.clientY);
      xR(e.clientX);
      yR(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      const labelled = t.closest<HTMLElement>("[data-cursor]");
      const interactive = t.closest("a, button, [role='button'], input, select, textarea, label");
      setLabel(labelled?.dataset.cursor ?? null);
      ring.current?.setAttribute("data-state", labelled ? "label" : interactive ? "link" : "idle");
    };
    const leave = () => ring.current?.setAttribute("data-state", "hidden");

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", over);
    document.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.removeEventListener("pointerleave", leave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <div aria-hidden="true" hidden={!on} className="pointer-events-none fixed inset-0 z-[250] mix-blend-difference">
      <div ref={ring} data-state="hidden" className="cursor-ring">
        {label && <span className="mono text-[0.65rem] text-white">{label}</span>}
      </div>
      <div ref={cross} className="cursor-cross" style={{ opacity: 0 }} />
      <style>{`
        html.has-cursor, html.has-cursor a, html.has-cursor button { cursor: none; }
        html.has-cursor input, html.has-cursor textarea, html.has-cursor select { cursor: text; }
        .cursor-cross { position: fixed; left: 0; top: 0; width: 15px; height: 15px; margin: -7.5px 0 0 -7.5px; }
        .cursor-cross::before, .cursor-cross::after { content: ""; position: absolute; background: #fff; }
        .cursor-cross::before { left: 7px; top: 0; width: 1px; height: 15px; }
        .cursor-cross::after { top: 7px; left: 0; height: 1px; width: 15px; }
        .cursor-ring { position: fixed; left: 0; top: 0; display: grid; place-items: center; width: 36px; height: 36px; margin: -18px 0 0 -18px;
          border: 1px solid rgba(255,255,255,.7); border-radius: 50%; transition: width .6s cubic-bezier(.22,1,.36,1), height .6s cubic-bezier(.22,1,.36,1), margin .6s cubic-bezier(.22,1,.36,1), opacity .3s; }
        .cursor-ring[data-state="link"] { width: 64px; height: 64px; margin: -32px 0 0 -32px; }
        .cursor-ring[data-state="label"] { width: 96px; height: 96px; margin: -48px 0 0 -48px; border-color: #fff; }
        .cursor-ring[data-state="hidden"] { opacity: 0; }
      `}</style>
    </div>
  );
}
