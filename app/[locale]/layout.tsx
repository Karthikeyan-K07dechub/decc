import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { SITE_URL, businessJsonLd } from "@/lib/seo";
import { PRELOAD_SCRIPT } from "@/lib/preload";
import { archivo, instrument, plexMono, alexandria, plexArabic } from "../fonts";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { MobileBar } from "@/components/ui/MobileBar";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { MotionLayer } from "@/components/motion/MotionLayer";
import { Cursor } from "@/components/motion/Cursor";
import { Preloader } from "@/components/motion/Preloader";
import { TransitionProvider } from "@/components/motion/TransitionProvider";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t("pages.home.title"), template: t("titleTemplate") },
    description: t("pages.home.description"),
    applicationName: "DECC",
    icons: { icon: "/icon.svg" },
  };
}

export const viewport: Viewport = {
  themeColor: "#F3EEE4",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: "common" });
  const fonts = [archivo.variable, instrument.variable, plexMono.variable, alexandria.variable, plexArabic.variable].join(" ");

  return (
    <html lang={locale === "ar" ? "ar-AE" : "en-AE"} dir={locale === "ar" ? "rtl" : "ltr"} className={fonts} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `document.documentElement.classList.add("js");${PRELOAD_SCRIPT}` }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd(locale)) }} />
      </head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <a href="#main" className="skip-link mono fixed start-4 top-2 z-[400] -translate-y-[200%] bg-ink px-4 py-3 text-paper focus:translate-y-0">
            {t("skip")}
          </a>
          <TransitionProvider>
            <Header />
            <main id="main" tabIndex={-1}>
              {children}
            </main>
            <Footer />
          </TransitionProvider>
          <MobileBar />
          <Preloader label={(messages as { preloader: { label: string } }).preloader.label} />
          <Cursor />
          <SmoothScroll />
          <MotionLayer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
