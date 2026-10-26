"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { prefersReducedMotion } from "@/lib/gsap";

/**
 * WebGL scenes, loaded only in the browser (ssr: false) and only after the page is interactive,
 * so the static poster underneath is what the browser paints first (good for LCP).
 */
export const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false, loading: () => null });
export const ExplodedScene = dynamic(() => import("./ExplodedScene"), { ssr: false, loading: () => null });
export const ServiceScene = dynamic(() => import("./ServiceScene"), { ssr: false, loading: () => null });

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/** "3d" when motion is allowed and WebGL works; "static" means show the poster image instead. */
export function useSceneMode(): "pending" | "3d" | "static" {
  const [mode, setMode] = useState<"pending" | "3d" | "static">("pending");
  useEffect(() => {
    if (prefersReducedMotion() || !hasWebGL()) {
      setMode("static");
      return;
    }
    // Wait for idle time so the 3D bundle never competes with first paint.
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(() => setMode("3d"), { timeout: 1200 });
      return () => w.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(() => setMode("3d"), 300);
    return () => window.clearTimeout(id);
  }, []);
  return mode;
}
