import { getTranslations } from "next-intl/server";
import { company } from "@/lib/content";

/** Sticky bottom bar on phones and tablets: Call and WhatsApp. */
export async function MobileBar() {
  const t = await getTranslations("mobileBar");
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[85] grid grid-cols-2 border-t border-ink/15 bg-paper lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <a href={company.phoneHref} className="mono flex min-h-14 items-center justify-center gap-2 border-e border-ink/15 text-ink">
        {t("call")}
      </a>
      <a href={`https://wa.me/${company.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="mono flex min-h-14 items-center justify-center gap-2 bg-clay text-white">
        {t("whatsapp")}
      </a>
    </div>
  );
}
