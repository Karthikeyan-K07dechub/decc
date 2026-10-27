/**
 * THE ONLY PLACE IMAGE URLS LIVE.
 *
 * Every photo is a free Unsplash photo (Unsplash License, free for commercial use),
 * checked on its Unsplash page for ID, licence and subject. All of them are
 * stand-ins (`placeholder: true`) until DECC supplies its own project photography.
 *
 * To replace a photo: change `url` (and `credit`, `alt`), or point `url` at a file
 * in /public (e.g. "/images/villa-al-dhait.jpg") and set `placeholder: false`.
 * Then run `npm run blur` to refresh the blur placeholders in lib/blur.json.
 */
import blur from "./blur.json";

export type ImageId =
  | "villaHero"
  | "villaDusk"
  | "villaCourt"
  | "mountains"
  | "engineersSite"
  | "concreteFrame"
  | "engineeringFacade"
  | "craneSite"
  | "mepDucts"
  | "mosque"
  | "residential"
  | "commercial"
  | "warehouse"
  | "architectDesk"
  | "interior"
  | "officeTower"
  | "teamDirector"
  | "teamArchitect"
  | "teamStructural"
  | "teamMep"
  | "teamSite"
  | "teamInterior";

export interface SiteImage {
  id: ImageId;
  url: string;
  alt: { en: string; ar: string };
  credit: { name: string; page: string };
  /** true until replaced with DECC's own photography */
  placeholder: boolean;
  /** Dominant tone, used when no blur data has been generated yet. */
  tone: string;
}

const u = (path: string) => `https://images.unsplash.com/${path}`;

