"use client";

import { useEffect, useRef } from "react";
import { gsap, isDesktop, prefersReducedMotion } from "@/lib/gsap";

/** Pulls its child gently toward the pointer (desktop only). */
export function Magnetic({ children, strength = 0.28 }: { children: React.ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !isDesktop() || prefersReducedMotion()) return;
    const x = gsap.quickTo(el, "x", { duration: 0.8 });
    const y = gsap.quickTo(el, "y", { duration: 0.8 });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      x((e.clientX - (r.left + r.width / 2)) * strength);
      y((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => {
      x(0);
      y(0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [strength]);

  return (
    <span ref={ref} className="inline-block">
      {children}
    </span>
  );
}
