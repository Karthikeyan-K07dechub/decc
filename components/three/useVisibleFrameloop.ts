"use client";

import { useEffect, useState, type RefObject } from "react";

/** "always" while the element is on screen, "never" otherwise: the render loop pauses off-screen. */
export function useVisibleFrameloop(ref: RefObject<HTMLElement | null>, margin = "100px") {
  const [loop, setLoop] = useState<"always" | "never">("never");
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setLoop(e.isIntersecting ? "always" : "never"), { rootMargin: margin });
    io.observe(el);
    const vis = () => document.hidden && setLoop("never");
    document.addEventListener("visibilitychange", vis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", vis);
    };
  }, [ref, margin]);
  return loop;
}
