"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { PRELOAD_KEY } from "@/lib/preload";
import { getLenis } from "./SmoothScroll";

/** A brief architectural title sequence, shown once per browser session. */
export function Preloader({ label }: { label: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const html = document.documentElement;
    if (!html.classList.contains("preload") || prefersReducedMotion()) {
      html.classList.remove("preload");
      setShow(false);
      return;
    }
    try { sessionStorage.setItem(PRELOAD_KEY, "1"); } catch {}

    const el = root.current!;
    const previousOverflow = html.style.overflow;
    getLenis()?.stop();
    html.style.overflow = "hidden";
    const pct = el.querySelector<HTMLElement>("[data-pct]")!;
    const progress = { value: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        html.style.overflow = previousOverflow;
        html.classList.remove("preload");
        getLenis()?.start();
        setShow(false);
        window.dispatchEvent(new Event("decc:revealed"));
      },
    });
    tl.fromTo(el.querySelector("[data-grid]"), { opacity: 0, scale: 1.04 }, { opacity: 1, scale: 1, duration: 1.6 }, 0)
      .fromTo(el.querySelectorAll("[data-letter]"), { yPercent: 110, rotate: 5 }, { yPercent: 0, rotate: 0, duration: 1, stagger: 0.09, ease: "power4.out" }, 0.12)
      .fromTo(el.querySelector("[data-rule]"), { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: "power3.inOut" }, 0.25)
      .fromTo(el.querySelectorAll("[data-detail]"), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.65, stagger: 0.08 }, 0.55)
      .to(progress, {
        value: 100, duration: 1.65, ease: "power2.inOut",
        onUpdate: () => { pct.textContent = String(Math.round(progress.value)).padStart(3, "0"); },
      }, 0)
      .fromTo(el.querySelector("[data-progress]"), { scaleX: 0 }, { scaleX: 1, duration: 1.65, ease: "power2.inOut" }, 0)
      .to(el.querySelector("[data-center]"), { y: -24, opacity: 0, duration: 0.4, ease: "power2.in" }, 1.8)
      .to(el.querySelectorAll("[data-furniture]"), { opacity: 0, duration: 0.3 }, 1.8)
      .to(el, { clipPath: "inset(0 0 100% 0)", duration: 0.85, ease: "power4.inOut" }, 1.95);

    return () => {
      tl.kill();
      html.style.overflow = previousOverflow;
      getLenis()?.start();
    };
  }, []);

  if (!show) return null;
  return (
    <div ref={root} className="preloader fixed inset-0 z-[280]" role="status" aria-label={label}>
      <div className="preloader-grid" data-grid aria-hidden="true" />
      <div className="preloader-frame" data-furniture aria-hidden="true">
        <span className="preloader-edition">EST. 2009</span>
        <span className="preloader-location">RAS AL KHAIMAH, UAE</span>
      </div>
      <div className="preloader-center" data-center aria-hidden="true">
        <div className="preloader-word" dir="ltr">
          {Array.from("DECC").map((letter, i) => <span className="preloader-letter-mask" key={i}><span data-letter>{letter}</span></span>)}
        </div>
        <div className="preloader-rule" data-rule />
        <p className="preloader-name" data-detail>DESIGNER ENGINEERING<br />CONSULTANTS</p>
        <p className="preloader-signature" data-detail>Architecture. Engineered.</p>
      </div>
      <div className="preloader-footer" data-furniture aria-hidden="true" dir="ltr">
        <span>25.7911° N &nbsp; 55.9602° E</span>
        <span className="preloader-count"><span data-pct>000</span><span className="preloader-total"> / 100</span></span>
      </div>
      <div className="preloader-progress" data-progress aria-hidden="true" />
    </div>
  );
}
