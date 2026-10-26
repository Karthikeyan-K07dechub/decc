import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Everything except API, Next internals, files with an extension, and SEO files.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
