import { Archivo, Instrument_Sans, IBM_Plex_Mono, Alexandria, IBM_Plex_Sans_Arabic } from "next/font/google";

/* All fonts via next/font/google: downloaded at build time and self-hosted, no layout shift. */

/** Display: Archivo with its width axis (used at 115–125) and weight 700–800. */
export const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

/** Body: Instrument Sans 400–500. */
export const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

/** Annotations: IBM Plex Mono, uppercase, letter-spaced. */
export const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

/** Arabic headings. */
export const alexandria = Alexandria({
  subsets: ["arabic", "latin"],
  variable: "--font-alexandria",
  display: "swap",
  preload: false,
});

/** Arabic body. */
export const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-arabic",
  display: "swap",
  preload: false,
});