export const images: Record<ImageId, SiteImage> = {
  teamDirector: {
    id: "teamDirector",
    url: u("photo-1600878459138-e1123b37cb30"),
    alt: { en: "Stock portrait for an illustrative managing director profile", ar: "صورة توضيحية لملف مدير عام افتراضي" },
    credit: { name: "Itay Verchik", page: "https://unsplash.com/photos/YmQ8TrsieE4" },
    placeholder: true,
    tone: "#b8b5ae",
  },
  teamArchitect: {
    id: "teamArchitect",
    url: u("photo-1573497019940-1c28c88b4f3e"),
    alt: { en: "Stock portrait for an illustrative lead architect profile", ar: "صورة توضيحية لملف كبيرة معماريين افتراضي" },
    credit: { name: "Christina @ wocintechchat.com", page: "https://unsplash.com/photos/SJvDxw0azqw" },
    placeholder: true,
    tone: "#bfc5c5",
  },
  teamStructural: {
    id: "teamStructural",
    url: u("photo-1500648767791-00dcc994a43e"),
    alt: { en: "Stock portrait for an illustrative structural engineer profile", ar: "صورة توضيحية لملف مهندس إنشائي افتراضي" },
    credit: { name: "Jurica Koletić", page: "https://unsplash.com/photos/7YVZYZeITc8" },
    placeholder: true,
    tone: "#c6c4be",
  },
  teamMep: {
    id: "teamMep",
    url: u("photo-1506794778202-cad84cf45f1d"),
    alt: { en: "Stock portrait for an illustrative MEP engineer profile", ar: "صورة توضيحية لملف مهندس كهروميكانيك افتراضي" },
    credit: { name: "Albert Dera", page: "https://unsplash.com/photos/ILip77SbmOE" },
    placeholder: true,
    tone: "#b9b8b2",
  },
  teamSite: {
    id: "teamSite",
    url: u("photo-1507003211169-0a1dd7228f2d"),
    alt: { en: "Stock portrait for an illustrative site engineer profile", ar: "صورة توضيحية لملف مهندس موقع افتراضي" },
    credit: { name: "Joseph Gonzalez", page: "https://unsplash.com/photos/iFgRcqHznqg" },
    placeholder: true,
    tone: "#c5bcac",
  },
  teamInterior: {
    id: "teamInterior",
    url: u("photo-1494790108377-be9c29b29330"),
    alt: { en: "Stock portrait for an illustrative interior designer profile", ar: "صورة توضيحية لملف مصممة داخلية افتراضي" },
    credit: { name: "Michael Dam", page: "https://unsplash.com/photos/mEZ3PoFGs_k" },
    placeholder: true,
    tone: "#b9c1b8",
  },
  villaHero: {
    id: "villaHero",
    url: u("photo-1613977257363-707ba9348227"),
    alt: { en: "A modern white villa with a swimming pool and outdoor lounge", ar: "فيلا بيضاء حديثة مع مسبح وجلسة خارجية" },
    credit: { name: "John Fornander", page: "https://unsplash.com/photos/modern-white-villa-with-swimming-pool-Id7u0EkTjBE" },
    placeholder: true,
    tone: "#cfc6b6",
  },
  villaDusk: {
    id: "villaDusk",
    url: u("photo-1757524492552-d47a66a2b63e"),
    alt: { en: "A modern house with large windows at dusk", ar: "منزل حديث بنوافذ واسعة عند الغروب" },
    credit: { name: "Michael Brown", page: "https://unsplash.com/photos/modern-house-with-large-windows-at-dusk-cUoXTLVFQ9M" },
    placeholder: true,
    tone: "#5a5560",
  },
  villaCourt: {
    id: "villaCourt",
    url: u("photo-1619784924192-050aabcb0653"),
    alt: { en: "A villa with stone walls under a clear sky in the UAE", ar: "فيلا بجدران حجرية تحت سماء صافية في الإمارات" },
    credit: { name: "Saj Shafique", page: "https://unsplash.com/photos/brown-concrete-building-under-blue-sky-during-daytime-u8VCtaFGzkk" },
    placeholder: true,
    tone: "#b9a58a",
  },
  mountains: {
    id: "mountains",
    url: u("photo-1625079068924-f1f139a2e2b6"),
    alt: { en: "Rocky Hajar mountains at Wadi Ghalilah, Ras Al Khaimah", ar: "جبال الحجر الصخرية في وادي غليلة، رأس الخيمة" },
    credit: { name: "Tesson Thaliath", page: "https://unsplash.com/photos/brown-rocky-mountain-under-white-cloudy-sky-during-daytime-K9hRfWMYUFY" },
    placeholder: true,
    tone: "#8a7a66",
  },
  engineersSite: {
    id: "engineersSite",
    url: u("photo-1742112125567-3e8967bad60f"),
    alt: { en: "Engineers reviewing drawings together on site", ar: "مهندسون يراجعون المخططات معًا في الموقع" },
    credit: { name: "Ronnakorn Triraganon", page: "https://unsplash.com/photos/construction-workers-review-plans-at-a-job-site-IvEYfb-3B70" },
    placeholder: true,
    tone: "#7d7a72",
  },
  engineeringFacade: {
    id: "engineeringFacade",
    url: u("photo-1763850407744-d2e14b99b1b9"),
    alt: { en: "Clean concrete lines and a glass facade on a modern building beneath a blue sky", ar: "خطوط خرسانية واضحة وواجهة زجاجية لمبنى حديث تحت سماء زرقاء" },
    credit: { name: "Ivan Rohovchenko", page: "https://unsplash.com/photos/modern-concrete-building-with-glass-facade-under-blue-sky-RvZbzrLX6LM" },
    placeholder: true,
    tone: "#a0b9c2",
  },
  concreteFrame: {
    id: "concreteFrame",
    url: u("photo-1769284013173-47150b8c7e51"),
    alt: { en: "A concrete structure under construction with scaffolding", ar: "هيكل خرساني قيد الإنشاء مع السقالات" },
    credit: { name: "Julia Taubitz", page: "https://unsplash.com/photos/construction-site-with-complex-concrete-structures-and-scaffolding-OKZRUxijthA" },
    placeholder: true,
    tone: "#8c8a83",
  },
  craneSite: {
    id: "craneSite",
    url: u("photo-1693301892309-55d6e6095452"),
    alt: { en: "A construction site with a crane and concrete works", ar: "موقع إنشاء مع رافعة وأعمال خرسانية" },
    credit: { name: "Ricardo Gomez Angel", page: "https://unsplash.com/photos/a-construction-site-with-a-crane-and-construction-equipment-0mHVYlNcDy0" },
    placeholder: true,
    tone: "#8f8b82",
  },
  mepDucts: {
    id: "mepDucts",
    url: u("photo-1786840671711-bdabee8634cf"),
    alt: { en: "Ventilation ducts running below a ceiling", ar: "مجاري تهوية ممتدة أسفل السقف" },
    credit: { name: "Spencer Liao", page: "https://unsplash.com/photos/ventilation-ducts-in-industrial-workspace-L23Drc99Cyk" },
    placeholder: true,
    tone: "#7f8483",
  },
  mosque: {
    id: "mosque",
    url: u("photo-1763965367087-589990c8f1a3"),
    alt: { en: "Mosque domes and minarets against a warm evening sky", ar: "قباب ومآذن مسجد في سماء مسائية دافئة" },
    credit: { name: "Spenser Sembrat", page: "https://unsplash.com/photos/domes-of-a-mosque-against-a-peachy-sky-YplrsxgzMCI" },
    placeholder: true,
    tone: "#c9a589",
  },
  residential: {
    id: "residential",
    url: u("photo-1758193431351-68538bf55ec3"),
    alt: { en: "A modern mid-rise apartment building with balconies and greenery", ar: "مبنى سكني حديث متوسط الارتفاع بشرفات ومساحات خضراء" },
    credit: { name: "Aalo Lens", page: "https://unsplash.com/photos/modern-apartment-building-with-balconies-and-greenery-B9OMpxCdrlc" },
    placeholder: true,
    tone: "#a39b8c",
  },
  commercial: {
    id: "commercial",
    url: u("photo-1610637988384-3154e5644f4b"),
    alt: { en: "A sand-coloured concrete commercial building", ar: "مبنى تجاري خرساني بلون الرمل" },
    credit: { name: "Syed Ayan Malik", page: "https://unsplash.com/photos/brown-concrete-building-under-blue-sky-during-daytime-DI3MlpRdYeE" },
    placeholder: true,
    tone: "#a89379",
  },
  warehouse: {
    id: "warehouse",
    url: u("photo-1758789667762-56175fe4601c"),
    alt: { en: "A modern warehouse with loading docks", ar: "مستودع حديث مع أرصفة تحميل" },
    credit: { name: "Theo Marjoram", page: "https://unsplash.com/photos/modern-industrial-building-exterior-with-loading-docks-V2GZeHNwP5w" },
    placeholder: true,
    tone: "#9a9c9b",
  },
  architectDesk: {
    id: "architectDesk",
    url: u("photo-1503387762-592deb58ef4e"),
    alt: { en: "An architect drawing with a pencil and scale rule", ar: "مهندس معماري يرسم بقلم رصاص ومسطرة قياس" },
    credit: { name: "Daniel McCullough", page: "https://unsplash.com/photos/an-architect-working-on-a-draft-with-a-pencil-and-ruler-HtBlQdxfG9k" },
    placeholder: true,
    tone: "#b8a98e",
  },
  interior: {
    id: "interior",
    url: u("photo-1583847268964-b28dc8f51f92"),
    alt: { en: "A calm living room with a large window", ar: "غرفة معيشة هادئة بنافذة واسعة" },
    credit: { name: "Minh Pham", page: "https://unsplash.com/photos/a-living-room-filled-with-furniture-and-a-large-window-OtXADkUh3-I" },
    placeholder: true,
    tone: "#c8bda9",
  },
  officeTower: {
    id: "officeTower",
    url: u("photo-1641574003782-a2f852650185"),
    alt: {
      en: "A tall building lit at night (stand-in for Julphar Tower, Ras Al Khaimah)",
      ar: "برج مضاء ليلًا (صورة مؤقتة بدلًا من برج جلفار، رأس الخيمة)",
    },
    credit: { name: "Lucia Macedo", page: "https://unsplash.com/photos/a-very-tall-building-lit-up-at-night-24s63ot3gPs" },
    placeholder: true,
    tone: "#2a2f2c",
  },
};

/** Tiny blurred preview for next/image. Generated by `npm run blur`; falls back to a flat tone. */
export function blurFor(id: ImageId): string {
  const data = (blur as Record<string, string>)[id];
  if (data) return data;
  const tone = images[id].tone;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="5"><rect width="8" height="5" fill="${tone}"/></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function img(id: ImageId, locale: string) {
  const i = images[id];
  return { src: i.url, alt: locale === "ar" ? i.alt.ar : i.alt.en, blurDataURL: blurFor(id), placeholder: i.placeholder };
}
