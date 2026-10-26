import { notFound } from "next/navigation";

/** Any unknown path inside a locale renders the "Sheet not found" page. */
export default function CatchAll() {
  notFound();
}
