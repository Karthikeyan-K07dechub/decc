"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { sheetFor } from "@/lib/sheets";
import { getLenis } from "./SmoothScroll";

type Phase = "idle" | "cover" | "lift";

/**
 * Page transitions. Internal link clicks are intercepted: a paper "sheet" panel wipes
 * across showing the next page's sheet code and title in mono, the route changes
 * (inside the View Transitions API where supported), then the sheet lifts away.
 */
export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations();
  const panel = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState({ code: "", title: "" });
  const [phase, setPhase] = useState<Phase>("idle");
  const resolveNav = useRef<(() => void) | null>(null);
  const busy = useRef(false);

  const titleFor = (key: string) => {
    if (key.startsWith("service:")) return t(`services.items.${key.slice(8)}.title`);
    if (key.startsWith("project:")) return t(`projects.items.${key.slice(8)}.title`);
    return t(`meta.pages.${key}.title`);
  };

  // Intercept internal navigation.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download") || a.dataset.noTransition !== undefined) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname) return; // same page (hash links)
      if (prefersReducedMotion() || busy.current) return;

      e.preventDefault();
      busy.current = true;
      const s = sheetFor(url.pathname);
      setLabel({ code: s.code, title: titleFor(s.key) });
      setPhase("cover");

      const el = panel.current!;
      const rtl = document.documentElement.dir === "rtl";
      getLenis()?.stop();
      gsap.set(el, { display: "flex", clipPath: rtl ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)" });
      gsap.to(el, {
        clipPath: "inset(0 0% 0 0%)",
        duration: 0.6,
        onComplete: () => {
          const go = () =>
            new Promise<void>((resolve) => {
              resolveNav.current = resolve;
              router.push(url.pathname + url.search + url.hash, { scroll: true });
              window.setTimeout(resolve, 2500); // never hang
            });
          const vt = (document as Document & { startViewTransition?: (cb: () => Promise<void>) => unknown }).startViewTransition;
          if (vt) vt.call(document, go);
          else void go();
        },
      });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  // New route arrived: lift the sheet away.
  useEffect(() => {
    if (phase !== "cover") return;
    resolveNav.current?.();
    resolveNav.current = null;
    window.scrollTo(0, 0);
    const el = panel.current!;
    setPhase("lift");
    gsap.to(el, {
      clipPath: "inset(0% 0 100% 0)",
      duration: 0.8,
      delay: 0.15,
      onComplete: () => {
        gsap.set(el, { display: "none" });
        getLenis()?.start();
        busy.current = false;
        setPhase("idle");
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      {children}
      <div
        ref={panel}
        aria-hidden={phase === "idle"}
        role="status"
        className="drafting fixed inset-0 z-[260] hidden flex-col justify-end text-ink"
        style={{ paddingInline: "var(--gutter)", paddingBlock: "2.5rem" }}
      >
        <div className="flex items-end justify-between gap-6 border-t border-ink/20 pt-5">
          <p className="mono ltr">SHEET {label.code}</p>
          <p className="mono text-end">{label.title}</p>
        </div>
      </div>
    </>
  );
}
