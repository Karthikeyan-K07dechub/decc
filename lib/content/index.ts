/**
 * Typed structure for services, projects and sectors.
 * All human-readable text lives in /messages/en.json and /messages/ar.json,
 * keyed by the slugs below; images are referenced by id from /lib/images.ts.
 */
import type { ImageId } from "@/lib/images";

/* ------------------------------------------------------------------ Sectors */

export const sectors = ["villas", "residential", "commercial", "mosques", "industrial"] as const;
export type Sector = (typeof sectors)[number];

/* ------------------------------------------------------------------ Services */

export type IconName = "compass" | "columns" | "duct" | "hardhat" | "stamp" | "chair";
export type ModelKind = "villa" | "columns" | "pipes" | "crane" | "stamp" | "room";

export interface Service {
  slug: "architectural-design" | "structural-engineering" | "mep-design" | "construction-supervision" | "approvals-permits" | "interior-design";
  code: string;
  icon: IconName;
  image: ImageId;
  model: ModelKind;
  related: string[];
}

export const services: Service[] = [
  { slug: "architectural-design", code: "S-201", icon: "compass", image: "architectDesk", model: "villa", related: ["villa-al-dhait", "villa-julan"] },
  { slug: "structural-engineering", code: "S-202", icon: "columns", image: "concreteFrame", model: "columns", related: ["residential-al-nakheel", "warehouse-al-ghail"] },
  { slug: "mep-design", code: "S-203", icon: "duct", image: "mepDucts", model: "pipes", related: ["commercial-al-hisn", "residential-al-nakheel"] },
  { slug: "construction-supervision", code: "S-204", icon: "hardhat", image: "engineersSite", model: "crane", related: ["residential-dafan", "villa-mina-al-arab"] },
  { slug: "approvals-permits", code: "S-205", icon: "stamp", image: "craneSite", model: "stamp", related: ["mosque-khuzam", "villa-al-dhait"] },
  { slug: "interior-design", code: "S-206", icon: "chair", image: "interior", model: "room", related: ["villa-julan", "villa-mina-al-arab"] },
];

export type ServiceSlug = Service["slug"];
export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);

/* ------------------------------------------------------------------ Projects */

export type ProjectStatus = "completed" | "construction";

export interface Project {
  slug: string;
  code: string;
  sector: Sector;
  status: ProjectStatus;
  image: ImageId;
  gallery: ImageId[];
  /** Line elevation drawn before the photo is revealed. */
  elevation: "villa" | "tower" | "mosque" | "warehouse" | "block";
  scope: ServiceSlug[];
  featured?: boolean;
  /**
   * Schedule values. Every unverified number is "00" until DECC confirms it.
   */
  data: { plotArea: string; floors: string; year: string };
}

export const projects: Project[] = [
  {
    slug: "villa-al-dhait",
    code: "P-301",
    sector: "villas",
    status: "completed",
    image: "villaHero",
    gallery: ["villaHero", "interior", "architectDesk", "engineersSite"],
    elevation: "villa",
    scope: ["architectural-design", "structural-engineering", "mep-design", "approvals-permits", "construction-supervision"],
    featured: true,
    data: { plotArea: "00", floors: "G+1", year: "00" },
  },
  {
    slug: "residential-al-nakheel",
    code: "P-302",
    sector: "residential",
    status: "completed",
    image: "residential",
    gallery: ["residential", "concreteFrame", "mepDucts", "engineersSite"],
    elevation: "block",
    scope: ["architectural-design", "structural-engineering", "mep-design", "approvals-permits"],
    featured: true,
    data: { plotArea: "00", floors: "G+4", year: "00" },
  },
  {
    slug: "mosque-khuzam",
    code: "P-303",
    sector: "mosques",
    status: "completed",
    image: "mosque",
    gallery: ["mosque", "architectDesk", "concreteFrame"],
    elevation: "mosque",
    scope: ["architectural-design", "structural-engineering", "approvals-permits", "construction-supervision"],
    featured: true,
    data: { plotArea: "00", floors: "G", year: "00" },
  },
  {
    slug: "warehouse-al-ghail",
    code: "P-304",
    sector: "industrial",
    status: "construction",
    image: "warehouse",
    gallery: ["warehouse", "craneSite", "concreteFrame"],
    elevation: "warehouse",
    scope: ["structural-engineering", "mep-design", "approvals-permits", "construction-supervision"],
    featured: true,
    data: { plotArea: "00", floors: "G+M", year: "00" },
  },
  {
    slug: "villa-julan",
    code: "P-305",
    sector: "villas",
    status: "completed",
    image: "villaDusk",
    gallery: ["villaDusk", "interior", "architectDesk"],
    elevation: "villa",
    scope: ["architectural-design", "interior-design", "mep-design", "approvals-permits"],
    data: { plotArea: "00", floors: "G+1", year: "00" },
  },
  {
    slug: "commercial-al-hisn",
    code: "P-306",
    sector: "commercial",
    status: "completed",
    image: "commercial",
    gallery: ["commercial", "mepDucts", "engineersSite"],
    elevation: "tower",
    scope: ["architectural-design", "structural-engineering", "mep-design", "approvals-permits"],
    data: { plotArea: "00", floors: "G+3", year: "00" },
  },
  {
    slug: "residential-dafan",
    code: "P-307",
    sector: "residential",
    status: "construction",
    image: "concreteFrame",
    gallery: ["concreteFrame", "craneSite", "engineersSite"],
    elevation: "block",
    scope: ["structural-engineering", "approvals-permits", "construction-supervision"],
    data: { plotArea: "00", floors: "G+5", year: "00" },
  },
  {
    slug: "villa-mina-al-arab",
    code: "P-308",
    sector: "villas",
    status: "construction",
    image: "villaCourt",
    gallery: ["villaCourt", "interior", "craneSite"],
    elevation: "villa",
    scope: ["architectural-design", "interior-design", "construction-supervision"],
    data: { plotArea: "00", floors: "G+1", year: "00" },
  },
];

export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug);
export const featuredProjects = projects.filter((p) => p.featured);

/* ------------------------------------------------------------------ Company facts */

export const company = {
  founded: 2009,
  phone: "+971 7 233 6166",
  phoneHref: "tel:+97172336166",
  whatsapp: "+971 56 210 1661",
  whatsappNumber: "971562101661",
  email: "info@decc.ae",
  instagram: "designer_office",
  coords: { lat: 25.7911, lng: 55.9602, label: "25.7911°N 55.9602°E" },
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=25.7911,55.9602",
  /** Every page's drawing sheet code. */
  sheets: {
    home: "A-000",
    about: "A-100",
    services: "S-200",
    projects: "P-300",
    careers: "A-400",
    contact: "C-900",
    notFound: "X-404",
  },
} as const;

/** Years in practice, counted from 2009. */
export const yearsActive = () => new Date().getFullYear() - company.founded;

/** Flag: testimonials are built but hidden until DECC supplies real, approved quotes. */
export const SHOW_TESTIMONIALS = false;
