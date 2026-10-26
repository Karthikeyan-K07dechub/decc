import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/** Locale-aware Link, router and helpers. Use these instead of next/link inside the site. */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
