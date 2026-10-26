"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { services } from "@/lib/content";
import { Icon } from "./Icon";
import { Logo } from "./Logo";
import { Magnetic } from "./Magnetic";

/**
 * Transparent over the hero; after 80px it shrinks to 64px with a paper background and a hairline.
 * Services opens a mega-menu with the six services and their line icons.
 */
export function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mega, setMega] = useState(false);
  const [mobile, setMobile] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);
  const other = locale === "en" ? "ar" : "en";

  // Pages that open on an ink hero start with light header text.
  const darkHero = pathname === "/" || /^\/projects\/[^/]+$/.test(pathname);
  const light = darkHero && !scrolled && !mega && !mobile;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMega(false);
    setMobile(false);
  }, [pathname]);

  useEffect(() => {
    if (!mega && !mobile) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMega(false);
        setMobile(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mega, mobile]);

  const nav = [
    { href: "/projects", label: t("nav.projects") },
    { href: "/about", label: t("nav.about") },
    { href: "/careers", label: t("nav.careers") },
    { href: "/contact", label: t("nav.contact") },
  ] as const;

  const solid = scrolled || mega || mobile;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[90] transition-[height,background-color,border-color,color] duration-700 ease-[var(--ease-draw)] ${
        solid ? "h-16 border-b border-ink/15 bg-paper text-ink" : "h-20 border-b border-transparent"
      } ${light ? "text-paper" : "text-ink"}`}
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      onMouseLeave={() => setMega(false)}
    >
      <div className="wrap flex h-full items-center justify-between gap-6">
        <Link href="/" className="shrink-0" aria-label={t("brand.name")}>
          <Logo nameAr={t("brand.nameAr")} />
        </Link>

        <nav aria-label={t("nav.primary")} className="hidden items-center gap-8 lg:flex">
          <button
            type="button"
            className="draw-link text-[0.95rem]"
            aria-expanded={mega}
            aria-controls="mega-menu"
            onClick={() => setMega((m) => !m)}
            onMouseEnter={() => setMega(true)}
            aria-current={pathname.startsWith("/services") ? "page" : undefined}
          >
            {t("nav.services")}
          </button>
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="draw-link text-[0.95rem]" aria-current={pathname.startsWith(n.href) ? "page" : undefined} onMouseEnter={() => setMega(false)}>
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link href={pathname} locale={other} className="draw-link mono" hrefLang={other} lang={other} aria-label={t("common.switchLanguageLabel")} data-no-transition>
            {t("common.switchLanguage")}
          </Link>
          <span className="hidden sm:inline-block">
            <Magnetic>
              <Link href="/contact" className="btn !min-h-10 !py-2 text-[0.9rem]">
                {t("common.book")}
              </Link>
            </Magnetic>
          </span>
          <button type="button" className="mono lg:hidden" aria-expanded={mobile} aria-controls="mobile-menu" onClick={() => setMobile((m) => !m)}>
            {mobile ? t("common.close") : t("common.menu")}
          </button>
        </div>
      </div>

      {/* Mega-menu: the six services, each with its sheet code and line icon */}
      <div
        id="mega-menu"
        ref={megaRef}
        hidden={!mega}
        className="absolute inset-x-0 top-full border-b border-ink/15 bg-paper text-ink"
        onMouseEnter={() => setMega(true)}
      >
        <div className="wrap grid gap-10 py-10 lg:grid-cols-[1fr_3fr]">
          <div className="grid content-start gap-3">
            <p className="mono sheet-code text-clay-deep ltr">S-200</p>
            <p className="h3">{t("nav.servicesIntro")}</p>
            <Link href="/services" className="draw-link mt-2 w-fit">
              {t("common.allServices")} <span className="arrow">→</span>
            </Link>
          </div>
          <ul className="grid grid-cols-3 border-s border-t border-ink/15">
            {services.map((s) => (
              <li key={s.slug} className="border-e border-b border-ink/15">
                <Link href={`/services/${s.slug}`} className="group grid h-full gap-4 p-6 transition-colors duration-500 hover:bg-gypsum">
                  <span className="flex items-start justify-between">
                    <Icon name={s.icon} className="h-10 w-10 text-teal" />
                    <span className="mono ltr text-concrete-soft">{s.code}</span>
                  </span>
                  <span className="text-[1.05rem] font-medium">{t(`services.items.${s.slug}.title`)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mobile menu */}
      <div id="mobile-menu" hidden={!mobile} className="drafting fixed inset-x-0 bottom-0 top-16 overflow-y-auto text-ink lg:hidden">
        <nav aria-label={t("nav.primary")} className="wrap grid gap-1 py-8">
          <p className="mono mb-2 text-clay-deep">{t("nav.services")}</p>
          {services.map((s) => (
            <Link key={s.slug} href={`/services/${s.slug}`} className="flex items-center gap-3 border-b border-ink/10 py-3">
              <Icon name={s.icon} className="h-7 w-7 text-teal" />
              <span>{t(`services.items.${s.slug}.title`)}</span>
            </Link>
          ))}
          <div className="mt-6 grid gap-1">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className="display py-2 text-[2.2rem]">
                {n.label}
              </Link>
            ))}
          </div>
          <Link href="/contact" className="btn mt-6 w-full">
            {t("common.book")}
          </Link>
        </nav>
      </div>
    </header>
  );
}
