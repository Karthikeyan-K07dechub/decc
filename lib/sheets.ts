import { company, projects, services } from "@/lib/content";

/**
 * Drawing sheet code for a locale-less path, e.g. "/services/mep-design" → "S-203".
 * Used by the footer title block and the page-transition sheet panel.
 */
export function sheetFor(path: string): { code: string; key: string } {
  const clean = path.replace(/^\/(en|ar)(?=\/|$)/, "") || "/";
  const [, a, b] = clean.split("/");
  if (!a) return { code: company.sheets.home, key: "home" };
  if (a === "services") {
    if (b) {
      const s = services.find((x) => x.slug === b);
      return { code: s?.code ?? company.sheets.services, key: `service:${b}` };
    }
    return { code: company.sheets.services, key: "services" };
  }
  if (a === "projects") {
    if (b) {
      const p = projects.find((x) => x.slug === b);
      return { code: p?.code ?? company.sheets.projects, key: `project:${b}` };
    }
    return { code: company.sheets.projects, key: "projects" };
  }
  if (a in company.sheets) return { code: company.sheets[a as keyof typeof company.sheets], key: a };
  return { code: company.sheets.notFound, key: "notFound" };
}
