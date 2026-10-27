"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { company } from "@/lib/content";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

/**
 * Contact details, page links, and a giant outlined "DECC" whose stroke draws
 * in when it enters the screen.
 */
export function Footer() {
  const t = useTranslations();
  const pathname = usePathname();
  const word = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = word.current;
    if (!svg || prefersReducedMotion()) return;
    const text = svg.querySelector("text")!;
    gsap.set(text, { strokeDasharray: 2200, strokeDashoffset: 2200 });
    const st = ScrollTrigger.create({
      trigger: svg,
      start: "top 95%",
      once: true,
      onEnter: () => gsap.to(text, { strokeDashoffset: 0, duration: 3, ease: "draw" }),
    });
    return () => st.kill();
  }, [pathname]);

  const pages = [
    { href: "/", label: "A-000" },
    { href: "/about", label: t("nav.about") },
    { href: "/services", label: t("nav.services") },
    { href: "/projects", label: t("nav.projects") },
    { href: "/careers", label: t("nav.careers") },
    { href: "/contact", label: t("nav.contact") },
  ];

  return (
    <footer className="on-ink pb-28 pt-8 lg:pb-12">
      <div className="wrap">
        <h2 className="sr-only">{t("footer.titleBlock")}</h2>

        <div className="grid border-s border-t border-paper/20 md:grid-cols-[2fr_1fr_1fr]">
          <div className="grid gap-4 border-e border-b border-paper/20 p-6">
            <p className="mono text-ink-muted">{t("footer.contact")}</p>
            <p className="max-w-[34ch]">{t("contact.address")}</p>
            <p className="flex flex-wrap gap-x-6 gap-y-2">
              <a href={company.phoneHref} className="draw-link ltr">
                {company.phone}
              </a>
              <a href={`https://wa.me/${company.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="draw-link ltr">
                {t("common.whatsapp")} {company.whatsapp}
              </a>
              <a href={`mailto:${company.email}`} className="draw-link">
                {company.email}
              </a>
            </p>
            <p className="mono text-ink-muted">
              {t("common.hoursLabel")} · <span>{t("common.hours")}</span> · <span className="ltr">{company.coords.label}</span>
            </p>
          </div>
          <nav aria-label={t("footer.pages")} className="grid content-start gap-2 border-e border-b border-paper/20 p-6">
            <p className="mono text-ink-muted">{t("footer.pages")}</p>
            {pages.map((p) => (
              <Link key={p.href} href={p.href} className="draw-link w-fit">
                {p.label}
              </Link>
            ))}
          </nav>
          <div className="grid content-start gap-2 border-e border-b border-paper/20 p-6">
            <p className="mono text-ink-muted">{t("footer.social")}</p>
            <a href={`https://instagram.com/${company.instagram}`} target="_blank" rel="noopener noreferrer" className="draw-link ltr w-fit">
              Instagram @{company.instagram}
            </a>
          </div>
        </div>

        {/* Giant outlined wordmark */}
        <svg ref={word} viewBox="0 0 1000 240" className="mt-14 w-full" role="img" aria-label="DECC" direction="ltr">
          <text
            x="50%"
            y="205"
            textAnchor="middle"
            fill="none"
            stroke="var(--color-teal-soft)"
            strokeWidth="1.2"
            style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 270, letterSpacing: "-0.03em", fontVariationSettings: '"wdth" 125' }}
          >
            DECC
          </text>
        </svg>

        <div className="mono mt-8 flex flex-wrap justify-between gap-4 text-ink-muted">
          <span>
            © {new Date().getFullYear()} {t("brand.name")}. {t("footer.rights")}
          </span>
          <span>{t("footer.credits")}</span>
        </div>
      </div>
    </footer>
  );
}
