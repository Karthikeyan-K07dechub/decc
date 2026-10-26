export const PRELOAD_KEY = "decc-preloaded";

/**
 * Runs in <head> before paint: shows the preloader only on a first visit with motion allowed.
 * Without JavaScript the preloader never appears.
 */
export const PRELOAD_SCRIPT = `try{if(sessionStorage.getItem("${PRELOAD_KEY}")!=="1"&&!matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.classList.add("preload")}}catch(e){}`;


/** Runs `cb` once the first-visit preloader has finished (or right away when there is none). */
export function onRevealed(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  if (!document.documentElement.classList.contains("preload")) {
    const id = window.requestAnimationFrame(cb);
    return () => window.cancelAnimationFrame(id);
  }
  window.addEventListener("decc:revealed", cb, { once: true });
  return () => window.removeEventListener("decc:revealed", cb);
}
