/**
 * A tiny mutable store shared between GSAP ScrollTriggers (DOM side) and the
 * R3F scenes (WebGL side). Writing here never re-renders React.
 */
export const sceneStore = {
  /** Hero pinned section progress, 0 → 1. */
  hero: 0,
  /** Lines drawn in, 0 → 1 (on load). */
  heroDraw: 0,
  /** Exploded building progress, 0 → 1. */
  exploded: 0,
  /** Normalised pointer, -1 → 1. */
  pointer: { x: 0, y: 0 },
};

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** Exploded section: scroll progress → how far apart the layers are (0 stacked, 1 fully exploded). */
export const separation = (p: number) => smooth(0.06, 0.32, p) * (1 - smooth(0.84, 0.98, p));
/** Exploded section: scroll progress → which layer (0–4) the side copy describes. */
export const activeLayer = (p: number) => Math.min(4, Math.max(0, Math.floor(((p - 0.3) / 0.54) * 5)));
