"use client";

/**
 * One GSAP setup for the whole site: plugins registered once, and the single
 * easing curve used everywhere — cubic-bezier(0.22, 1, 0.36, 1) — registered as "draw".
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";

let registered = false;

export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, Flip, useGSAP);
  CustomEase.create("draw", "0.22, 1, 0.36, 1");
  gsap.defaults({ ease: "draw", duration: 1 });
  registered = true;
}

registerGsap();

export const EASE = "draw";

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function isDesktop() {
  return typeof window !== "undefined" && window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)").matches;
}

export { gsap, ScrollTrigger, SplitText, Flip, useGSAP };
